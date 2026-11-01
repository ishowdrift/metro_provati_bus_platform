'use client';

import React, { useState, useEffect } from 'react';
import { LiveTrackingMap } from '@/components/LiveTrackingMap';
import { useLanguage } from '@/context/LanguageContext';
import { Bus, GpsFreshness } from '@/types';
import { toBengaliDigits } from '@/lib/fareCalculator';
import {
  Navigation,
  Compass,
  ShieldCheck,
  Smartphone,
  AlertTriangle,
  RefreshCw,
  Phone,
  Info,
} from 'lucide-react';

export default function TrackingPage() {
  const { language, t } = useLanguage();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/tracking/buses');
      const data = await res.json();
      if (data.success) {
        setBuses(data.buses);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const onDutyCount = buses.filter((b) => b.status === 'on_duty').length;
  const liveGpsCount = buses.filter(
    (b) => b.isLiveSharing !== false && b.freshness === 'active' && b.status === 'on_duty'
  ).length;
  const lastKnownCount = buses.filter(
    (b) => b.isLiveSharing === false || b.freshness !== 'active'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold mb-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span>{language === 'bn' ? 'স্যাটেলাইট জিপিএস সংযুক্ত' : 'Satellite GPS Connected'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t('tracking.title')}
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          {t('tracking.subtitle')}
        </p>
      </div>

      {/* Fleet Live Metric Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-red-100 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold">
            {language === 'bn' ? 'মোট বহর' : 'Total Fleet'}
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
            {toBengaliDigits(buses.length)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-red-100 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold">
            {language === 'bn' ? 'রুটে কর্মরত বাস' : 'On-Duty Buses'}
          </div>
          <div className="text-2xl font-extrabold text-red-600 font-mono mt-1">
            {toBengaliDigits(onDutyCount)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-red-100 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold">
            {language === 'bn' ? 'লাইভ জিপিএস সক্রিয় (🔴 লাইভ)' : 'Live Telemetry (<3m)'}
          </div>
          <div className="text-2xl font-extrabold text-red-600 font-mono mt-1 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            {toBengaliDigits(liveGpsCount)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-xs bg-amber-50/40">
          <div className="text-xs text-amber-800 font-semibold flex items-center gap-1">
            <span>⏱️</span>
            <span>{language === 'bn' ? 'সর্বশেষ অবস্থান প্রদর্শিত' : 'Last Known Location'}</span>
          </div>
          <div className="text-2xl font-extrabold text-amber-700 font-mono mt-1">
            {toBengaliDigits(lastKnownCount)}
          </div>
        </div>
      </div>

      {/* Main Map */}
      <LiveTrackingMap />

      {/* Genuine Telemetry & Transparency Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-red-200" />
            <span>
              {language === 'bn' ? 'জেনুইন জিপিএস গ্যারান্টি' : 'Genuine GPS Guarantee'}
            </span>
          </div>
          <p className="text-xs text-red-100 leading-relaxed">
            {language === 'bn'
              ? 'মেট্রো প্রভাতী প্ল্যাটফর্ম কোনো কৃত্রিম অ্যানিমেশন, অনুমানমূলক গতিপথ বা ফেক সিমুলেশন প্রদর্শন করে না। বাস শুধুমাত্র তখনই ট্র্যাকিং ম্যাপে অবস্থান বদলায় যখন অন-ডিউটি সুপারভাইজারের মোবাইল ডিভাইস থেকে সরাসরি কার্যকর জিপিএস সংকেত সার্ভারে পৌঁছায়।'
              : 'Metro Probati strictly prohibits simulated or fictitious movements. A bus position shifts on the map only when authentic GPS hardware coordinates are ingested from active on-duty personnel.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Info className="w-5 h-5 text-amber-600" />
            <span>
              {language === 'bn' ? 'যাত্রী আস্থা ও স্বচ্ছতা নীতি' : 'Passenger Trust Policy'}
            </span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            {language === 'bn'
              ? 'সুপারভাইজার সাময়িক জিপিএস সম্প্রচার বন্ধ রাখলে বা যাত্রা বিরতিতে গেলে বাসটি উধাও হয় না; বরং বিশ্বস্ততার সাথে বাসটির সর্বশেষ নিশ্চিত স্টপ ও সময় নিখুঁতভাবে প্রদর্শিত থাকে। ফলে যাত্রীরা সর্বদা সঠিক তথ্য জানতে পারেন।'
              : 'When a supervisor pauses GPS broadcasting, the bus never disappears. Its exact last confirmed stop and timestamp are prominently displayed to maintain complete passenger transparency.'}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-red-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Smartphone className="w-5 h-5 text-red-600" />
            <span>
              {language === 'bn' ? 'মোবাইল ট্র্যাকিং ও PWA' : 'Mobile Telemetry & PWA'}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'bn'
              ? 'মোবাইল ব্রাউজারগুলোর নিরাপত্তা বিধিমালার কারণে স্ক্রিন লক বা ট্যাব বন্ধ থাকলে অবস্থান ট্র্যাকিং সাময়িক স্থগিত হতে পারে। দীর্ঘস্থায়ী অবিচ্ছিন্ন ট্র্যাকিংয়ের জন্য সুপারভাইজারদের ইনস্টলযোগ্য PWA হোমস্ক্রিনে যুক্ত করে ব্যবহারের পরামর্শ দেওয়া হয়।'
              : 'Due to standard OS power management on mobile web browsers, background tracking may pause when the device sleeps. For persistent duty shifts, the installable PWA provides seamless foreground telemetry.'}
          </p>
        </div>
      </div>
    </div>
  );
}
