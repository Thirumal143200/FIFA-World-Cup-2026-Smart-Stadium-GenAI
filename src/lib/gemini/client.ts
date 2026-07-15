// src/lib/gemini/client.ts
// Gemini AI client — singleton with fallback mock responses

import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';
import { AI_CONFIG } from '@/lib/constants';

let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10);
}

function getModel(): GenerativeModel | null {
  if (model) return model;
  if (!isGeminiConfigured()) return null;

  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  model = genAI.getGenerativeModel({
    model: AI_CONFIG.model,
    generationConfig: {
      maxOutputTokens: AI_CONFIG.maxOutputTokens,
      temperature: AI_CONFIG.temperature,
      topP: AI_CONFIG.topP,
      topK: AI_CONFIG.topK,
    },
  });
  return model;
}

export interface GeminiRequest {
  systemPrompt: string;
  userMessage: string;
  context?: string;
}

export interface GeminiResponse {
  text: string;
  tokensUsed?: number;
  processingTime: number;
  isMock: boolean;
}

/**
 * Send a prompt to Gemini and get a response.
 * Falls back to mock responses when API key is not configured.
 */
export async function askGemini(request: GeminiRequest): Promise<GeminiResponse> {
  const startTime = Date.now();
  const geminiModel = getModel();

  if (!geminiModel) {
    return generateMockResponse(request, startTime);
  }

  try {
    const fullPrompt = buildPrompt(request);
    const result = await geminiModel.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    return {
      text,
      tokensUsed: response.usageMetadata?.totalTokenCount,
      processingTime: Date.now() - startTime,
      isMock: false,
    };
  } catch (error) {
    console.error('[Gemini] API error, falling back to mock:', error);
    return generateMockResponse(request, startTime);
  }
}

/**
 * Stream a response from Gemini (for chat-like experiences).
 */
export async function* streamGemini(
  request: GeminiRequest
): AsyncGenerator<string, void, unknown> {
  const geminiModel = getModel();

  if (!geminiModel) {
    const mock = await generateMockResponse(request, Date.now());
    const words = mock.text.split(' ');
    for (const word of words) {
      yield word + ' ';
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
    return;
  }

  try {
    const fullPrompt = buildPrompt(request);
    const result = await geminiModel.generateContentStream(fullPrompt);
    for await (const chunk of result.stream) {
      yield chunk.text();
    }
  } catch (error) {
    console.error('[Gemini] Stream error:', error);
    yield 'I apologize, but I encountered an error. Please try again.';
  }
}

function buildPrompt(request: GeminiRequest): string {
  let prompt = `${request.systemPrompt}\n\n`;
  if (request.context) {
    prompt += `Context:\n${request.context}\n\n`;
  }
  prompt += `User: ${request.userMessage}`;
  return prompt;
}

function generateMockResponse(request: GeminiRequest, startTime: number): GeminiResponse {
  const lowerMsg = request.userMessage.toLowerCase();

  let text: string;

  if (lowerMsg.includes('navigate') || lowerMsg.includes('direction') || lowerMsg.includes('find') || lowerMsg.includes('where')) {
    text = `📍 **Navigation Guidance**

Based on your request, here are the directions:

1. **Start** at your current location near the main concourse
2. **Walk straight** past the food court area (about 50 meters)
3. **Turn right** at the FIFA merchandise stand
4. **Continue** along the corridor for approximately 30 meters
5. **Your destination** will be on your left

⏱️ Estimated walking time: 3-4 minutes
♿ This route is fully wheelchair accessible
🚻 Nearest restrooms are along the way at Section 112

💡 *Tip: The concourse is currently at moderate crowd density. You should have a smooth walk.*`;
  } else if (lowerMsg.includes('crowd') || lowerMsg.includes('busy') || lowerMsg.includes('density')) {
    text = `📊 **Crowd Intelligence Report**

Current stadium overview:
- **Overall Occupancy**: 67% (moderate)
- **Busiest Zone**: Gate A Concourse (82%)
- **Quietest Zone**: Upper Level South (41%)

🔮 **15-Minute Prediction**: 
- Gate areas expected to decrease by 8% as fans settle
- Concession areas peak expected in 12 minutes

📋 **Recommendations**:
1. Visit restrooms on the upper level for shorter wait times
2. Food courts on the east side are currently less crowded
3. Consider using Gate C for exit — it has 40% less foot traffic

*Updated 30 seconds ago. Crowd data refreshes every 60 seconds.*`;
  } else if (lowerMsg.includes('emergency') || lowerMsg.includes('help') || lowerMsg.includes('medical') || lowerMsg.includes('sos')) {
    text = `🚨 **Emergency Assistance**

If this is a life-threatening emergency, please alert the nearest staff member immediately or call stadium security.

📞 **Emergency Contacts**:
- Stadium Security: Extension 911
- Medical Team: Extension 900
- Fire/Evacuation: Extension 901

🏥 **Nearest Medical Station**: Section 124, Level 1 (2 minutes from most locations)

📋 **While waiting for help**:
1. Stay calm and stay where you are
2. If safe, move to the nearest clear area
3. Alert fans nearby for assistance
4. Follow instructions from stadium staff

*Medical response teams are positioned across the stadium with an average response time of under 3 minutes.*`;
  } else if (lowerMsg.includes('transport') || lowerMsg.includes('parking') || lowerMsg.includes('bus') || lowerMsg.includes('metro') || lowerMsg.includes('train')) {
    text = `🚗 **Transportation Guide**

Here are your options for getting to/from the stadium:

🚇 **Public Transit** (Recommended — eco-friendly!)
- Metro/Rail service available with direct stadium connection
- Estimated travel time: 15-25 minutes from city center
- Cost: $2-5 per trip

🚌 **FIFA Fan Shuttle** 
- Free with your match ticket
- Runs every 10 minutes from key locations
- Fully accessible vehicles available

🅿️ **Parking**
- Available in surrounding lots
- Current availability: 65% of spaces open
- Cost: $30-75 depending on lot

🚕 **Rideshare (Uber/Lyft)**
- Designated drop-off and pickup zones
- Expect surge pricing 30 minutes before and after matches

🌿 *Choosing public transit saves approximately 2.3 kg of CO₂ per trip!*`;
  } else if (lowerMsg.includes('accessibility') || lowerMsg.includes('wheelchair') || lowerMsg.includes('accessible')) {
    text = `♿ **Accessibility Information**

The stadium is fully equipped for accessibility needs:

🦽 **Mobility**
- Wheelchair ramps at all entry gates
- Elevators to every level (NE, NW, SE, SW corners)
- Accessible seating in all sections
- Companion seating available adjacent to wheelchair spaces

🦻 **Hearing**
- Hearing loop system in select areas
- Captioning available on the main display screen
- Sign language interpreters at Guest Services

👁️ **Vision**
- Braille signage at key locations
- Audio description service available
- High-contrast wayfinding markers

🧠 **Sensory/Cognitive**
- Dedicated sensory room (Level 2)
- Quiet zones marked on stadium map
- Simplified navigation assistance available

📍 Nearest accessible restroom: Section 106, Level 1`;
  } else if (lowerMsg.includes('sustain') || lowerMsg.includes('green') || lowerMsg.includes('eco') || lowerMsg.includes('carbon')) {
    text = `🌱 **Sustainability Dashboard**

Today's environmental metrics:

⚡ **Energy**: 72% from renewable sources (solar + wind)
💧 **Water**: 15,000L recycled today (34% of total usage)
♻️ **Waste**: 78% diversion rate (12 tons diverted from landfill)
🌍 **Carbon**: 45 tons offset through carbon credits

📊 **Your Personal Impact**:
- By attending today, your estimated carbon footprint: 4.2 kg CO₂
- If you used public transit: Already saving 2.3 kg CO₂!

💡 **Eco-Actions You Can Take**:
1. Use the recycling stations at every concourse (blue bins)
2. Choose plant-based food options at concession stands
3. Refill water at free water stations instead of buying plastic
4. Take public transit or share rides for departure

🏆 *This stadium scored 87/100 on the FIFA Green Stadium Index!*`;
  } else {
    text = `👋 **Welcome to FIFA StadiumOS!**

I'm your AI-powered stadium assistant for the FIFA World Cup 2026™. I can help you with:

🗺️ **Navigation** — "How do I get to Section 214?"
👥 **Crowd Updates** — "How busy is the food court?"
🌍 **Translation** — "Translate 'where is the restroom' to Spanish"
🚗 **Transportation** — "What's the best way to get home?"
♿ **Accessibility** — "Find wheelchair-accessible routes"
🌱 **Sustainability** — "What's the stadium's eco-score?"
🚨 **Emergency** — "I need medical help"

Just ask me anything! I support 30+ languages and can provide voice guidance.

*Tip: Try specific questions for the most helpful responses.*`;
  }

  return {
    text,
    processingTime: Date.now() - startTime,
    isMock: true,
  };
}

export { isGeminiConfigured };
