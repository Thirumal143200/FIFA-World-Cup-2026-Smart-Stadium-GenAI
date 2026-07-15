// __tests__/integration/stadium-details-api.test.ts
// Integration tests for Stadium Detail Route Handler and AI Chat Endpoint

import { GET as getStadiumDetail } from '@/app/api/stadiums/[id]/route';
import { POST as runAIChat } from '@/app/api/ai/chat/route';
import { NextRequest } from 'next/server';

// Mock NextRequest and Firebase config dependencies
jest.mock('@/lib/firebase/config', () => ({
  getFirestoreDb: jest.fn(() => null),
  isFirebaseConfigured: jest.fn(() => false),
}));

// Mock Upstash rate limiter to allow all requests during testing
jest.mock('@/lib/security/rate-limit', () => ({
  checkRateLimit: jest.fn(() => Promise.resolve({ allowed: true, remaining: 100, reset: Date.now() })),
}));

// Mock sanitization to prevent isomorphic-dompurify issues in test env
jest.mock('@/lib/security/sanitize', () => ({
  sanitizeInput: jest.fn((str) => str),
  sanitizeHtml: jest.fn((str) => str),
  sanitizeQuery: jest.fn((str) => str),
}));

describe('Stadium Detail & AI Chat API Integration', () => {
  describe('GET /api/stadiums/[id]', () => {
    it('returns stadium detail with status 200 for a valid ID', async () => {
      const request = new NextRequest('http://localhost/api/stadiums/metlife');
      const response = await getStadiumDetail(request, { params: Promise.resolve({ id: 'metlife' }) });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.id).toBe('metlife');
      expect(data.name).toBe('MetLife Stadium');
    });

    it('returns 404 for an invalid stadium ID', async () => {
      const request = new NextRequest('http://localhost/api/stadiums/invalid-id');
      const response = await getStadiumDetail(request, { params: Promise.resolve({ id: 'invalid-id' }) });
      
      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toHaveProperty('error');
    });
  });

  describe('POST /api/ai/chat', () => {
    it('returns AI response with fallback content for chat query', async () => {
      const payload = {
        message: 'Where is the nearest restroom?',
        language: 'en',
        stadiumId: 'metlife',
        module: 'chat',
      };

      const request = new NextRequest('http://localhost/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const response = await runAIChat(request);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty('message');
      expect(data.metadata.isMock).toBe(true);
    });

    it('returns 400 bad request for empty message validation failure', async () => {
      const request = new NextRequest('http://localhost/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: '', // invalid
          stadiumId: 'metlife',
        }),
      });

      const response = await runAIChat(request);
      expect(response.status).toBe(400);
    });
  });
});
