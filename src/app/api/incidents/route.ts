import { NextResponse } from 'next/server';
import { INITIAL_INCIDENTS } from '@/data/mockData';
import { IncidentReport } from '@/types';

let incidentsStore: IncidentReport[] = [...INITIAL_INCIDENTS];

export async function GET() {
  return NextResponse.json({
    success: true,
    count: incidentsStore.length,
    incidents: incidentsStore,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, title, description, busNumber, stopName, contactPhone } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'শিরোনাম ও বিবরণ আবশ্যক (Title and description required)' }, { status: 400 });
    }

    const newIncident: IncidentReport = {
      id: `inc-${Date.now()}`,
      category: category || 'other',
      title,
      description,
      busNumber,
      stopName,
      contactPhone,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    incidentsStore.unshift(newIncident);

    return NextResponse.json({
      success: true,
      message: 'অভিযোগ বা অনুসন্ধান রিপোর্ট সফলভাবে দাখিল করা হয়েছে (Incident reported successfully)',
      incident: newIncident,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'রিপোর্ট প্রক্রিয়াকরণে ত্রুটি';
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
