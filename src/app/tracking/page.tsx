'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LiveTrackingMap } from '@/components/LiveTrackingMap';
import { useLanguage } from '@/context/LanguageContext';
import { Bus } from '@/types';
import { toBengaliDigits } from '@/lib/fareCalculator';
import { AlertCircle, Clock3, Navigation, RefreshCw, ShieldCheck } from 'lucide-react';

export default function TrackingPage() {
  const { language, t } = useLanguage();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState('');

  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/tracking/buses', { cache: 'no-store' });
      if (!response.ok) throw new Error('Tracking request failed');
      const data = await response.json();
      if (data.success && Array.isArray(data.buses)) {
        setBuses(data.buses);
        setLastChecked(new Date().toLocaleTimeString());
      }
    } catch {
      // Keep the last successfully received result visible.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const activeCount = buses.filter((bus) => bus.freshness === 'active' && bus.status === 'on_duty' && bus.isLiveSharing !== false).length;
  const staleCount = buses.filter((bus) => bus.freshness === 'stale').length;

  return (
    <main className="bg-[#FAF9F7] pb-20">
      <div className="mx-auto max-w-[1240px] space-y-10 px-4 py-12 sm:space-y-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Header with Operations Sync Status */}
        <header className="flex flex-col justify-between gap-6 border-b border-stone-300 pb-8 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#C92232]">
              <span className="h-px w-8 bg-[#C92232]" />
              <span>RADAR · LIVE FLEET TELEMETRY</span>
            </div>
            <h1 className="text-3xl font-black leading-[1.06] tracking-[-0.045em] text-stone-950 sm:text-5xl">
              {t('tracking.title')}
            </h1>
            <p className="mt-4 text-sm leading-7 text-stone-600 sm:text-base">
              {language === 'bn'
                ? 'কাপ্তai রাস্তার মাথা থেকে কাঠগড় করিডোরে চলাচলকারী বাসের সক্রিয় অবস্থান। কেবল চালক বা সুপারভাইজারের ডিভাইস থেকে প্রাপ্ত প্রকৃত জিপিএস স্থানাঙ্ক এখানে প্রদর্শিত হয়।'
                : 'Real-time vehicle telemetry along the Kaptai to Katgor corridor. Coordinates appear strictly when sent by active driver or supervisor devices.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono">
            <div className="text-[11px] font-semibold text-stone-500">
              {lastChecked
                ? (language === 'bn' ? 'যাচাইকৃত: ' : 'SYNCED: ') + lastChecked
                : loading
                ? (language === 'bn' ? 'তথ্য লোড হচ্ছে...' : 'RECEIVING PINGS...')
                : (language === 'bn' ? 'এখনো কোনো আপডেট নেই' : 'WAITING FOR PACKETS')}
            </div>
            <button
              type="button"
              onClick={fetchStatus}
              disabled={loading}
              className="inline-flex h-11 items-center gap-2 border border-stone-300 bg-white px-4 text-xs font-extrabold text-stone-800 transition hover:border-[#C92232] hover:text-[#C92232] active:scale-[0.99] disabled:opacity-50"
            >
              <RefreshCw className={'h-4 w-4 ' + (loading ? 'animate-spin' : '')} />
              <span>{language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}</span>
            </button>
          </div>
        </header>

        {/* Telemetry Status Ledger */}
        <section className="grid grid-cols-1 border-y border-stone-300 divide-y divide-stone-200 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
          <div className="py-5 pr-6 sm:py-6">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
              {language === 'bn' ? 'এখন সক্রিয় ও লাইভ' : 'LIVE VEHICLES'}
            </div>
            <div className="mt-2 flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#24775F] animate-radar-ping" />
              <span className="font-mono text-4xl font-black tracking-tight text-stone-950">{toBengaliDigits(activeCount)}</span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-stone-500">{language === 'bn' ? '৩ মিনিটের মধ্যে সর্বশেষ আপডেট' : 'Verified ping &lt; 3 minutes'}</p>
          </div>

          <div className="py-5 sm:py-6 sm:px-6">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
              {language === 'bn' ? 'বিলম্বিত অবস্থান' : 'DELAYED / STALE PINGS'}
            </div>
            <div className="mt-2 flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#B7791F]" />
              <span className="font-mono text-4xl font-black tracking-tight text-stone-950">{toBengaliDigits(staleCount)}</span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-stone-500">{language === 'bn' ? '৩–১০ মিনিট আগের জিপিএস' : 'Last ping 3–10 minutes ago'}</p>
          </div>

          <div className="py-5 sm:py-6 sm:pl-6">
            <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
              {language === 'bn' ? 'মোট প্রাপ্ত স্থানাঙ্ক' : 'TOTAL TRACKED UNITS'}
            </div>
            <div className="mt-2 flex items-center gap-2.5">
              <span className="font-mono text-4xl font-black tracking-tight text-stone-950">{toBengaliDigits(buses.length)}</span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-stone-500">{language === 'bn' ? 'করিডোরে নিবন্ধিত ডিভাইস' : 'Registered corridor units'}</p>
          </div>
        </section>

        {buses.length === 0 && !loading && (
          <div className="flex items-start gap-3 border-l-2 border-[#B7791F] bg-[#FEF7EC] px-5 py-4 text-sm leading-7 text-[#523307]">
            <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-[#B7791F]" />
            <div>
              <div className="font-extrabold">
                {language === 'bn' ? 'এই মুহূর্তে কোনো সক্রিয় জিপিএস স্থানাঙ্ক পাওয়া যায়নি।' : 'No active GPS telemetry packets received at this moment.'}
              </div>
              <p className="mt-1 text-xs text-[#7C5010]">
                {language === 'bn'
                  ? 'কোনো বাসকে কৃত্রিমভাবে লাইভ দেখানো হয় না। চালক বা সুপারভাইজারের ডিভাইস থেকে সংযোগ স্থাপন হলেই অবস্থান দেখা যাবে।'
                  : 'We strictly refuse to fake bus positions. The radar updates automatically once a registered crew device transmits coordinates.'}
              </p>
            </div>
          </div>
        )}

        {/* Map Container */}
        <section className="overflow-hidden border border-stone-300 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 px-5 py-3.5 sm:px-6">
            <div>
              <h2 className="text-sm font-extrabold text-stone-900">
                {language === 'bn' ? 'করিডোর রাডার ও স্যাটেলাইট ম্যাপ' : 'Arterial Radar & Live Telemetry Map'}
              </h2>
              <p className="mt-0.5 font-mono text-[11px] text-stone-500">
                {language === 'bn' ? 'সবুজ পিন: লাইভ আপডেট (&lt;৩ মিনিট) · অ্যাম্বার: বিলম্বিত' : 'GREEN: LIVE (&lt;3 MINS) · AMBER: DELAYED'}
              </p>
            </div>
            <div className="flex items-center gap-4 font-mono text-[10px] font-bold text-stone-600">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#24775F]" />{language === 'bn' ? 'লাইভ' : 'LIVE'}</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#B7791F]" />{language === 'bn' ? 'বিলম্বিত' : 'STALE'}</span>
            </div>
          </div>
          <LiveTrackingMap />
        </section>

        {/* Telemetry Architecture Manifesto (Anti-Template: Structured Ledger instead of 3 identical boxes!) */}
        <section className="border-t border-stone-300 pt-8">
          <div className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#C92232]">
            TELEMETRY INTEGRITY PROTOCOL
          </div>
          <div className="divide-y divide-stone-200 border-y border-stone-300">
            <div className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-[160px_1fr] sm:gap-6">
              <span className="font-mono text-xs font-bold text-stone-900">
                01 / DEVICE TRUTHFULNESS
              </span>
              <p className="text-xs leading-6 text-stone-600 sm:text-sm">
                {language === 'bn'
                  ? 'আমরা কৃত্রিম পথরেখা বা অনুমাননির্ভর কাল্পনিক গতির হিসাব দেখাই না। শুধুমাত্র প্রকৃত ডিভাইস সিগন্যাল প্রক্রিয়াজাত করা হয়।'
                  : 'We strictly reject simulated path movements. Only authentic authenticated device pings are rendered on the commuter radar.'}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-[160px_1fr] sm:gap-6">
              <span className="font-mono text-xs font-bold text-stone-900">
                02 / FRESHNESS BOUNDARY
              </span>
              <p className="text-xs leading-6 text-stone-600 sm:text-sm">
                {language === 'bn'
                  ? '৩ মিনিটের কম সময়ের স্থানাঙ্ককে "সক্রিয় লাইভ" এবং ৩ থেকে ১০ মিনিটের স্থানাঙ্ককে স্পষ্ট সতর্কবার্তাসহ "বিলম্বিত" চিহ্নিত করা হয়।'
                  : 'Pings under 3 minutes are designated as verified active; updates between 3 and 10 minutes are clearly labelled as delayed.'}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-[160px_1fr] sm:gap-6">
              <span className="font-mono text-xs font-bold text-stone-900">
                03 / GEOFENCE COMPLIANCE
              </span>
              <p className="text-xs leading-6 text-stone-600 sm:text-sm">
                {language === 'bn'
                  ? 'চট্টগ্রাম নগরীর নির্ধারিত ভৌগোলিক সীমার (২২.১৫°–২২.৪৫° উত্তর, ৯১.৭০°–৯১.৯৫° পূর্ব) বাইরের কোনো অকার্যকর স্থানাঙ্ক গ্রহণ করা হয় না।'
                  : 'Only telemetry points conforming to the Chattogram Metropolitan Corridor geofence are ingested into the platform system.'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
