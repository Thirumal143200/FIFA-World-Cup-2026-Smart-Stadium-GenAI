// src/app/api/ai/accessibility/route.ts
// AI Accessibility Assistance API — details special facilities and visual/mobility routing

import { NextRequest, NextResponse } from 'next/server';
import { askGemini } from '@/lib/gemini/client';
import { SYSTEM_PROMPTS } from '@/lib/gemini/prompts';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { getStadiumById } from '@/data/stadiums';
import { z } from 'zod/v4';

const AccessibilityRequestSchema = z.object({
  stadiumId: z.string().min(1),
  userNeeds: z.array(z.string()).default([]),
  question: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
    const rateLimit = await checkRateLimit(ip, 'ai');
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = AccessibilityRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { stadiumId, userNeeds, question } = parsed.data;
    const stadium = getStadiumById(stadiumId);

    const contextParts = [
      stadium ? `Stadium: ${stadium.name}` : '',
      stadium ? `Accessibility Features:\n${stadium.accessibilityFeatures.map((f) => `- ${f.type}: ${f.description} (Locations: ${f.locations.join(', ')})`).join('\n')}` : '',
      userNeeds.length ? `User specific needs: ${userNeeds.join(', ')}` : 'General accessibility check',
    ];

    const response = await askGemini({
      systemPrompt: SYSTEM_PROMPTS.accessibility,
      userMessage: question,
      context: contextParts.filter(Boolean).join('\n'),
    });

    return NextResponse.json({
      answer: response.text,
      metadata: {
        processingTime: response.processingTime,
        isMock: response.isMock,
      },
    });
  } catch (error) {
    console.error('[API] /ai/accessibility error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
