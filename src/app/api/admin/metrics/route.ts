import { NextResponse } from 'next/server';
import { getLiveBuses } from '@/lib/trackingStore';
import { getBookings } from '@/lib/payments';
import { INITIAL_BOOTHS, INITIAL_STOPS } from '@/data/mockData';

export async function GET() {
  const buses = getLiveBuses();
  const bookings = getBookings();

  const onDutyCount = buses.filter((b) => b.status === 'on_duty').length;
  const activeGpsCount = buses.filter((b) => b.freshness === 'active').length;
  const totalRevenueBDT = bookings
    .filter((b) => b.paymentStatus === 'paid' || b.paymentStatus === 'sandbox_paid')
    .reduce((sum, b) => sum + b.totalFareBDT, 0);

  return NextResponse.json({
    success: true,
    metrics: {
      totalFleetCount: buses.length,
      onDutyCount,
      activeGpsCount,
      totalBoothsCount: INITIAL_BOOTHS.length,
      totalStopsCount: INITIAL_STOPS.length,
      totalBookingsCount: bookings.length,
      confirmedBookingsCount: bookings.filter((b) => b.status === 'confirmed').length,
      totalRevenueBDT,
      systemStatus: 'healthy',
      lastTelemetrySync: new Date().toISOString(),
    },
  });
}
