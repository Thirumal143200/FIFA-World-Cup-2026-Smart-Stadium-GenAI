// src/app/api/ai/sustainability/route.ts
// AI Sustainability Advisor API — estimates travel carbon footprint and yields eco suggestions

import { NextRequest, NextResponse } from 'next/server';
import { askGemini } from '@/lib/gemini/client';
import { SYSTEM_PROMPTS } from '@/lib/gemini/prompts';
import { handleApiRateLimit } from '@/lib/security/rate-limit';
import { getStadiumById } from '@/data/stadiums';
import { z } from 'zod';

const SustainabilityRequestSchema = z.object({
  stadiumId: z.string().min(1),
  travelMode: z.string().optional(),
  distanceKm: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await handleApiRateLimit(request, 'ai');
    if (rateLimitResponse) return rateLimitResponse;

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
      systemPrompt: `${SYSTEM_PROMPTS.sustainability}\n\nProvide the sustainability advice as a clean markdown report structured exactly with the following sections:\n🚗 **Low-Carbon Travel Recommendations**:\n💧 **Reusable Bottle Stations**:\n♻️ **Waste Disposal & Recycling Locations**:\n⚡ **Energy-Saving Suggestions**:\n🌱 **Eco-Friendly Routes**:\n👥 **Crowd Distribution to Reduce Emissions**:`,
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
