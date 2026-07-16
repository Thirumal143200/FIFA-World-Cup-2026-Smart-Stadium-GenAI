# 🏆 FIFA StadiumOS — Smart Stadium & Tournament Assistant

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/Thirumal143200/FIFA-World-Cup-2026-Smart-Stadium-GenAI)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js Version](https://img.shields.io/badge/Next.js-16.2.10-blue.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8.svg)](https://tailwindcss.com)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-API_Enabled-orange.svg)](https://ai.google.dev/)
[![WCAG AA](https://img.shields.io/badge/WCAG-2.2_AA_Compliant-success.svg)](#accessibility)

**Live Production URL**: [https://fifa-stadium-ai-navy.vercel.app](https://fifa-stadium-ai-navy.vercel.app)

Next-Generation AI-powered operational and guest assistance platform built for the **FIFA World Cup 2026™** spanning USA, Mexico, and Canada.

---

## 📸 Screenshots & Interfaces

### 1. Unified Landing & Role Selector
```
┌────────────────────────────────────────────────────────┐
│ [⚽ FIFA Badge]                                        │
│               FIFA StadiumOS — 2026                    │
│                                                        │
│   Select Your Role:                                    │
│   ┌───────────────┐ ┌───────────────┐ ┌───────────────┐│
│   │  👥 Fan Hub   │ │  👮 Security  │ │  📊 Organizer ││
│   └───────────────┘ └───────────────┘ └───────────────┘│
│   ┌───────────────┐ ┌───────────────┐                  │
│   │   👷 Staff    │ │    🚨 SOS     │                  │
│   └───────────────┘ └───────────────┘                  │
└────────────────────────────────────────────────────────┘
```
*(Placeholder: `public/screenshots/landing-role-selector.png`)*

### 2. Fan AI Navigator & Accessibility Guides
```
┌────────────────────────────────────────────────────────┐
│ [📍 Navigation]  Select Route: Concourse A -> Sec 112  │
│ ────────────────────────────────────────────────────── │
│   ♿ Wheelchair Route Active                           │
│   Estimated walk time: 3 mins (avoiding Concourse B)   │
│                                                        │
│   AI Turn-by-Turn:                                     │
│   1. Head NW toward Concourse A Elevator.               │
│   2. Take elevator to Level 2.                         │
│   3. Section 112 is on your left past the first-aid.   │
└────────────────────────────────────────────────────────┘
```
*(Placeholder: `public/screenshots/fan-ai-navigator.png`)*

---

## 🏛️ System Architecture

FIFA StadiumOS integrates conversational AI, crowd flow forecasting, multi-modal transit coordination, accessibility adaptations, and real-time emergency guidance into one unified command panel.

```mermaid
graph TD
    %% Styling
    classDef client fill:#1e3a8a,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef server fill:#111827,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef ext fill:#3f3f46,stroke:#71717a,stroke-width:2px,color:#fff;

    subgraph Client ["Client Browser View (Next.js SPA)"]
        Browser[React UI Views]:::client
        Zustand[Zustand Stores]:::client
    end

    subgraph Backend ["Next.js Serverless Edge & Lambdas"]
        API[API Router]:::server
        Sanitize[Sanitization & Zod]:::server
        RateLimit[Upstash Rate Limiter]:::server
    end

    subgraph Databases ["External Database & AI Services"]
        Gemini[Google Gemini API]:::ext
        Firestore[(Firebase Firestore)]:::ext
        Redis[(Upstash Redis Cache)]:::ext
    end

    %% Routing Flow
    Browser -->|HTTPS Request| API
    API --> Sanitize
    Sanitize --> RateLimit
    RateLimit -->|Rate Limit Sync| Redis
    API -->|Prompt Context| Gemini
    API -->|Write/Read Incident logs| Firestore
    Firestore -->|Real-time Snapshot Sync| Zustand
```

---

## 🗄️ Database Schema & ER Diagram

The Firestore database maps stadium configurations, zones, and real-time incident ticketing.

```mermaid
erDiagram
    stadiums {
        string id PK
        string name
        string city
        string country
        number capacity
    }
    zones {
        string id PK
        string stadiumId FK
        string name
        string type
        number capacity
        number level
        string status
    }
    incidents {
        string id PK
        string stadiumId FK
        string category
        string severity
        string status
        string title
        string description
        string createdAt
    }
    responses {
        string id PK
        string incidentId FK
        string action
        string performedBy
        string timestamp
    }

    stadiums ||--o{ zones : "contains"
    stadiums ||--o{ incidents : "tracks"
    incidents ||--o{ responses : "resolves"
```

---

## 🔄 System Workflows & API Flow

### 1. Fan Navigation & Accessibility Query Workflow
```mermaid
sequenceDiagram
    autonumber
    actor Fan as Tournament Fan
    participant UI as Navigator UI
    participant API as /api/ai/navigate
    participant Gemini as Google Gemini AI

    Fan->>UI: Select Origin & Destination (Toggle Wheelchair Access)
    UI->>API: POST { origin, dest, accessibilityNeeds: ["wheelchair"] }
    API->>API: Sanitize input & Verify Rate Limits
    API->>Gemini: Call with navigationPrompt + Stadium details
    Gemini-->>API: Return Markdown route + walk estimates
    API-->>UI: Return JSON { route, walkTime }
    UI->>Fan: Render accessible directions on UI Screen
```

### 2. Emergency SOS Incident Logging & Dispatch Workflow
```mermaid
flowchart TD
    %% Triage Node
    Start([Fan presses SOS button]) --> Select[Select Emergency Category: Medical/Fire/Security]
    Select --> Trigger[Send SOS payload to API]

    %% Backend Processing
    Trigger --> RateCheck{Rate Limit OK?}
    RateCheck -- No --> Block[Return 429 Rate Limit Exceeded]
    RateCheck -- Yes --> CallGemini[Call Gemini Emergency Protocol Model]

    %% Notification / Write State
    CallGemini --> ParseProtocol[Generate First-Aid & Evacuation Protocols]
    ParseProtocol --> WriteDB[(Write Incident Ticket to Firestore)]
    WriteDB --> Dispatch[Broadcast Real-Time SOS Alerts to Security & Staff Panels]
    ParseProtocol --> ShowFan[Display Triage Steps directly to Fan Browser]
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
```

### 3. Run Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📋 Deployment & Submission Checklists

### 1. Deployment Checklist (Vercel)
- [ ] Connect the GitHub repository to your Vercel Dashboard.
- [ ] Add the following Environment Variables in Vercel Settings:
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `GEMINI_API_KEY`
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
- [ ] Set build framework preset to **Next.js**.
- [ ] Deploy. The deployment should build successfully with zero errors.

### 2. Submission Verification Checklist
- [ ] Run type check (`npx tsc --noEmit`) and verify zero errors.
- [ ] Run linter (`npm run lint`) and verify zero warnings/errors.
- [ ] Run test suite (`npm test`) and verify 21/21 passing tests.
- [ ] Run production compiler (`npm run build`) and confirm compiler optimization.
- [ ] Verify that no secrets or API keys are committed in any file.

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
