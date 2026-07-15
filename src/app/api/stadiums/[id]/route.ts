// src/app/api/stadiums/[id]/route.ts
// Stadium Detail API — fetches single venue configuration

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
    return NextResponse.json(stadium);
  } catch (error) {
    console.error('[API] /stadiums/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
