import { NextResponse } from 'next/server';
import { recordDriverPing, setBusDutyStatus } from '@/lib/trackingStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      busId,
      lat,
      lng,
      speedKmh,
      heading,
      batteryLevel,
      networkStatus,
      dutyStatus,
      isLiveSharing,
    } = body;

    if (!busId) {
      return NextResponse.json({ error: 'বাসের আইডি প্রদান করুন (Bus ID required)' }, { status: 400 });
    }

    // If driver is turning off live location or going off-duty
    if (isLiveSharing === false || (dutyStatus && dutyStatus !== 'on_duty')) {
      if (typeof lat === 'number' && typeof lng === 'number') {
        const result = recordDriverPing({
          busId,
          lat,
          lng,
          speedKmh: 0,
          heading,
          batteryLevel,
          networkStatus,
          isLiveSharing: false,
        });
        return NextResponse.json({
          success: true,
          message: 'লাইভ জিপিএস বন্ধ করা হয়েছে, সর্বশেষ অবস্থান সংরক্ষিত রাখা হয়েছে (Live sharing paused, last known location saved)',
          bus: result.bus,
        });
      }

      const updatedBus = setBusDutyStatus(busId, (dutyStatus as any) || 'idle');
      return NextResponse.json({
        success: true,
        message: 'বাসের ডিউটি স্ট্যাটাস সফলভাবে পরিবর্তিত হয়েছে',
        bus: updatedBus,
      });
    }

    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json({ error: 'বৈধ জিপিএস স্থানাঙ্ক প্রয়োজন (Valid lat/lng required)' }, { status: 400 });
    }

    const result = recordDriverPing({
      busId,
      lat,
      lng,
      speedKmh,
      heading,
      batteryLevel,
      networkStatus,
      isLiveSharing: isLiveSharing !== false,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      message: 'জিপিএস অবস্থান সফলভাবে হালনাগাদ হয়েছে (Location telemetry updated)',
      bus: result.bus,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'সার্ভার প্রক্রিয়াকরণ ত্রুটি';
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
