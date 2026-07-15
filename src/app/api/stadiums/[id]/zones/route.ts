// src/app/api/stadiums/[id]/zones/route.ts
// Stadium Zones API — returns list of zones and current crowd density status

import { NextRequest, NextResponse } from 'next/server';
import { getStadiumById } from '@/data/stadiums';

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

    // Generate real-time simulated density data for each zone in the stadium
    const zonesWithDensity = stadium.zones.map((zone) => {
      // Simulate live density occupancy between 10% and 95%
      const density = Math.random() * 0.85 + 0.1;
      const currentOccupancy = Math.round(zone.capacity * density);
      let status: 'open' | 'crowded' | 'at-capacity' = 'open';

      if (density > 0.9) {
        status = 'at-capacity';
      } else if (density > 0.7) {
        status = 'crowded';
      }

      return {
        ...zone,
        currentOccupancy,
        density,
        status,
      };
    });

    return NextResponse.json(zonesWithDensity);
  } catch (error) {
    console.error('[API] /stadiums/[id]/zones error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
