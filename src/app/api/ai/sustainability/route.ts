// src/app/api/ai/sustainability/route.ts
// AI Sustainability Advisor API — estimates travel carbon footprint and yields eco suggestions

import { NextRequest, NextResponse } from 'next/server';
import { askGemini } from '@/lib/gemini/client';
import { SYSTEM_PROMPTS } from '@/lib/gemini/prompts';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { getStadiumById } from '@/data/stadiums';
import { z } from 'zod/v4';

const SustainabilityRequestSchema = z.object({
  stadiumId: z.string().min(1),
  travelMode: z.string().optional(),
  distanceKm: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
    const rateLimit = await checkRateLimit(ip, 'ai');
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = SustainabilityRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { stadiumId, travelMode, distanceKm } = parsed.data;
    const stadium = getStadiumById(stadiumId);

    const contextParts = [
      stadium ? `Stadium: ${stadium.name} in ${stadium.city}` : '',
      travelMode ? `Fan travel mode: ${travelMode}` : '',
      distanceKm ? `Travel distance: ${distanceKm} km` : '',
    ];

    const response = await askGemini({
      systemPrompt: SYSTEM_PROMPTS.sustainability,
      userMessage: 'Analyze our current metrics, calculate personal carbon footprint recommendations, and offer sustainable actions.',
      context: contextParts.filter(Boolean).join('\n'),
    });

    return NextResponse.json({
      recommendations: response.text,
      metadata: {
        processingTime: response.processingTime,
        isMock: response.isMock,
      },
    });
  } catch (error) {
    console.error('[API] /ai/sustainability error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
