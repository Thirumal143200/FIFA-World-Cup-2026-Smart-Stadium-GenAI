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

    const {
      from,
      to,
      stadiumId,
      accessibilityNeeds,
      avoidCrowded,
      preferElevator,
      hotel,
      parking,
      seat,
      transportPreference,
    } = parsed.data;

    const stadium = getStadiumById(stadiumId);

    const contextParts = [
      stadium ? `Stadium: ${stadium.name} (${stadium.city}, ${stadium.country})` : '',
      stadium ? `Available Zones: ${stadium.zones.map((z) => `${z.name} (${z.type}, Level ${z.level})`).join('; ')}` : '',
      stadium ? `Facilities: ${stadium.facilities.map((f) => `${f.name} at ${f.location}`).join('; ')}` : '',
      hotel ? `User's Hotel: ${hotel}` : '',
      parking ? `User's Assigned Parking Zone: ${parking}` : '',
      seat ? `User's Ticketed Seat: ${seat}` : '',
      transportPreference ? `Preferred Mode of Transport: ${transportPreference}` : '',
      accessibilityNeeds?.length ? `Accessibility Profile Needs: ${accessibilityNeeds.join(', ')}` : '',
      avoidCrowded ? 'INSTRUCTION: Dynamically avoid crowded concourses.' : '',
      preferElevator ? 'INSTRUCTION: Maximize elevator usage (skip stairs).' : '',
    ];

    const response = await askGemini({
      systemPrompt: `${SYSTEM_PROMPTS.navigation}\n\nAnalyze the inputs (Hotel, Parking, Current Location, Seat, Accessibility, and Transport choice) and output a detailed markdown report containing:\n1. 🚶‍♂️ **Best Route** & **Estimated Walking/Transit Time**\n2. 🗺️ **Alternative Route** (Safer/Less congested option)\n3. ♿ **Accessibility Route** (Wheelchair/Elevator details if applicable)\n4. 🚪 **Gate Recommendation** (Least crowded gate to enter)\n5. 📝 **Explanation & Safety Insights** (Why this was recommended and key security tips)`,
      userMessage: `Route request from current location/starting point "${sanitizeInput(from)}" to destination "${sanitizeInput(to)}"`,
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
