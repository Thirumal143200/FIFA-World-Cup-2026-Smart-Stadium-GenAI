# 🏛️ Architecture & System Design

This document details the system design, file structure, and technical layout of FIFA StadiumOS.

## Overall System Topology

Next.js serves as the single deployment package, exposing server-rendered pages and serverless API endpoints deployed entirely on Vercel.

```
                    ┌──────────────────────────────┐
                    │      Client Browser View     │
                    │   (React components, Zustand)│
                    └──────────────┬───────────────┘
                                   │ HTTPS
                                   ▼
                    ┌──────────────────────────────┐
                    │      Next.js API Routes      │
                    │   (Edge middleware, Zod)     │
                    └──────┬───────────────┬───────┘
                           │               │
                 Firestore │               │ REST Call
                           ▼               ▼
                    ┌────────────┐   ┌────────────┐
                    │ Firebase   │   │ Google     │
                    │ Database   │   │ Gemini API │
                    └────────────┘   └────────────┘
```

## Folder Structure Directory

- `src/app/` — Pages router and backend API handlers.
- `src/components/` — Shared layout elements and custom UI Badges/Cards.
- `src/lib/` — Firebase connectivity, Upstash rate limiters, input sanitizers, and prompts.
- `src/store/` — State stores for live crowd maps, user profiles, and UI notifications.
- `src/types/` — Type barrel and interfaces modeling.
- `src/data/` — Static stadium telemetry logs.

## Security Controls Layer

1. **CSP (Content Security Policy)**: Injected via middleware headers blocking third-party script injection.
2. **Double Cast Mapping**: Generics type assertion satisfying TypeScript compiler checks safely.
3. **Input Sanitization**: Client/Server XSS sanitizing preventing tag injection.
