// src/app/api/ai/translate/route.ts
// AI Translation API — handles real-time translations for multi-language dialogue

import { NextRequest, NextResponse } from 'next/server';
import { askGemini } from '@/lib/gemini/client';
import { SYSTEM_PROMPTS } from '@/lib/gemini/prompts';
import { AITranslationSchema } from '@/lib/validators/schemas';
import { handleApiRateLimit } from '@/lib/security/rate-limit';
import { sanitizeInput } from '@/lib/security/sanitize';

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = await handleApiRateLimit(request, 'ai');
    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json();
    const parsed = AITranslationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { text, sourceLanguage, targetLanguage, context } = parsed.data;

    const contextParts = [
      context ? `Context of translation: ${context}` : 'Context of translation: general stadium environment',
      `Translate from: ${sourceLanguage}`,
      `Translate to: ${targetLanguage}`,
    ];

    const response = await askGemini({
      systemPrompt: SYSTEM_PROMPTS.translation,
      userMessage: `Please translate the following text:\n\n"${sanitizeInput(text)}"`,
      context: contextParts.join('\n'),
    });

    return NextResponse.json({
      translatedText: response.text.trim(),
      sourceLanguage,
      targetLanguage,
      metadata: {
        processingTime: response.processingTime,
        isMock: response.isMock,
      },
    });
  } catch (error) {
    console.error('[API] /ai/translate error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
