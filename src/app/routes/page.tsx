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
    <main className="bg-[#FAF9F7] pb-20">
      {/* Swiss Transport Header */}
      <section className="relative isolate overflow-hidden bg-[#C92232] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-36 -top-36 h-[440px] w-[440px] rounded-full bg-[#E5384B]/25 blur-[100px] animate-ambient-drift"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 right-1/4 h-[380px] w-[380px] rounded-full bg-[#8B1621]/45 blur-[90px] animate-ambient-drift"
          style={{ animationDelay: '-12s' }}
        />

        <div className="relative mx-auto max-w-[1240px] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-5 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white/80">
            <span className="h-px w-8 bg-white/75" />
            <span>LINE MP-01</span>
            <span className="text-white/40">/</span>
            <span>{language === 'bn' ? 'চট্টগ্রাম আর্টেরিয়াল করিডোর' : 'Chattogram Arterial Transit'}</span>
          </div>

          <h1 className="max-w-4xl text-3xl font-black leading-[1.06] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            {language === 'bn' ? 'কাপ্তাই রাস্তার মাথা' : 'Kaptai Rastar Matha'}
            <span className="mt-2 block text-white/75">
              {language === 'bn' ? 'থেকে কাঠগড়।' : 'to Katgor.'}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
            {language === 'bn'
              ? 'চট্টগ্রাম নগরীর প্রধান পূর্ব-পশ্চিম করিডোর। তালিকাভুক্ত ১২টি নির্ধারিত স্টেশন, অবস্থান ও কাউন্টার বিবরণ।'
              : 'The primary east-west urban arterial connecting Chattogram’s commuter junctions across 24.9 km.'}
          </p>

          {/* Linear Route Wayfinding Strip */}
          <div className="mt-10 flex max-w-2xl items-center gap-2 border-y border-white/20 py-3 font-mono text-[10px] uppercase tracking-wider text-white/90">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="h-1.5 w-1.5 bg-white" />
              {language === 'bn' ? 'কাপ্তাই মাথা (টার্মিনাল)' : 'Kaptai Matha (Terminal)'}
            </span>
            <span className="h-px flex-1 bg-white/35" />
            <span className="text-[9px] text-white/60">24.9 KM</span>
            <span className="h-px flex-1 bg-white/35" />
            <span className="flex items-center gap-1.5 font-bold">
              <span className="h-1.5 w-1.5 bg-white" />
              {language === 'bn' ? 'কাঠগড় (টার্মিনাল)' : 'Katgor (Terminal)'}
            </span>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-3 border-t border-white/25 pt-5 font-mono">
            <div className="pr-3">
              <div className="text-2xl font-black sm:text-3xl">{toBengaliDigits(INITIAL_STOPS.length)}</div>
              <div className="mt-1 text-[10px] font-semibold text-white/70 sm:text-xs">
                {language === 'bn' ? 'স্টপ সংখ্যা' : 'Stations'}
              </div>
            </div>
            <div className="border-l border-white/25 px-4">
              <div className="text-2xl font-black sm:text-3xl">{toBengaliDigits(INITIAL_ROUTE.approximateDistanceKm)}</div>
              <div className="mt-1 text-[10px] font-semibold text-white/70 sm:text-xs">
                {language === 'bn' ? 'আনুমানিক কিমি' : 'Distance (km)'}
              </div>
            </div>
            <div className="border-l border-white/25 pl-4">
              <div className="text-2xl font-black sm:text-3xl">৳</div>
              <div className="mt-1 text-[10px] font-semibold text-white/70 sm:text-xs">
                {language === 'bn' ? 'খসড়া ভাড়া' : 'Draft tariff'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Wayfinding Layout */}
      <div className="mx-auto max-w-[1240px] space-y-16 px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <section className="flex flex-col justify-between gap-6 border-b border-stone-300 pb-8 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#C92232]">
              <span className="h-px w-8 bg-[#C92232]" />
              <span>STATION DIRECTORY</span>
            </div>
            <h2 className="text-3xl font-black tracking-[-0.04em] text-stone-950 sm:text-4xl">
              {language === 'bn' ? 'পথের প্রতিটি স্টেশন।' : 'Every Station in Sequence.'}
            </h2>
          </div>
          <p className="max-w-md text-xs leading-6 text-stone-500 sm:text-sm">
            {language === 'bn'
              ? 'স্কিম্যাটিক বারে বা তালিকায় যেকোনো স্টপ ক্লিক করে হাইলাইট করুন এবং সংশ্লিষ্ট ভাড়ার হিসাব দেখুন।'
              : 'Tap any station node in the schematic ribbon or list below to inspect coordinates and booking links.'}
          </p>
        </section>

        {/* Asymmetrical Station Ledger with Contextual Metadata */}
        <section className="grid gap-12 lg:grid-cols-[0.35fr_0.65fr] lg:items-start">
          <div className="space-y-6">
            <div className="border-b border-stone-300 pb-6">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                CORRIDOR PROFILE · LINE MP-01
              </div>
              <div className="mt-3 font-mono text-5xl font-black tracking-[-0.06em] text-[#C92232]">
                {toBengaliDigits(INITIAL_STOPS.length)}
              </div>
              <p className="mt-1 font-mono text-xs font-bold uppercase tracking-[0.16em] text-stone-500">
                {language === 'bn' ? 'অনুমোদিত স্টপ সিকোয়েন্স' : 'Approved Station Sequence'}
              </p>
            </div>

            {selectedStop ? (
              <div className="border-l-2 border-[#C92232] bg-white p-5 shadow-xs">
                <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#A91D2A]">
                  {language === 'bn' ? 'নির্বাচিত স্টেশন' : 'Selected Station'}
                </div>
                <h3 className="mt-1 text-lg font-black text-stone-900">
                  {selectedStop.sequence}. {language === 'bn' ? selectedStop.nameBn : selectedStop.nameEn}
                </h3>
                <p className="mt-1 text-xs text-stone-500">
                  {language === 'bn' ? selectedStop.addressBn : selectedStop.addressEn}
                </p>
                {selectedStop.boothNameBn && (
                  <p className="mt-2 font-mono text-[11px] text-stone-700">
                    BOOTH: {language === 'bn' ? selectedStop.boothNameBn : selectedStop.boothNameEn}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={'/tickets?from=' + encodeURIComponent(selectedStop.id)}
                    className="inline-flex items-center gap-1.5 bg-[#C92232] px-3.5 py-2 text-xs font-extrabold text-white hover:bg-[#A91D2A] transition-colors"
                  >
                    <Ticket className="h-3.5 w-3.5" />
                    <span>{language === 'bn' ? 'এখান থেকে বুকিং' : 'Book from here'}</span>
                  </Link>
                  <Link
                    href="/fares"
                    className="inline-flex items-center gap-1.5 border border-stone-300 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 hover:border-[#C92232] hover:text-[#C92232] transition-colors"
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    <span>{language === 'bn' ? 'ভাড়া তালিকা' : 'Tariff'}</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="border-l-2 border-stone-300 p-4 text-xs text-stone-500">
                <Compass className="h-4 w-4 text-[#C92232] mb-1" />
                <p>
                  {language === 'bn'
                    ? 'তালিকায় স্টপ নির্বাচন করলে বিশদ কাউন্টার ও ভাড়ার লিংক এখানে দেখা যাবে।'
                    : 'Select a station from the schematic or timetable to inspect booth status.'}
                </p>
              </div>
            )}

            <div className="border-l-2 border-[#C92232] pl-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider">
                <MapPin className="h-3.5 w-3.5 text-[#C92232]" />
                <span>{language === 'bn' ? 'চট্টগ্রাম মেট্রোপলিটন জোন' : 'Chattogram Metropolitan Zone'}</span>
              </div>
              <p className="mt-2 text-xs leading-6 text-stone-500">
                {language === 'bn'
                  ? 'দূরত্ব ও ভাড়ার হিসাব নির্দেশক। চূড়ান্ত টিকিট ও সিট অনুমোদন কাউন্টারে সম্পন্ন হয়।'
                  : 'Distances and tariffs are indicative. Final seat ticketing occurs at station counters.'}
              </p>
            </div>
          </div>

          <div className="lg:border-l lg:border-stone-200 lg:pl-10">
            <RouteCorridorTimeline
              selectedStopId={selectedStopId}
              onSelectStop={(stop: RouteStop) =>
                setSelectedStopId((prev) => (prev === stop.id ? undefined : stop.id))
              }
            />
          </div>
        </section>

        {/* Departure Planning Action Ending */}
        <section className="flex flex-col justify-between gap-6 border-t border-stone-300 pt-10 sm:flex-row sm:items-center">
          <div>
            <div className="font-mono text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C92232]">
              NEXT STEP · PASSENGER PLANNING
            </div>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-stone-950">
              {language === 'bn' ? 'আপনার যাত্রা পরিকল্পনা করুন।' : 'Plan Your Journey.'}
            </h2>
            <p className="mt-1 text-xs text-stone-500">
              {language === 'bn' ? 'ভাড়া হিসাব করুন অথবা অনলাইন আসন নির্বাচন দেখুন।' : 'Inspect indicative fares or continue to digital seat booking.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/fares"
              className="inline-flex min-h-11 items-center gap-2 border border-stone-300 bg-white px-5 py-3 text-xs font-extrabold text-stone-800 transition hover:border-[#C92232] hover:text-[#C92232]"
            >
              <span>{language === 'bn' ? 'ভাড়া হিসাব করুন' : 'Calculate fare'}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/tickets"
              className="inline-flex min-h-11 items-center gap-2 bg-[#C92232] px-5 py-3 text-xs font-extrabold text-white transition hover:bg-[#A91D2A]"
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
