# 🚀 Deployment Strategy

FIFA StadiumOS is designed to run entirely on **Vercel** as a single deployment package.

## Production Build Verification

Before triggering a deployment, verify that the project builds successfully in your local workspace:

```bash
npm run build
```

This ensures TypeScript validation passes, ESLint syntax checks succeed, and pages are correctly optimized.

## Vercel Deployment Guide

1. Log in to the Vercel Dashboard.
2. Select **New Project** and import your repository: `Thirumal143200/FIFA-World-Cup-2026-Smart-Stadium-GenAI`.
3. Configure the environment variables in the project settings panel.
4. Trigger the build. Vercel will automatically provision the Next.js App Router and Edge API routes.

## Required Environment Variables

Set these keys in Vercel to activate all services:

| Key | Description |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Client API Key |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `GEMINI_API_KEY` | Google Gemini AI key |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JS SDK Key |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis connection URL (Rate limiter) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |
