import { NextResponse } from 'next/server';
import { createBookingOrder } from '@/lib/payments';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = createBookingOrder(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      booking: result.booking,
      redirectUrl: result.redirectUrl,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'বুকিং অর্ডার প্রক্রিয়াকরণ ব্যর্থ';
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
