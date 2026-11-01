import { NextResponse } from 'next/server';
import { getLiveBuses } from '@/lib/trackingStore';

export async function GET() {
  const buses = getLiveBuses();
  return NextResponse.json({
    success: true,
    count: buses.length,
    timestamp: new Date().toISOString(),
    buses,
  });
}
