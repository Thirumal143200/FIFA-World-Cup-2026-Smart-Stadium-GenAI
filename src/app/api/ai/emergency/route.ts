// src/app/api/ai/emergency/route.ts
// AI Emergency Assistance API — generates real-time emergency guidance

import { NextRequest, NextResponse } from 'next/server';
import { askGemini } from '@/lib/gemini/client';
import { SYSTEM_PROMPTS } from '@/lib/gemini/prompts';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { sanitizeInput } from '@/lib/security/sanitize';
import { getStadiumById } from '@/data/stadiums';
import { z } from 'zod';

const EmergencySchema = z.object({
  stadiumId: z.string().min(1),
  incidentType: z.string().min(1),
  currentLocation: z.string().optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
    const rateLimit = await checkRateLimit(ip, 'ai');
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = EmergencySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { stadiumId, incidentType, currentLocation, severity } = parsed.data;
    const stadium = getStadiumById(stadiumId);

    const contextParts = [
      stadium ? `Stadium: ${stadium.name} (${stadium.city}, ${stadium.country})` : '',
      stadium ? `First aid locations: ${stadium.facilities.filter((f) => f.type === 'first-aid').map((f) => f.location).join(', ')}` : '',
      currentLocation ? `Reporter Location: ${currentLocation}` : 'Location within stadium: Unknown',
      `Incident Severity: ${severity.toUpperCase()}`,
    ];

    const response = await askGemini({
      systemPrompt: SYSTEM_PROMPTS.emergency,
      userMessage: `URGENT: Emergency of type "${sanitizeInput(incidentType)}" has occurred. Please provide instant response protocols, first-aid, evacuation directions or security measures.`,
      context: contextParts.filter(Boolean).join('\n'),
    });

    return NextResponse.json({
      protocol: response.text,
      incidentType,
      severity,
      metadata: {
        processingTime: response.processingTime,
        isMock: response.isMock,
      },
    });
  } catch (error) {
    console.error('[API] /ai/emergency error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
