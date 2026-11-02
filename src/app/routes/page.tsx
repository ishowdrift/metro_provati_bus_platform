'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_ROUTE, INITIAL_STOPS } from '@/data/mockData';
import { RouteCorridorTimeline } from '@/components/RouteCorridorTimeline';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowUpRight, MapPin, Ticket, CreditCard, Compass } from 'lucide-react';
import { toBengaliDigits } from '@/lib/fareCalculator';
import { RouteStop } from '@/types';

export default function RoutesPage() {
  const { language } = useLanguage();
  const [selectedStopId, setSelectedStopId] = useState<string | undefined>();

  const selectedStop = INITIAL_STOPS.find((s) => s.id === selectedStopId);

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

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-5 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white/80">
            <span className="h-px w-8 bg-white/75" />
            <span>LINE MP-01</span>
            <span className="text-white/40">/</span>
            <span>{language === 'bn' ? 'চট্টগ্রাম আর্টেরিয়াল করিডোর' : 'Chattogram Arterial Transit'}</span>
          </div>

          <h1 className="max-w-4xl text-3xl font-black leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl font-display">
            {language === 'bn' ? 'কাপ্তাই রাস্তার মাথা' : 'Kaptai Rastar Matha'}
            <span className="mt-2 block text-white/80">
              {language === 'bn' ? 'থেকে কাঠগড়।' : 'to Katgor.'}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/90 sm:text-base sm:leading-8 font-medium">
            {language === 'bn'
              ? 'চট্টগ্রাম নগরীর প্রধান পূর্ব-পশ্চিম করিডোর। তালিকাভুক্ত ১২টি নির্ধারিত স্টেশন, অবস্থান ও কাউন্টার বিবরণ।'
              : 'The primary east-west urban arterial connecting Chattogram’s commuter junctions across 24.9 km.'}
          </p>

          {/* Linear Route Wayfinding Strip */}
          <div className="mt-8 inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-black/25 backdrop-blur-md border border-white/20 font-mono text-xs text-white/95">
            <span className="font-bold">{language === 'bn' ? 'কাপ্তাই মাথা (টার্মিনাল)' : 'Kaptai Matha'}</span>
            <span className="text-white/50">── 24.9 KM ──</span>
            <span className="font-bold">{language === 'bn' ? 'কাঠগড় (টার্মিনাল)' : 'Katgor'}</span>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 border-t border-white/25 pt-5 font-mono">
            <div className="pr-3">
              <div className="text-2xl font-black sm:text-3xl">{toBengaliDigits(INITIAL_STOPS.length)}</div>
              <div className="mt-1 text-[11px] font-semibold text-white/75">
                {language === 'bn' ? 'স্টপ সংখ্যা' : 'Stations'}
              </div>
            </div>
            <div className="border-l border-white/25 px-4">
              <div className="text-2xl font-black sm:text-3xl">{toBengaliDigits(INITIAL_ROUTE.approximateDistanceKm)}</div>
              <div className="mt-1 text-[11px] font-semibold text-white/75">
                {language === 'bn' ? 'আনুমানিক কিমি' : 'Distance (km)'}
              </div>
            </div>
            <div className="border-l border-white/25 pl-4">
              <div className="text-2xl font-black sm:text-3xl">৳{toBengaliDigits(15)}–{toBengaliDigits(65)}</div>
              <div className="mt-1 text-[11px] font-semibold text-white/75">
                {language === 'bn' ? 'খসড়া ভাড়া' : 'Draft tariff'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Wayfinding Layout */}
      <div className="mx-auto max-w-7xl space-y-12 px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <section className="flex flex-col justify-between gap-4 border-b border-[#E5E0D8] pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-1 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#C92232]">
              <Compass className="w-4 h-4" />
              <span>STATION DIRECTORY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#272524]">
              {language === 'bn' ? 'পথের প্রতিটি স্টেশন ও কাউন্টার' : 'Every Station in Sequence'}
            </h2>
          </div>
          <p className="max-w-md text-xs leading-5 text-slate-500 sm:text-sm">
            {language === 'bn'
              ? 'স্কিম্যাটিক বারে বা তালিকায় যেকোনো স্টপ ক্লিক করে হাইলাইট করুন এবং সংশ্লিষ্ট ভাড়ার হিসাব দেখুন।'
              : 'Tap any station node in the schematic ribbon or list below to inspect coordinates and booking links.'}
          </p>
        </section>

        {/* Station Ledger with Contextual Metadata */}
        <section className="grid gap-8 lg:grid-cols-[0.35fr_0.65fr] lg:items-start">
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#E5E0D8] shadow-sm">
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                CORRIDOR PROFILE · LINE MP-01
              </div>
              <div className="mt-2 font-mono text-4xl sm:text-5xl font-black tracking-tight text-[#C92232]">
                {toBengaliDigits(INITIAL_STOPS.length)}
              </div>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#272524]">
                {language === 'bn' ? 'অনুমোদিত স্টপ সিকোয়েন্স' : 'Approved Station Sequence'}
              </p>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                {language === 'bn'
                  ? 'কাপ্তাই রাস্তার মাথা থেকে শুরু করে বহদ্দারহাট, মুরাদপুর, জিইসি ও ইপিজেড হয়ে কাঠগড় পর্যন্ত বিস্তৃত আর্টেরিয়াল রুট।'
                  : 'Chattogram’s high-frequency urban bus transit route spanning 12 official stops.'}
              </p>
            </div>

            {selectedStop ? (
              <div className="bg-white rounded-3xl p-6 border-2 border-[#C92232] shadow-md animate-fade-in-up">
                <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#A91D2A]">
                  {language === 'bn' ? 'নির্বাচিত স্টেশন' : 'Selected Station'}
                </div>
                <h3 className="mt-1 text-xl font-black text-[#272524]">
                  {selectedStop.sequence}. {language === 'bn' ? selectedStop.nameBn : selectedStop.nameEn}
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {language === 'bn' ? selectedStop.addressBn : selectedStop.addressEn}
                </p>
                {selectedStop.boothNameBn && (
                  <div className="mt-3 p-3 rounded-xl bg-[#F1EEE8] text-xs font-semibold text-[#272524]">
                    BOOTH: {language === 'bn' ? selectedStop.boothNameBn : selectedStop.boothNameEn}
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={'/tickets?from=' + encodeURIComponent(selectedStop.id)}
                    className="inline-flex items-center gap-1.5 bg-[#C92232] hover:bg-[#A91D2A] px-4 py-2.5 rounded-xl text-xs font-extrabold text-white transition-colors shadow-xs"
                  >
                    <Ticket className="h-3.5 w-3.5" />
                    <span>{language === 'bn' ? 'এখান থেকে বুকিং' : 'Book from here'}</span>
                  </Link>
                  <Link
                    href="/fares"
                    className="inline-flex items-center gap-1.5 border border-[#E5E0D8] bg-white hover:border-[#C92232] px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#272524] transition-colors"
                  >
                    <CreditCard className="h-3.5 w-3.5 text-[#C92232]" />
                    <span>{language === 'bn' ? 'ভাড়া তালিকা' : 'Tariff'}</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-5 border border-[#E5E0D8] text-xs text-slate-500 shadow-sm">
                <Compass className="h-5 w-5 text-[#C92232] mb-2" />
                <p className="leading-relaxed">
                  {language === 'bn'
                    ? 'তালিকায় স্টপ নির্বাচন করলে বিশদ কাউন্টার ও ভাড়ার লিংক এখানে দেখা যাবে।'
                    : 'Select a station from the schematic or timetable to inspect booth status.'}
                </p>
              </div>
            )}

            <div className="bg-white rounded-3xl p-5 border border-[#E5E0D8] shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#272524] uppercase tracking-wider">
                <MapPin className="h-4 w-4 text-[#C92232]" />
                <span>{language === 'bn' ? 'চট্টগ্রাম মেট্রোপলিটন জোন' : 'Chattogram Metropolitan Zone'}</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                {language === 'bn'
                  ? 'দূরত্ব ও ভাড়ার হিসাব নির্দেশক। চূড়ান্ত টিকিট ও সিট অনুমোদন কাউন্টারে সম্পন্ন হয়।'
                  : 'Distances and tariffs are indicative. Final seat ticketing occurs at station counters.'}
              </p>
            </div>
          </div>

          <div>
            <RouteCorridorTimeline
              selectedStopId={selectedStopId}
              onSelectStop={(stop: RouteStop) =>
                setSelectedStopId((prev) => (prev === stop.id ? undefined : stop.id))
              }
            />
          </div>
        </section>

        {/* Departure Planning Action Banner */}
        <section className="bg-[#272524] rounded-3xl p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="font-mono text-xs font-extrabold uppercase tracking-wider text-[#F2E4E2]">
              NEXT STEP · PASSENGER PLANNING
            </div>
            <h2 className="mt-1 text-2xl font-black tracking-tight">
              {language === 'bn' ? 'আপনার যাত্রা পরিকল্পনা করুন' : 'Plan Your Journey'}
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              {language === 'bn' ? 'ভাড়া হিসাব করুন অথবা অনলাইন আসন নির্বাচন দেখুন।' : 'Inspect indicative fares or continue to digital seat booking.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/fares"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-3 rounded-xl text-xs font-bold text-white transition"
            >
              <span>{language === 'bn' ? 'ভাড়া হিসাব করুন' : 'Calculate fare'}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/tickets"
              className="inline-flex items-center gap-2 bg-[#C92232] hover:bg-[#A91D2A] px-5 py-3 rounded-xl text-xs font-extrabold text-white transition shadow-lg shadow-[#C92232]/30"
            >
              <Ticket className="h-4 w-4" />
              <span>{language === 'bn' ? 'টিকিট কাটুন' : 'Book a ticket'}</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
