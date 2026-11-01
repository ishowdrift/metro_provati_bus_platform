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
      <div className="mx-auto max-w-[1240px] space-y-8 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <header className="flex flex-col justify-between gap-6 border-b border-stone-300 pb-8 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#C92232]">
              <span className="h-px w-7 bg-[#C92232]" />
              <span>{language === 'bn' ? 'জিপিএস আপডেট' : 'GPS updates'}</span>
            </div>
            <h1 className="text-3xl font-black leading-[1.08] tracking-[-0.045em] text-stone-950 sm:text-5xl">
              {t('tracking.title')}
            </h1>
            <p className="mt-4 text-sm leading-7 text-stone-500">
              {language === 'bn'
                ? 'বাসের অবস্থান কেবল ড্রাইভার বা সুপারভাইজারের ডিভাইস থেকে পাওয়া জিপিএস আপডেটের ভিত্তিতে দেখানো হয়।'
                : 'Bus locations are shown only from GPS updates received from a driver or supervisor device.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-[10px] font-semibold text-stone-400">
              {lastChecked ? (language === 'bn' ? 'সর্বশেষ যাচাই: ' : 'Checked: ') + lastChecked : loading ? (language === 'bn' ? 'তথ্য লোড হচ্ছে' : 'Loading data') : (language === 'bn' ? 'এখনো কোনো আপডেট নেই' : 'No update yet')}
            </div>
            <button
              type="button"
              onClick={fetchStatus}
              disabled={loading}
              className="inline-flex h-11 items-center gap-2 border border-stone-300 bg-white px-4 text-xs font-extrabold text-stone-700 transition hover:border-[#C92232] hover:text-[#C92232] disabled:opacity-50"
            >
              <RefreshCw className={'h-4 w-4 ' + (loading ? 'animate-spin' : '')} />
              {language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 border-y border-stone-300 bg-white sm:grid-cols-3">
          <div className="px-5 py-5 sm:px-7">
            <div className="text-[10px] font-bold uppercase tracking-[0.17em] text-stone-400">
              {language === 'bn' ? 'এখন লাইভ' : 'Live now'}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 bg-[#24775F]" />
              <span className="text-3xl font-black tracking-tight text-stone-950">{toBengaliDigits(activeCount)}</span>
            </div>
            <p className="mt-1 text-[11px] text-stone-500">{language === 'bn' ? '৩ মিনিটের মধ্যে পাওয়া আপডেট' : 'Updates received within 3 minutes'}</p>
          </div>
          <div className="border-t border-stone-200 px-5 py-5 sm:border-l sm:border-t-0 sm:px-7">
            <div className="text-[10px] font-bold uppercase tracking-[0.17em] text-stone-400">
              {language === 'bn' ? 'বিলম্বিত আপডেট' : 'Delayed updates'}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 bg-amber-500" />
              <span className="text-3xl font-black tracking-tight text-stone-950">{toBengaliDigits(staleCount)}</span>
            </div>
            <p className="mt-1 text-[11px] text-stone-500">{language === 'bn' ? '৩–১০ মিনিট আগের অবস্থান' : 'Last received 3–10 minutes ago'}</p>
          </div>
          <div className="border-t border-stone-200 px-5 py-5 sm:border-l sm:border-t-0 sm:px-7">
            <div className="text-[10px] font-bold uppercase tracking-[0.17em] text-stone-400">
              {language === 'bn' ? 'অবস্থান পাওয়া গেছে' : 'Locations received'}
            </div>
            <div className="mt-2 text-3xl font-black tracking-tight text-stone-950">{toBengaliDigits(buses.length)}</div>
            <p className="mt-1 text-[11px] text-stone-500">{language === 'bn' ? 'লাইভ ও বিলম্বিত উভয় আপডেট' : 'Live and delayed updates combined'}</p>
          </div>
        </section>

        {buses.length === 0 && !loading && (
          <div className="flex items-start gap-3 border-l-2 border-amber-500 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-950">
            <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-amber-700" />
            <div>
              <div className="font-extrabold">
                {language === 'bn' ? 'এই মুহূর্তে কোনো জিপিএস অবস্থান পাওয়া যায়নি।' : 'No GPS positions are available right now.'}
              </div>
              <p className="mt-1 text-xs text-amber-900">
                {language === 'bn'
                  ? 'কোনো বাসকে লাইভ দেখানোর মতো নতুন আপডেট এখনো পাওয়া যায়নি। ডিভাইস থেকে জিপিএস পাঠানো হলে এখানে অবস্থান দেখা যাবে।'
                  : 'No fresh device update has been received to display a bus as live. A location will appear here after a device sends GPS data.'}
              </p>
            </div>
          </div>
        )}

        <section className="overflow-hidden border border-stone-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-sm font-extrabold text-stone-900">
                {language === 'bn' ? 'করিডোর ম্যাপ' : 'Corridor map'}
              </h2>
              <p className="mt-1 text-[11px] text-stone-500">
                {language === 'bn' ? 'লাল পিন: লাইভ জিপিএস · অ্যাম্বার: বিলম্বিত জিপিএস' : 'Red marker: live GPS · amber marker: delayed GPS'}
              </p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold text-stone-500">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 bg-[#24775F]" />{language === 'bn' ? 'লাইভ' : 'Live'}</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 bg-amber-500" />{language === 'bn' ? 'বিলম্বিত' : 'Delayed'}</span>
            </div>
          </div>
          <LiveTrackingMap />
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <div className="border-t border-stone-300 pt-4">
            <ShieldCheck className="h-5 w-5 text-[#C92232]" />
            <h3 className="mt-3 text-sm font-extrabold text-stone-900">{language === 'bn' ? 'বাস্তব আপডেট' : 'Device-reported updates'}</h3>
            <p className="mt-2 text-xs leading-6 text-stone-500">
              {language === 'bn' ? 'কোনো কৃত্রিম বাস চলাচল বা অনুমানভিত্তিক লাইভ অবস্থান দেখানো উচিত নয়।' : 'The map should not show simulated bus movement or guessed live positions.'}
            </p>
          </div>
          <div className="border-t border-stone-300 pt-4">
            <Clock3 className="h-5 w-5 text-[#C92232]" />
            <h3 className="mt-3 text-sm font-extrabold text-stone-900">{language === 'bn' ? 'আপডেটের সময়' : 'Update freshness'}</h3>
            <p className="mt-2 text-xs leading-6 text-stone-500">
              {language === 'bn' ? '৩ মিনিটের মধ্যে পাওয়া তথ্য লাইভ, ৩–১০ মিনিটের তথ্য বিলম্বিত হিসেবে চিহ্নিত।' : 'Updates under 3 minutes are live; updates between 3 and 10 minutes are marked delayed.'}
            </p>
          </div>
          <div className="border-t border-stone-300 pt-4">
            <Navigation className="h-5 w-5 text-[#C92232]" />
            <h3 className="mt-3 text-sm font-extrabold text-stone-900">{language === 'bn' ? 'ডিভাইস সংযোগ' : 'Device connection'}</h3>
            <p className="mt-2 text-xs leading-6 text-stone-500">
              {language === 'bn' ? 'জিপিএস পাঠাতে ড্রাইভার বা সুপারভাইজারের ডিভাইসে লোকেশন অনুমতি ও নেটওয়ার্ক প্রয়োজন।' : 'A driver or supervisor device needs location permission and a network connection to send GPS updates.'}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
