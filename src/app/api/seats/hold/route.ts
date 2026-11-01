import { NextResponse } from 'next/server';
import { holdSeats } from '@/lib/seatStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { busId, seatNumbers, sessionId } = body;

    if (!busId || !Array.isArray(seatNumbers) || seatNumbers.length === 0 || !sessionId) {
      return NextResponse.json(
        { error: 'অসম্পূর্ণ আসন তথ্য (Missing busId, seatNumbers, or sessionId)' },
        { status: 400 }
      );
    }

    if (seatNumbers.length > 5) {
      return NextResponse.json(
        { error: 'একবারে সর্বোচ্চ ৫টি আসন নির্বাচন করা সম্ভব (Max 5 seats per reservation)' },
        { status: 400 }
      );
    }

    const result = holdSeats(busId, seatNumbers, sessionId, 5);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      message: 'আসনসমূহ ৫ মিনিটের জন্য সফলভাবে সংরক্ষিত (Seats held for 5 minutes)',
      heldSeats: result.heldSeats,
      expiresAt: result.expiresAt,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'সার্ভার ত্রুটি';
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
