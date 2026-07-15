// src/app/api/sustainability/[id]/route.ts
// Stadium Sustainability Metrics API — returns real-time eco logs

import { NextRequest, NextResponse } from 'next/server';
import { getStadiumById } from '@/data/stadiums';
import type { SustainabilityMetrics } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stadium = getStadiumById(id);

    if (!stadium) {
      return NextResponse.json({ error: 'Stadium not found' }, { status: 404 });
    }

    // Generate simulated metrics for match day
    const metrics: SustainabilityMetrics = {
      stadiumId: id,
      date: new Date().toISOString().split('T')[0],
      energy: {
        consumed: 4200,
        renewable: 3100, // ~73% renewable
        unit: 'kWh',
      },
      water: {
        consumed: 45000,
        recycled: 18000, // 40% recycled
        unit: 'L',
      },
      waste: {
        generated: 14.2,
        diverted: 11.5, // ~80% diverted
        recycled: 8.2,
        unit: 'tons',
      },
      carbon: {
        emissions: 8.5,
        offset: 6.2,
        unit: 'metric tons CO2e',
      },
      score: 87, // out of 100 on the FIFA Green Stadium index
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('[API] GET /sustainability/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
