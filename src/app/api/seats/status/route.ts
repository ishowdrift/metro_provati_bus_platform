import { NextResponse } from 'next/server';
import { getBusSeatMap, getBusStandingCapacity } from '@/lib/seatStore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const busId = searchParams.get('busId') || 'bus-mp-101';

  const seats = getBusSeatMap(busId);
  const standing = getBusStandingCapacity(busId);

  const availableSeatsCount = seats.filter((s) => s.status === 'available').length;
  const bookedSeatsCount = seats.filter((s) => s.status === 'booked').length;
  const heldSeatsCount = seats.filter((s) => s.status === 'held').length;

  return NextResponse.json({
    success: true,
    busId,
    totalSeats: seats.length,
    availableSeatsCount,
    bookedSeatsCount,
    heldSeatsCount,
    standingCapacity: standing,
    availableStandingCount: standing.isEnabled
      ? Math.max(0, standing.approvedCapacity - standing.reservedCount)
      : 0,
    seats,
  });
}
