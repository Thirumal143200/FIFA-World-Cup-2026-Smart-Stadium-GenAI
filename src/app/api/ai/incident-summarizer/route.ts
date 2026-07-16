// src/app/api/ai/incident-summarizer/route.ts
// AI Incident Summarizer API — converts free-text descriptions into structured incident fields using Gemini

import { NextRequest, NextResponse } from 'next/server';
import { askGemini } from '@/lib/gemini/client';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { sanitizeInput } from '@/lib/security/sanitize';
import { z } from 'zod';

const SummarizeSchema = z.object({
  description: z.string().min(3).max(1000),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
    const rateLimit = await checkRateLimit(ip, 'ai');
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = SummarizeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid description', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { description } = parsed.data;

    const systemPrompt = `You are the FIFA StadiumOS Safety Intelligence AI.
Given a free-text incident description, analyze it and output a strict JSON object containing the following keys (do not include any other markdown formatting or text outside the JSON block):
{
  "title": "A short, professional title (e.g., 'Gate B Crowding Issue')",
  "category": "One of: 'medical', 'security', 'fire', 'weather', 'structural', 'other'",
  "severity": "One of: 'low', 'medium', 'high', 'critical'",
  "priority": "One of: 'low', 'medium', 'high', 'critical'",
  "suggestedResponse": "Specific immediate action steps for stadium staff.",
  "operationalSummary": "A concise executive summary of the issue.",
  "recommendedStaff": "Type of personnel to deploy (e.g., '2 Security Officers, 1 First-Aid Responder')"
}`;

    const response = await askGemini({
      systemPrompt,
      userMessage: `Analyze this description: "${sanitizeInput(description)}"`,
    });

    let structuredData;
    try {
      // Clean potential JSON markdown wrapping from Gemini output
      const cleanedText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
      structuredData = JSON.parse(cleanedText);
    } catch {
      console.warn('[Incident Summarizer] Failed to parse JSON from Gemini, using heuristic fallback:', response.text);
      
      // Fallback heuristics
      const text = response.text.toLowerCase();
      let category = 'other';
      if (text.includes('medical') || text.includes('heart') || text.includes('injur') || text.includes('hurt')) category = 'medical';
      else if (text.includes('fight') || text.includes('dispute') || text.includes('security') || text.includes('suspicious')) category = 'security';
      else if (text.includes('fire') || text.includes('smoke')) category = 'fire';
      else if (text.includes('weather') || text.includes('rain') || text.includes('lightning')) category = 'weather';
      else if (text.includes('gate') || text.includes('leak') || text.includes('stair')) category = 'structural';

      let severity = 'medium';
      if (text.includes('critical') || text.includes('emergency') || text.includes('immediate')) severity = 'critical';
      else if (text.includes('high') || text.includes('severe')) severity = 'high';
      else if (text.includes('low') || text.includes('minor')) severity = 'low';

      structuredData = {
        title: description.split('.')[0].substring(0, 50) + (description.length > 50 ? '...' : ''),
        category,
        severity,
        priority: severity,
        suggestedResponse: 'Deploy nearest duty officer to inspect the specified area and establish contact.',
        operationalSummary: description,
        recommendedStaff: category === 'medical' ? 'First-Aid Crew' : 'Security Patrol',
      };
    }

    return NextResponse.json({
      summary: structuredData,
      metadata: {
        processingTime: response.processingTime,
        isMock: response.isMock,
      },
    });
  } catch (error) {
    console.error('[API] /api/ai/incident-summarizer error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
