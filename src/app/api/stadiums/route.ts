// src/app/api/stadiums/route.ts
// Stadiums API — lists all 16 venues

import { NextResponse } from 'next/server';
import { stadiums } from '@/data/stadiums';

export async function GET() {
  try {
    return NextResponse.json(stadiums);
  } catch (error) {
    console.error('[API] /stadiums error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
