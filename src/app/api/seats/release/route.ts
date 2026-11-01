import { NextResponse } from 'next/server';
import { releaseHeldSeats } from '@/lib/seatStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { busId, seatNumbers, sessionId } = body;

    if (!busId || !Array.isArray(seatNumbers) || !sessionId) {
      return NextResponse.json(
        { error: 'অসম্পূর্ণ তথ্য (Missing fields)' },
        { status: 400 }
      );
    }

    const released = releaseHeldSeats(busId, seatNumbers, sessionId);

    return NextResponse.json({
      success: released,
      message: 'আসন হোল্ড অবমুক্ত করা হয়েছে (Seats released)',
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'সার্ভার ত্রুটি';
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
