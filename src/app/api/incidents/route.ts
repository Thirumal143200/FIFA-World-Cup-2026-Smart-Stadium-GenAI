// src/app/api/incidents/route.ts
// Incidents API — allows reporting and listing active incidents in stadiums

import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreDb, isFirebaseConfigured } from '@/lib/firebase/config';
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { IncidentCreateSchema } from '@/lib/validators/schemas';
import type { Incident } from '@/types';
import { sanitizeInput } from '@/lib/security/sanitize';

// Global memory fallback for local demo when Firebase is unconfigured
const mockIncidents: Incident[] = [
  {
    id: 'inc-1',
    stadiumId: 'metlife',
    category: 'medical',
    severity: 'high',
    status: 'reported',
    title: 'Heatstroke near Section 112',
    description: 'A fan is experiencing dizziness and heavy sweating due to high heat. Requires a medical team with water and ice.',
    location: {
      zoneId: 'metlife-lower-100',
      zoneName: 'Lower Level Section 112',
      landmark: 'Next to Gate B Concourse entrance',
    },
    reportedBy: {
      name: 'John Doe',
      role: 'volunteer',
    },
    responses: [],
    evacuationRequired: false,
    affectedZones: ['metlife-lower-100'],
    createdAt: new Date(Date.now() - 300000).toISOString(),
    updatedAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: 'inc-2',
    stadiumId: 'metlife',
    category: 'security',
    severity: 'medium',
    status: 'in-progress',
    title: 'Minor argument at Gate A',
    description: 'Minor dispute between two fans regarding seating line order. Security staff dispatched.',
    location: {
      zoneId: 'metlife-gate-a',
      zoneName: 'Gate A Entrance',
    },
    reportedBy: {
      name: 'Sarah Smith',
      role: 'staff',
    },
    responses: [
      {
        id: 'resp-1',
        incidentId: 'inc-2',
        action: 'Dispatched nearby officer',
        performedBy: 'Supervisor Mike',
        timestamp: new Date(Date.now() - 120000).toISOString(),
      },
    ],
    evacuationRequired: false,
    affectedZones: [],
    createdAt: new Date(Date.now() - 600000).toISOString(),
    updatedAt: new Date(Date.now() - 120000).toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const stadiumId = url.searchParams.get('stadiumId');

    if (isFirebaseConfigured()) {
      const db = getFirestoreDb();
      if (db) {
        const ref = collection(db, 'incidents');
        const q = query(ref, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const firebaseIncidents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Incident);
        const filtered = stadiumId
          ? firebaseIncidents.filter((inc) => inc.stadiumId === stadiumId)
          : firebaseIncidents;
        return NextResponse.json(filtered);
      }
    }

    // Fallback to local mock data
    const filtered = stadiumId
      ? mockIncidents.filter((inc) => inc.stadiumId === stadiumId)
      : mockIncidents;
    return NextResponse.json(filtered);
  } catch (error) {
    console.error('[API] GET /incidents error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = IncidentCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const input = parsed.data;

    const newIncident: Omit<Incident, 'id'> = {
      stadiumId: input.stadiumId,
      category: input.category,
      severity: input.severity,
      status: 'reported',
      title: sanitizeInput(input.title),
      description: sanitizeInput(input.description),
      location: {
        zoneId: input.location.zoneId,
        zoneName: input.location.zoneName,
        landmark: input.location.landmark ? sanitizeInput(input.location.landmark) : undefined,
        coordinates: input.location.coordinates,
      },
      reportedBy: {
        name: sanitizeInput(input.reportedBy.name),
        role: input.reportedBy.role,
        contact: input.reportedBy.contact ? sanitizeInput(input.reportedBy.contact) : undefined,
      },
      responses: [],
      evacuationRequired: false,
      affectedZones: [input.location.zoneId],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured()) {
      const db = getFirestoreDb();
      if (db) {
        const ref = collection(db, 'incidents');
        const docRef = await addDoc(ref, {
          ...newIncident,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return NextResponse.json({ id: docRef.id, ...newIncident }, { status: 201 });
      }
    }

    // Memory fallback
    const mockId = `inc-${Date.now()}`;
    const created = { id: mockId, ...newIncident } as Incident;
    mockIncidents.unshift(created);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('[API] POST /incidents error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Export memory database helper for patch operations
export { mockIncidents };
