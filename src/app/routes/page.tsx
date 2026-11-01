'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_ROUTE, INITIAL_STOPS } from '@/data/mockData';
import { RouteCorridorTimeline } from '@/components/RouteCorridorTimeline';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowUpRight, MapPin, Ticket, CreditCard } from 'lucide-react';
import { toBengaliDigits } from '@/lib/fareCalculator';
import { RouteStop } from '@/types';

export default function RoutesPage() {
  const { language } = useLanguage();
  const [selectedStopId, setSelectedStopId] = useState<string | undefined>();

  const selectedStop = INITIAL_STOPS.find((s) => s.id === selectedStopId);

  return (
    <main className="bg-[#FAF9F7] pb-20">
      <section className="relative isolate overflow-hidden bg-[#C92232] text-white">
        {/* Subtle Ambient Light Drifts */}
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
          <div className="mb-5 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.24em] text-white/75">
            <span className="h-px w-7 bg-white/75" />
            <span>ROUTE {INITIAL_ROUTE.code}</span>
            <span className="text-white/40">/</span>
            <span>{language === 'bn' ? 'চট্টগ্রাম' : 'Chattogram'}</span>
          </div>
          <h1 className="max-w-4xl text-3xl font-black leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
            {language === 'bn' ? 'কাপ্তাই রাস্তার মাথা' : 'Kaptai Rastar Matha'}
            <span className="mt-2 block text-white/75">
              {language === 'bn' ? 'থেকে কাঠগড়।' : 'to Katgor.'}
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
            {language === 'bn'
              ? 'চট্টগ্রামের এই করিডোরে তালিকাভুক্ত স্টপগুলোর ক্রম, অবস্থান ও কাউন্টার তথ্য দেখুন।'
              : 'Explore the listed stop sequence, locations and counter information along this Chattogram corridor.'}
          </p>

          <div className="mt-12 grid max-w-2xl grid-cols-3 border-t border-white/25 pt-5">
            <div className="pr-3">
              <div className="text-2xl font-black sm:text-3xl">{toBengaliDigits(INITIAL_STOPS.length)}</div>
              <div className="mt-1 text-[10px] font-semibold text-white/70 sm:text-xs">
                {language === 'bn' ? 'তালিকাভুক্ত স্টপ' : 'Listed stops'}
              </div>
            </div>
            <div className="border-l border-white/25 px-4">
              <div className="text-2xl font-black sm:text-3xl">{toBengaliDigits(INITIAL_ROUTE.approximateDistanceKm)}</div>
              <div className="mt-1 text-[10px] font-semibold text-white/70 sm:text-xs">
                {language === 'bn' ? 'আনুমানিক কিমি' : 'Approx. km'}
              </div>
            </div>
            <div className="border-l border-white/25 pl-4">
              <div className="text-2xl font-black sm:text-3xl">৳</div>
              <div className="mt-1 text-[10px] font-semibold text-white/70 sm:text-xs">
                {language === 'bn' ? 'খসড়া ভাড়া' : 'Draft fares'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1240px] space-y-14 px-4 pt-10 sm:px-6 sm:pt-16 lg:px-8">
        <section className="grid gap-6 md:grid-cols-[0.75fr_1.25fr] md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#C92232]">
              <span className="h-px w-7 bg-[#C92232]" />
              <span>{language === 'bn' ? 'স্টপ সিকোয়েন্স' : 'Stop sequence'}</span>
            </div>
            <h2 className="text-3xl font-black tracking-[-0.04em] text-stone-950 sm:text-4xl">
              {language === 'bn' ? 'পথের প্রতিটি স্টপ।' : 'Every stop along the way.'}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-stone-500 md:justify-self-end">
            {language === 'bn'
              ? 'স্টপের নাম, প্রকাশিত ঠিকানা এবং কাউন্টার তথ্য এক নজরে দেখুন। তালিকায় যেকোনো স্টপ ক্লিক করে হাইলাইট করুন।'
              : 'Review stop names, listed addresses and counter details. Select any stop in the list to highlight its details.'}
          </p>
        </section>

        <section className="grid gap-8 border-y border-stone-300 bg-white p-5 sm:p-8 lg:grid-cols-[0.34fr_0.66fr] lg:gap-12 lg:p-10 shadow-xs">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">MP / 01</div>
              <div className="mt-4 text-5xl font-black tracking-[-0.06em] text-[#C92232]">{toBengaliDigits(INITIAL_STOPS.length)}</div>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-stone-500">
                {language === 'bn' ? 'তালিকাভুক্ত স্টপ' : 'Listed stops'}
              </p>

              {selectedStop && (
                <div className="mt-6 border border-[#FCEBEC] bg-[#FFF7F6] p-4 animate-fade-in-up">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#A91D2A]">
                    {language === 'bn' ? 'নির্বাচিত স্টপ' : 'Selected Stop'}
                  </div>
                  <h3 className="mt-1 text-base font-black text-stone-900">
                    {selectedStop.sequence}. {language === 'bn' ? selectedStop.nameBn : selectedStop.nameEn}
                  </h3>
                  <p className="mt-1 text-xs text-stone-500">
                    {language === 'bn' ? selectedStop.addressBn : selectedStop.addressEn}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={'/tickets?from=' + encodeURIComponent(selectedStop.id)}
                      className="inline-flex items-center gap-1.5 bg-[#C92232] px-3 py-1.5 text-[11px] font-extrabold text-white hover:bg-[#A91D2A] transition-colors"
                    >
                      <Ticket className="h-3 w-3" />
                      <span>{language === 'bn' ? 'এখান থেকে বুকিং' : 'Book from here'}</span>
                    </Link>
                    <Link
                      href="/fares"
                      className="inline-flex items-center gap-1.5 border border-stone-300 bg-white px-3 py-1.5 text-[11px] font-bold text-stone-700 hover:border-[#C92232] hover:text-[#C92232] transition-colors"
                    >
                      <CreditCard className="h-3 w-3" />
                      <span>{language === 'bn' ? 'ভাড়া দেখুন' : 'View fare'}</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="border-l-2 border-[#C92232] pl-4">
              <div className="flex items-center gap-2 text-sm font-extrabold text-stone-900">
                <MapPin className="h-4 w-4 text-[#C92232]" />
                <span>{language === 'bn' ? 'চট্টগ্রাম, বাংলাদেশ' : 'Chattogram, Bangladesh'}</span>
              </div>
              <p className="mt-2 text-xs leading-6 text-stone-500">
                {language === 'bn'
                  ? 'রুটের দূরত্ব ও ভাড়ার অঙ্ক নির্দেশক; যাত্রার আগে কাউন্টারে নিশ্চিত করুন।'
                  : 'Route distance and fare figures are indicative; confirm them at a counter before travelling.'}
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

        <section className="flex flex-col justify-between gap-6 border-t border-stone-300 pt-8 sm:flex-row sm:items-center">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C92232]">
              {language === 'bn' ? 'পরবর্তী ধাপ' : 'Next step'}
            </div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-stone-950">
              {language === 'bn' ? 'আপনার যাত্রা পরিকল্পনা করুন।' : 'Plan your journey.'}
            </h2>
            <p className="mt-2 text-xs leading-6 text-stone-500">
              {language === 'bn' ? 'ভাড়া সম্পর্কে ধারণা নিন, তারপর আসন বুকিংয়ের ধাপ দেখুন।' : 'Preview the indicative fare, then continue to the seat booking flow.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/fares"
              className="inline-flex min-h-11 items-center gap-2 border border-stone-300 bg-white px-5 py-3 text-xs font-extrabold text-stone-800 transition hover:border-[#C92232] hover:text-[#C92232] active:scale-[0.99]"
            >
              <span>{language === 'bn' ? 'ভাড়া হিসাব করুন' : 'Check fares'}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/tickets"
              className="inline-flex min-h-11 items-center gap-2 bg-[#C92232] px-5 py-3 text-xs font-extrabold text-white transition hover:bg-[#A91D2A] active:scale-[0.99]"
            >
              <Ticket className="h-4 w-4" />
              <span>{language === 'bn' ? 'টিকিট বুক করুন' : 'Book a ticket'}</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
