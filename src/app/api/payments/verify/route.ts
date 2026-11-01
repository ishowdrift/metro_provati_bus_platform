import { NextResponse } from 'next/server';
import { verifySandboxPayment } from '@/lib/payments';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, trxId } = body;

    if (!bookingId) {
      return NextResponse.json({ error: 'বুকিং আইডি অনুপস্থিত (Missing bookingId)' }, { status: 400 });
    }

    const result = verifySandboxPayment(bookingId, trxId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'পেমেন্ট সফলভাবে যাচাই ও টিকিট নিশ্চিত হয়েছে (Payment verified & ticket issued)',
      booking: result.booking,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'পেমেন্ট যাচাই ব্যর্থ';
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
