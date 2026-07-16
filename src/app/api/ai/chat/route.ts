// src/app/api/ai/chat/route.ts
// AI Chat API — multilingual conversational assistant powered by Gemini

import { NextRequest, NextResponse } from 'next/server';
import { askGemini } from '@/lib/gemini/client';
import { SYSTEM_PROMPTS } from '@/lib/gemini/prompts';
import { AIChatSchema } from '@/lib/validators/schemas';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { sanitizeInput } from '@/lib/security/sanitize';
import { getStadiumById } from '@/data/stadiums';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'anonymous';
    const rateLimit = await checkRateLimit(ip, 'ai');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before sending more messages.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(rateLimit.reset),
            'Retry-After': '60',
          },
        }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const parsed = AIChatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { message, language, stadiumId, module, context, history } = parsed.data;

    // Sanitize input
    const sanitizedMessage = sanitizeInput(message);
    if (!sanitizedMessage) {
      return NextResponse.json(
        { error: 'Message cannot be empty after sanitization.' },
        { status: 400 }
      );
    }

    // Build context from stadium data
    const stadium = getStadiumById(stadiumId);
    const stadiumContext = stadium
      ? `Current Stadium: ${stadium.name} in ${stadium.city}, ${stadium.state}, ${stadium.country} (Capacity: ${stadium.capacity})\nZones: ${stadium.zones.map((z) => z.name).join(', ')}\nFacilities: ${stadium.facilities.map((f) => f.name).join(', ')}`
      : '';

    const userContext = context
      ? `User Role: ${context.userRole || 'fan'}\nAccessibility Needs: ${context.accessibilityNeeds?.join(', ') || 'None'}\nCurrent Zone: ${context.currentZone || 'Unknown'}`
      : '';

    const historyContext = history && history.length > 0
      ? `Recent Conversation History:\n${history.map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')}`
      : '';

    // Select the appropriate system prompt based on module
    const promptKey = module === 'crowd-prediction'
      ? 'crowdPrediction'
      : module === 'transport'
        ? 'transport'
        : (module as keyof typeof SYSTEM_PROMPTS);

    const systemPrompt = SYSTEM_PROMPTS[promptKey] || SYSTEM_PROMPTS.chat;

    // Call Gemini
    const response = await askGemini({
      systemPrompt,
      userMessage: sanitizedMessage,
      context: [
        stadiumContext,
        userContext,
        historyContext,
        `User Language: ${language}`,
        `Response Language: Respond in ${language}`,
      ]
        .filter(Boolean)
        .join('\n'),
    });

    return NextResponse.json({
      message: response.text,
      language,
      module,
      metadata: {
        processingTime: response.processingTime,
        tokensUsed: response.tokensUsed,
        isMock: response.isMock,
        stadiumId,
      },
    });
  } catch (error) {
    console.error('[API] /ai/chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
