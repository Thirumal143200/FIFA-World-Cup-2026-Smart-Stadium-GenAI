// src/app/api/transport/[stadiumId]/route.ts
// Transit Options API — retrieves multi-modal transit information for a stadium

import { NextRequest, NextResponse } from 'next/server';
import { getStadiumById } from '@/data/stadiums';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ stadiumId: string }> }
) {
  try {
    const { stadiumId } = await params;
    const stadium = getStadiumById(stadiumId);

    if (!stadium) {
      return NextResponse.json({ error: 'Stadium not found' }, { status: 404 });
    }

    return NextResponse.json({
      stadiumId,
      transportOptions: stadium.transportOptions,
      // Simulate real-time transit status
      status: [
        { mode: 'train', status: 'on-time', message: 'Meadowlands Rail Line running normal service.' },
        { mode: 'bus', status: 'delayed', message: 'Route 160 experiencing minor 10min delay due to local traffic.' },
        { mode: 'shuttle', status: 'on-time', message: 'FIFA Fan Shuttles departing every 5 minutes from Lot J.' },
      ],
    });
  } catch (error) {
    console.error('[API] GET /transport/[stadiumId] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
