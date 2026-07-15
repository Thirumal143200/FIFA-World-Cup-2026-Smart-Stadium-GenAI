// src/app/api/ai/navigate/route.ts
// AI Navigation API — turn-by-turn stadium directions powered by Gemini

import { NextRequest, NextResponse } from 'next/server';
import { askGemini } from '@/lib/gemini/client';
import { SYSTEM_PROMPTS } from '@/lib/gemini/prompts';
import { AINavigationSchema } from '@/lib/validators/schemas';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { sanitizeInput } from '@/lib/security/sanitize';
import { getStadiumById } from '@/data/stadiums';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
    const rateLimit = await checkRateLimit(ip, 'ai');
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = AINavigationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { from, to, stadiumId, accessibilityNeeds, avoidCrowded, preferElevator } = parsed.data;
    const stadium = getStadiumById(stadiumId);

    const contextParts = [
      stadium ? `Stadium: ${stadium.name} (${stadium.city}, ${stadium.country})` : '',
      stadium ? `Available Zones: ${stadium.zones.map((z) => `${z.name} (${z.type}, Level ${z.level})`).join('; ')}` : '',
      stadium ? `Facilities: ${stadium.facilities.map((f) => `${f.name} at ${f.location}`).join('; ')}` : '',
      accessibilityNeeds?.length ? `Accessibility Needs: ${accessibilityNeeds.join(', ')}` : '',
      avoidCrowded ? 'INSTRUCTION: Avoid crowded areas in the route.' : '',
      preferElevator ? 'INSTRUCTION: Prefer elevator routes over stairs/escalators.' : '',
    ];

    const response = await askGemini({
      systemPrompt: SYSTEM_PROMPTS.navigation,
      userMessage: `Navigate from "${sanitizeInput(from)}" to "${sanitizeInput(to)}"`,
      context: contextParts.filter(Boolean).join('\n'),
    });

    return NextResponse.json({
      route: response.text,
      from,
      to,
      stadiumId,
      metadata: {
        processingTime: response.processingTime,
        isMock: response.isMock,
      },
    });
  } catch (error) {
    console.error('[API] /ai/navigate error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
