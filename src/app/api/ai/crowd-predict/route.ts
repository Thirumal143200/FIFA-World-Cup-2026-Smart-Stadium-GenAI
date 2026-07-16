// src/app/api/ai/crowd-predict/route.ts
// AI Crowd Density Prediction API — analyzes current stadium zones and forecasts density

import { NextRequest, NextResponse } from 'next/server';
import { askGemini } from '@/lib/gemini/client';
import { SYSTEM_PROMPTS } from '@/lib/gemini/prompts';
import { CrowdPredictionSchema } from '@/lib/validators/schemas';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { getStadiumById } from '@/data/stadiums';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
    const rateLimit = await checkRateLimit(ip, 'ai');
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = CrowdPredictionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { stadiumId, eventType, matchImportance, weatherCondition } = parsed.data;
    const stadium = getStadiumById(stadiumId);
    if (!stadium) {
      return NextResponse.json({ error: 'Stadium not found.' }, { status: 404 });
    }

    // Prepare live/simulated state of zones
    // For production-grade simulation, we'll randomize or calculate based on time
    const zoneData = stadium.zones.map((zone) => {
      // Simulate occupancy
      const baseline = zone.status === 'restricted' ? 0.2 : 0.6;
      const noise = Math.random() * 0.3 - 0.1; // -10% to +20%
      const percentage = Math.min(1, Math.max(0.05, baseline + noise));
      return {
        id: zone.id,
        name: zone.name,
        type: zone.type,
        capacity: zone.capacity,
        currentOccupancy: Math.round(zone.capacity * percentage),
        percentage,
        status: percentage > 0.85 ? 'crowded' : percentage > 0.95 ? 'at-capacity' : 'open',
      };
    });

    const contextParts = [
      `Stadium: ${stadium.name} in ${stadium.city}`,
      `Total Capacity: ${stadium.capacity}`,
      `Event Type: ${eventType || 'FIFA Group Stage Match'}`,
      `Match Importance (1-10): ${matchImportance || 7}`,
      `Weather: ${weatherCondition || 'Clear, 22°C'}`,
      `Current Zone Occupancies:\n${zoneData
        .map((z) => `- ${z.name}: ${z.currentOccupancy}/${z.capacity} (${Math.round(z.percentage * 100)}%)`)
        .join('\n')}`,
    ];

    const response = await askGemini({
      systemPrompt: `${SYSTEM_PROMPTS.crowdPrediction}\n\nAnalyze the stadium context and generate a report structured exactly with the following sections:\n📊 **Crowd Risk Score (1-100)**:\n🔮 **Congestion Prediction**:\n🔀 **Suggested Redirection**:\n🚪 **Gate Recommendations**:\n🛡️ **Security Recommendations**:\n🧠 **Reasoning & Explanations**:`,
      userMessage: `Please predict crowd patterns and generate recommendations for safety, logistics, and crowd redirection.`,
      context: contextParts.join('\n'),
    });

    return NextResponse.json({
      stadiumId,
      timestamp: new Date().toISOString(),
      zones: zoneData,
      predictions: response.text,
      metadata: {
        processingTime: response.processingTime,
        isMock: response.isMock,
      },
    });
  } catch (error) {
    console.error('[API] /ai/crowd-predict error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
