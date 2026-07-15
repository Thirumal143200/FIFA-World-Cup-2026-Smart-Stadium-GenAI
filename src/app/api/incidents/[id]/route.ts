// src/app/api/incidents/[id]/route.ts
// Incident Detail API — handles fetching, updating status, and adding responder notes

import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreDb, isFirebaseConfigured } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { IncidentUpdateSchema } from '@/lib/validators/schemas';
import { mockIncidents } from '../route';
import { sanitizeInput } from '@/lib/security/sanitize';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (isFirebaseConfigured()) {
      const db = getFirestoreDb();
      if (db) {
        const ref = doc(db, 'incidents', id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          return NextResponse.json({ id: snap.id, ...snap.data() });
        }
      }
    }

    const localInc = mockIncidents.find((i) => i.id === id);
    if (!localInc) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }
    return NextResponse.json(localInc);
  } catch (error) {
    console.error('[API] GET /incidents/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = IncidentUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid update payload', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const updates = parsed.data;
    const updateTime = new Date().toISOString();

    // Prepare update data
    const updatePayload: Record<string, unknown> = {
      updatedAt: updateTime,
    };

    if (updates.status) updatePayload.status = updates.status;
    if (updates.severity) updatePayload.severity = updates.severity;
    if (updates.assignedTo) updatePayload.assignedTo = updates.assignedTo;

    // Handle responses addition if notes are present
    let newResponse = null;
    if (updates.notes) {
      newResponse = {
        id: `resp-${Date.now()}`,
        incidentId: id,
        action: sanitizeInput(updates.notes),
        performedBy: updates.assignedTo?.name || 'Staff Responder',
        timestamp: updateTime,
      };
    }

    if (isFirebaseConfigured()) {
      const db = getFirestoreDb();
      if (db) {
        const ref = doc(db, 'incidents', id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
        }

        const currentData = snap.data();
        const currentResponses = currentData.responses || [];
        if (newResponse) {
          updatePayload.responses = [...currentResponses, newResponse];
        }

        await updateDoc(ref, {
          ...updatePayload,
          updatedAt: serverTimestamp(),
        });

        const updatedSnap = await getDoc(ref);
        return NextResponse.json({ id: updatedSnap.id, ...updatedSnap.data() });
      }
    }

    // Local memory fallback
    const index = mockIncidents.findIndex((i) => i.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    const currentLocal = mockIncidents[index];
    const nextLocal = {
      ...currentLocal,
      ...updatePayload,
      responses: newResponse ? [...currentLocal.responses, newResponse] : currentLocal.responses,
      updatedAt: updateTime,
    };

    mockIncidents[index] = nextLocal;
    return NextResponse.json(nextLocal);
  } catch (error) {
    console.error('[API] PATCH /incidents/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
