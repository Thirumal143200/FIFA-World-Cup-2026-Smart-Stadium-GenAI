// src/app/api/ai/emergency/route.ts
// AI Emergency Assistance API — generates real-time emergency guidance

import { NextRequest, NextResponse } from 'next/server';
import { askGemini } from '@/lib/gemini/client';
import { SYSTEM_PROMPTS } from '@/lib/gemini/prompts';
import { handleApiRateLimit } from '@/lib/security/rate-limit';
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
    const rateLimitResponse = await handleApiRateLimit(request, 'ai');
    if (rateLimitResponse) return rateLimitResponse;

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
      systemPrompt: `${SYSTEM_PROMPTS.emergency}\n\nProvide the emergency response protocol as a clean markdown document structured exactly with the following sections:\n🚨 **Priority**:\n⚠️ **Risk Level**:\n👣 **Immediate Actions**:\n🛣️ **Nearest Safe Route**:\n🏥 **Nearest Medical Point**:\n📞 **Who should be contacted**:\n📋 **Operational Summary**:`,
      userMessage: `URGENT: Emergency of type "${sanitizeInput(incidentType)}" has occurred.`,
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
