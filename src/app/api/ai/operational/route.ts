// src/app/api/ai/operational/route.ts
// AI Operational Intelligence API — returns strategic planning suggestions, resource reallocations, and staffing predictions

import { NextRequest, NextResponse } from 'next/server';
import { askGemini } from '@/lib/gemini/client';
import { SYSTEM_PROMPTS } from '@/lib/gemini/prompts';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { getStadiumById } from '@/data/stadiums';
import { z } from 'zod/v4';

const OperationalRequestSchema = z.object({
  stadiumId: z.string().min(1),
  currentStaffCount: z.number().default(200),
  activeIncidentsCount: z.number().default(0),
  matchStage: z.string().default('pre-match'),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
    const rateLimit = await checkRateLimit(ip, 'ai');
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = OperationalRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { stadiumId, currentStaffCount, activeIncidentsCount, matchStage } = parsed.data;
    const stadium = getStadiumById(stadiumId);

    const contextParts = [
      stadium ? `Stadium: ${stadium.name} (${stadium.city}, ${stadium.country})` : '',
      `Current Staff Count: ${currentStaffCount}`,
      `Active Incidents: ${activeIncidentsCount}`,
      `Match Stage: ${matchStage}`,
    ];

    const response = await askGemini({
      systemPrompt: SYSTEM_PROMPTS.operational,
      userMessage: 'Generate operational insights, resource optimization plan, risk assessment, and staffing recommendations.',
      context: contextParts.filter(Boolean).join('\n'),
    });

    return NextResponse.json({
      insights: response.text,
      metadata: {
        processingTime: response.processingTime,
        isMock: response.isMock,
      },
    });
  } catch (error) {
    console.error('[API] /ai/operational error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
