import { NextResponse } from 'next/server';
import { getBookings, getBookingByReference } from '@/lib/payments';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get('ref');

  if (ref) {
    const booking = getBookingByReference(ref);
    if (!booking) {
      return NextResponse.json({ error: 'টিকেট পাওয়া যায়নি (Ticket not found)' }, { status: 404 });
    }
    return NextResponse.json({ success: true, booking });
  }

  const allBookings = getBookings();
  return NextResponse.json({
    success: true,
    count: allBookings.length,
    bookings: allBookings,
  });
}
