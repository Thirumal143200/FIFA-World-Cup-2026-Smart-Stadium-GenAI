// src/lib/constants.ts
// Application-wide constants

export const APP_NAME = 'FIFA StadiumOS';
export const APP_DESCRIPTION = 'AI-Powered Smart Stadium Assistant for FIFA World Cup 2026™';
export const APP_VERSION = '1.0.0';

export const FIFA_WORLD_CUP = {
  name: 'FIFA World Cup 2026™',
  year: 2026,
  startDate: '2026-06-11',
  endDate: '2026-07-19',
  hostCountries: ['USA', 'Mexico', 'Canada'] as const,
  totalStadiums: 16,
  totalMatches: 104,
  totalTeams: 48,
};

export const ROUTES = {
  home: '/',
  fan: {
    hub: '/fan',
    navigate: '/fan/navigate',
    chat: '/fan/chat',
    transport: '/fan/transport',
    accessibility: '/fan/accessibility',
    sustainability: '/fan/sustainability',
  },
  volunteer: {
    hub: '/volunteer',
    incidents: '/volunteer/incidents',
    crowd: '/volunteer/crowd',
  },
  organizer: {
    hub: '/organizer',
    analytics: '/organizer/analytics',
    crowd: '/organizer/crowd',
    sustainability: '/organizer/sustainability',
    decisions: '/organizer/decisions',
  },
  security: {
    hub: '/security',
    incidents: '/security/incidents',
    crowd: '/security/crowd',
  },
  admin: {
    hub: '/admin',
  },
  emergency: '/emergency',
} as const;

export const API_ROUTES = {
  ai: {
    chat: '/api/ai/chat',
    navigate: '/api/ai/navigate',
    translate: '/api/ai/translate',
    crowdPredict: '/api/ai/crowd-predict',
    emergency: '/api/ai/emergency',
    accessibility: '/api/ai/accessibility',
    operational: '/api/ai/operational',
    sustainability: '/api/ai/sustainability',
  },
  stadiums: '/api/stadiums',
  incidents: '/api/incidents',
  transport: '/api/transport',
  sustainability: '/api/sustainability',
} as const;

export const CROWD_THRESHOLDS = {
  low: 0.3,
  moderate: 0.5,
  high: 0.7,
  veryHigh: 0.9,
  critical: 0.95,
} as const;

export const INCIDENT_SEVERITY_COLORS = {
  low: '#22c55e',
  medium: '#eab308',
  high: '#f97316',
  critical: '#ef4444',
} as const;

export const RATE_LIMITS = {
  ai: { requests: 20, window: '1m' },
  api: { requests: 100, window: '1m' },
  auth: { requests: 10, window: '1m' },
} as const;

export const AI_CONFIG = {
  model: 'gemini-2.0-flash',
  maxOutputTokens: 2048,
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
} as const;

export const THEME_COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  fifa: {
    purple: '#56004F',
    red: '#E4002B',
    gold: '#C8A951',
    navy: '#002855',
    teal: '#009B8D',
    sky: '#00A5E0',
  },
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;
