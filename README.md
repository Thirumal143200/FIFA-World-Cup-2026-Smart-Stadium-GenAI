# 🏆 FIFA StadiumOS — Smart Stadium & Tournament Assistant

> Next-Generation AI-powered operational and guest assistance platform built for the **FIFA World Cup 2026™** spanning USA, Mexico, and Canada.

---

## 🗺️ Architectural Overview

FIFA StadiumOS integrates conversational AI, crowd flow forecasting, multi-modal transit coordination, accessibility adaptations, and real-time emergency guidance into one unified command panel. The platform adapts to **5 user roles** (Fans, Stadium Staff, Volunteers, Organizers, and Security Teams) with targeted workflows.

```
                  ┌────────────────────────────────────────┐
                  │          Vercel Next.js App            │
                  │        (App Router, TypeScript)        │
                  └──────────────────┬─────────────────────┘
                                     │
                 ┌───────────────────┼────────────────────┐
                 ▼                   ▼                    ▼
       ┌──────────────────┐ ┌──────────────────┐ ┌─────────────────┐
       │ Firebase Auth &  │ │ Google Gemini    │ │ Google Maps     │
       │ Firestore (Live) │ │ REST API Engine  │ │ Javascript SDK  │
       └──────────────────┘ └──────────────────┘ └─────────────────┘
```

---

## 🧠 Specialized Gemini AI Modules

StadiumOS relies on Google Gemini API to power 8 dedicated operational intelligence engines:

1. **AI Stadium Navigator**: Explains turn-by-turn routes inside venues with relative landmarks and walk times.
2. **Crowd Intelligence**: Predicts peak concourse density changes and generates logistic redirection recommendations.
3. **Multilingual Assistant**: Natural conversation assistance supporting 30+ participant nation languages.
4. **Accessibility Advisor**: Automatically adapts navigational instructions to Visual, Auditory, and Mobility Needs.
5. **Emergency Guide (SOS)**: Displays step-by-step first-aid and evacuation protocols during critical safety alerts.
6. **Transport Optimizer**: Recommends multi-modal transit selections based on traffic flow and schedule data.
7. **Sustainability Engine**: Calculates journey carbon footprints and advises eco-diverted actions.
8. **Operational Intelligence**: Provides strategic staffing levels and event risk scores to organizers.

---

## 💻 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4, Lucide Icons, Framer Motion
- **Database / Auth**: Firebase SDK (Firestore real-time telemetry, Authentication)
- **AI Core**: Google Gemini Generative AI SDK (`gemini-2.0-flash`)
- **Rate Limiting**: Upstash Redis (production-grade sliding window)

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Thirumal143200/FIFA-World-Cup-2026-Smart-Stadium-GenAI.git
cd FIFA-World-Cup-2026-Smart-Stadium-GenAI
```

### 2. Configure Environment Variables
Create `.env.local` in the project root:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-javascript-key
```

### 3. Run Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🛠️ Verification & Testing

Verify correctness using built-in testing commands:
- **Type Checking**: `npx tsc --noEmit`
- **Lint Verification**: `npm run lint`

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
