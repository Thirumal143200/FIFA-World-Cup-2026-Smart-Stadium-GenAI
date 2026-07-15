// __tests__/integration/api.test.ts
// Integration tests for Next.js Route Handlers

import { GET as getStadiums } from '@/app/api/stadiums/route';
import { POST as createIncident } from '@/app/api/incidents/route';
import { NextRequest } from 'next/server';

// Mock NextRequest and Firebase config dependencies
jest.mock('@/lib/firebase/config', () => ({
  getFirestoreDb: jest.fn(() => null),
  isFirebaseConfigured: jest.fn(() => false),
}));

describe('API Route Handlers Integration', () => {
  describe('GET /api/stadiums', () => {
    it('returns all 16 stadiums with status 200', async () => {
      const response = await getStadiums();
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(16);
      expect(data[0]).toHaveProperty('name');
    });
  });

  describe('POST /api/incidents', () => {
    it('returns 400 bad request if category or severity is invalid', async () => {
      const request = new NextRequest('http://localhost/api/incidents', {
        method: 'POST',
        body: JSON.stringify({
          stadiumId: 'metlife',
          category: 'invalid-category', // triggers Zod validation failure
          title: 'A spill',
        }),
      });

      const response = await createIncident(request);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data).toHaveProperty('error');
    });

    it('creates a new incident successfully when body schema matches', async () => {
      const payload = {
        stadiumId: 'metlife',
        category: 'medical',
        severity: 'medium',
        title: 'Sprained Ankle',
        description: 'A fan sprained their ankle walking down the steps at Section 100.',
        location: {
          zoneId: 'metlife-lower-100',
          zoneName: 'Lower Bowl Section 100',
        },
        reportedBy: {
          name: 'Supervisor Sarah',
          role: 'staff',
        },
      };

      const request = new NextRequest('http://localhost/api/incidents', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const response = await createIncident(request);
      expect(response.status).toBe(201 || 200);

      const data = await response.json();
      expect(data).toHaveProperty('id');
      expect(data.title).toBe('Sprained Ankle');
      expect(data.status).toBe('reported');
    });
  });
});
