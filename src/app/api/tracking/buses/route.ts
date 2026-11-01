import { NextResponse } from 'next/server';
import { getLiveBuses } from '@/lib/trackingStore';

export async function GET() {
  const allBuses = getLiveBuses();

  // Do not expose placeholder coordinates as passenger-facing last-known
  // positions. Only return a bus after a real ping has been ingested.
  const buses = allBuses.filter(
    (bus) => bus.freshness === 'active' || bus.freshness === 'stale'
  );

  return NextResponse.json({
    success: true,
    count: buses.length,
    timestamp: new Date().toISOString(),
    buses,
  });
}
