'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LiveTrackingMap } from '@/components/LiveTrackingMap';
import { useLanguage } from '@/context/LanguageContext';
import { Bus } from '@/types';
import { toBengaliDigits } from '@/lib/fareCalculator';
import { AlertCircle, Clock3, Navigation, RefreshCw, ShieldCheck, Compass } from 'lucide-react';

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
    <main className="bg-[#F1EEE8] pb-20">
      {/* Transit Header */}
      <section className="relative isolate overflow-hidden bg-[#C92232] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-36 -top-36 h-[440px] w-[440px] rounded-full bg-white/10 blur-[100px] animate-ambient-drift"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 right-1/4 h-[380px] w-[380px] rounded-full bg-black/25 blur-[90px] animate-ambient-drift"
          style={{ animationDelay: '-12s' }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white/80">
                <span className="h-px w-8 bg-white/75" />
                <span>RADAR · LIVE FLEET TELEMETRY</span>
              </div>
              <h1 className="text-3xl font-black leading-[1.06] tracking-tight sm:text-5xl font-display">
                {t('tracking.title')}
              </h1>
              <p className="mt-4 text-sm leading-7 text-white/90 sm:text-base font-medium">
                {language === 'bn'
                  ? 'কাপ্তাই রাস্তার মাথা থেকে কাঠগড় করিডোরে চলাচলকারী বাসের সক্রিয় অবস্থান। কেবল চালক বা সুপারভাইজারের ডিভাইস থেকে প্রাপ্ত প্রকৃত জিপিএস স্থানাঙ্ক এখানে প্রদর্শিত হয়।'
                  : 'Real-time vehicle telemetry along the Kaptai to Katgor corridor. Coordinates appear strictly when sent by active driver or supervisor devices.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="text-xs font-semibold text-white/80 font-mono">
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
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-extrabold text-[#C92232] shadow-sm transition hover:bg-[#F2E4E2] active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={'h-3.5 w-3.5 ' + (loading ? 'animate-spin' : '')} />
                <span>{language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Telemetry Status Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-white rounded-3xl p-6 border border-[#E5E0D8] shadow-sm">
            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {language === 'bn' ? 'এখন সক্রিয় ও লাইভ' : 'LIVE VEHICLES'}
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-[#49665A] animate-radar-ping" />
              <span className="font-mono text-4xl font-black tracking-tight text-[#272524]">{toBengaliDigits(activeCount)}</span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-slate-500">{language === 'bn' ? '৩ মিনিটের মধ্যে সর্বশেষ আপডেট' : 'Verified ping < 3 minutes'}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E5E0D8] shadow-sm">
            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {language === 'bn' ? 'বিলম্বিত অবস্থান' : 'DELAYED / STALE PINGS'}
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-[#A87936]" />
              <span className="font-mono text-4xl font-black tracking-tight text-[#272524]">{toBengaliDigits(staleCount)}</span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-slate-500">{language === 'bn' ? '৩–১০ মিনিট আগের জিপিএস' : 'Last ping 3–10 minutes ago'}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E5E0D8] shadow-sm">
            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {language === 'bn' ? 'মোট প্রাপ্ত স্থানাঙ্ক' : 'TOTAL TRACKED UNITS'}
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-slate-300" />
              <span className="font-mono text-4xl font-black tracking-tight text-[#272524]">{toBengaliDigits(buses.length)}</span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-slate-500">{language === 'bn' ? 'করিডোরে নিবন্ধিত ডিভাইস' : 'Registered corridor units'}</p>
          </div>
        </section>

        {buses.length === 0 && !loading && (
          <div className="flex items-start gap-3 rounded-2xl border-l-4 border-[#A87936] bg-white p-5 text-sm leading-relaxed text-slate-700 shadow-sm">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#A87936]" />
            <div>
              <div className="font-extrabold text-[#272524]">
                {language === 'bn' ? 'এই মুহূর্তে কোনো সক্রিয় জিপিএস স্থানাঙ্ক পাওয়া যায়নি।' : 'No active GPS telemetry packets received at this moment.'}
              </div>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                {language === 'bn'
                  ? 'কোনো বাসকে কৃত্রিমভাবে লাইভ দেখানো হয় না। চালক বা সুপারভাইজারের ডিভাইস থেকে সংযোগ স্থাপন হলেই অবস্থান দেখা যাবে।'
                  : 'We strictly refuse to fake bus positions. The radar updates automatically once a registered crew device transmits coordinates.'}
              </p>
            </div>
          </div>
        )}

        {/* Map Container */}
        <section className="overflow-hidden rounded-3xl border border-[#E5E0D8] bg-white shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="text-base font-extrabold text-[#272524]">
                {language === 'bn' ? 'করিডোর রাডার ও স্যাটেলাইট ম্যাপ' : 'Arterial Radar & Live Telemetry Map'}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {language === 'bn' ? 'সবুজ পিন: লাইভ আপডেট (<৩ মিনিট) • অ্যাম্বার: বিলম্বিত' : 'GREEN: LIVE (<3 MINS) • AMBER: DELAYED'}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#49665A]" />{language === 'bn' ? 'লাইভ' : 'LIVE'}</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#A87936]" />{language === 'bn' ? 'বিলম্বিত' : 'STALE'}</span>
            </div>
          </div>
          <LiveTrackingMap />
        </section>

        {/* Telemetry Architecture Protocol */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-sm space-y-4">
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#C92232]">
            TELEMETRY INTEGRITY PROTOCOL
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-sm text-[#272524]">01 / DEVICE TRUTHFULNESS</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {language === 'bn'
                  ? 'আমরা কৃত্রিম পথরেখা বা অনুমাননির্ভর কাল্পনিক গতির হিসাব দেখাই না। শুধুমাত্র প্রকৃত ডিভাইস সিগন্যাল প্রক্রিয়াজাত করা হয়।'
                  : 'We strictly reject simulated path movements. Only authentic authenticated device pings are rendered on the commuter radar.'}
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-sm text-[#272524]">02 / FRESHNESS BOUNDARY</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {language === 'bn'
                  ? '৩ মিনিটের কম সময়ের স্থানাঙ্ককে "সক্রিয় লাইভ" এবং ৩ থেকে ১০ মিনিটের স্থানাঙ্ককে স্পষ্ট সতর্কবার্তাসহ "বিলম্বিত" চিহ্নিত করা হয়।'
                  : 'Pings under 3 minutes are designated as verified active; updates between 3 and 10 minutes are clearly labelled as delayed.'}
              </p>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-sm text-[#272524]">03 / GEOFENCE COMPLIANCE</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
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
