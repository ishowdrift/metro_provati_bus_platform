'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FareCalculatorCard } from '@/components/FareCalculatorCard';
import { INITIAL_STOPS } from '@/data/mockData';
import { calculateFare, formatBDT, toBengaliDigits } from '@/lib/fareCalculator';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowUpRight, Info, Ticket } from 'lucide-react';

export default function FaresPage() {
  const { language } = useLanguage();
  const [selectedOrigin, setSelectedOrigin] = useState<string>('stop-1');

  const examples = [
    { from: 'stop-2', to: 'stop-9', titleBn: 'বহদ্দারহাট → কেইপিজেড', titleEn: 'Bahaddarhat → KEPZ' },
    { from: 'stop-7', to: 'stop-9', titleBn: 'আগ্রাবাদ → কেইপিজেড', titleEn: 'Agrabad → KEPZ' },
    { from: 'stop-1', to: 'stop-10', titleBn: 'কাপ্তাই → কাঠগড়', titleEn: 'Kaptai → Katgor' },
  ];

  return (
    <main className="bg-[#FAF9F7] pb-20">
      <div className="mx-auto max-w-[1240px] space-y-12 px-4 py-12 sm:space-y-16 sm:px-6 sm:py-16 lg:px-8">
        <header className="max-w-3xl">
          <div className="mb-4 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#C92232]">
            <span className="h-px w-7 bg-[#C92232]" />
            <span>{language === 'bn' ? 'ভাড়া তথ্য' : 'Fare information'}</span>
          </div>
          <h1 className="text-3xl font-black leading-[1.08] tracking-[-0.045em] text-stone-950 sm:text-5xl">
            {language === 'bn' ? 'যাত্রার আগে ভাড়া জেনে নিন।' : 'Know the fare before you go.'}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-500">
            {language === 'bn'
              ? 'নিচের হিসাবগুলো বর্তমান সিস্টেমে থাকা নির্দেশক খসড়া ভাড়া। এগুলোকে অনুমোদিত বা চূড়ান্ত ভাড়া হিসেবে ধরে নেবেন না।'
              : 'The figures below are indicative draft fares in the current system. They should not be treated as approved or final fares.'}
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[0.6fr_1.4fr] lg:items-start">
          <div className="space-y-4">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C92232]">
              {language === 'bn' ? 'দ্রুত হিসাব' : 'Quick estimate'}
            </div>
            <h2 className="text-2xl font-black tracking-[-0.035em] text-stone-950 sm:text-3xl">
              {language === 'bn' ? 'দুটি স্টপ নির্বাচন করুন।' : 'Choose two stops.'}
            </h2>
            <p className="text-sm leading-7 text-stone-500">
              {language === 'bn' ? 'ক্যালকুলেটরটি স্টেজ ও দূরত্বের একটি ধারণা দেবে। চূড়ান্ত ভাড়া কাউন্টারে নিশ্চিত করুন।' : 'The calculator provides a stage and distance estimate. Confirm the final fare at a counter.'}
            </p>
            <div className="border-l-2 border-amber-500 bg-amber-50 px-4 py-3 text-xs leading-6 text-amber-900">
              {language === 'bn' ? 'খসড়া তালিকা · পরিবর্তন হতে পারে' : 'Draft tariff · subject to change'}
            </div>
          </div>
          <FareCalculatorCard />
        </section>

        <section className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#C92232]">
                <span className="h-px w-7 bg-[#C92232]" />
                <span>{language === 'bn' ? 'ভাড়া উদাহরণ' : 'Fare examples'}</span>
              </div>
              <h2 className="text-2xl font-black tracking-[-0.035em] text-stone-950 sm:text-3xl">
                {language === 'bn' ? 'কয়েকটি পরিচিত যাত্রা।' : 'A few common journeys.'}
              </h2>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-800">
              {language === 'bn' ? 'সবগুলোই নির্দেশক' : 'All figures indicative'}
            </span>
          </div>

          <div className="grid gap-0 border-y border-stone-300 bg-white sm:grid-cols-3">
            {examples.map((example, index) => {
              const fare = calculateFare(example.from, example.to);
              return (
                <div key={example.from + '-' + example.to} className={'flex items-center justify-between gap-4 px-5 py-5 sm:px-6 ' + (index > 0 ? 'border-t border-stone-200 sm:border-l sm:border-t-0' : '')}>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
                      {language === 'bn' ? 'উদাহরণ ' + toBengaliDigits(index + 1) : 'Example ' + (index + 1)}
                    </div>
                    <div className="mt-2 text-xs font-extrabold leading-5 text-stone-900">
                      {language === 'bn' ? example.titleBn : example.titleEn}
                    </div>
                  </div>
                  <div className="shrink-0 text-xl font-black tracking-tight text-[#C92232]">
                    {fare ? formatBDT(fare.fareBDT) : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-y border-stone-300 bg-white py-6 sm:py-8">
          <div className="flex flex-col gap-5 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
            <div>
              <div className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C92232]">
                {language === 'bn' ? 'স্টেজ ম্যাট্রিক্স' : 'Stage matrix'}
              </div>
              <h2 className="text-xl font-black tracking-tight text-stone-950 sm:text-2xl">
                {language === 'bn' ? 'গন্তব্য অনুযায়ী ভাড়া' : 'Fare by destination'}
              </h2>
              <p className="mt-2 text-xs leading-6 text-stone-500">
                {language === 'bn' ? 'যাত্রা শুরুর স্টপ নির্বাচন করে তালিকা দেখুন।' : 'Select an origin to see the fare table.'}
              </p>
            </div>
            <div className="w-full sm:max-w-[300px]">
              <label htmlFor="fare-matrix-origin" className="mb-2 block text-[11px] font-bold text-stone-500">
                {language === 'bn' ? 'যাত্রা শুরু' : 'Origin stop'}
              </label>
              <select
                id="fare-matrix-origin"
                value={selectedOrigin}
                onChange={(event) => setSelectedOrigin(event.target.value)}
                className="h-12 w-full border border-stone-200 bg-[#FAF9F7] px-3 text-sm font-bold text-stone-900 outline-none focus:border-[#C92232] focus:ring-2 focus:ring-[#C92232]/15"
              >
                {INITIAL_STOPS.map((stop) => (
                  <option key={stop.id} value={stop.id}>
                    {stop.sequence}. {language === 'bn' ? stop.nameBn : stop.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-xs sm:text-sm">
              <thead className="border-y border-stone-200 bg-[#F8F7F5] text-[10px] font-extrabold uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="px-5 py-3 sm:px-8">#</th>
                  <th className="px-5 py-3">{language === 'bn' ? 'গন্তব্য' : 'Destination'}</th>
                  <th className="px-5 py-3">{language === 'bn' ? 'স্টেজ' : 'Stages'}</th>
                  <th className="px-5 py-3">{language === 'bn' ? 'আনুমানিক দূরত্ব' : 'Approx. distance'}</th>
                  <th className="px-5 py-3">{language === 'bn' ? 'খসড়া ভাড়া' : 'Draft fare'}</th>
                  <th className="px-5 py-3 text-right sm:px-8">{language === 'bn' ? 'বুকিং' : 'Booking'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {INITIAL_STOPS.map((destination) => {
                  const result = calculateFare(selectedOrigin, destination.id);
                  if (!result) return null;
                  const sameStop = selectedOrigin === destination.id;
                  return (
                    <tr key={destination.id} className={sameStop ? 'bg-[#FAF9F7] text-stone-400' : 'transition-colors hover:bg-[#FFF7F6]'}>
                      <td className="px-5 py-4 font-mono text-stone-400 sm:px-8">{toBengaliDigits(destination.sequence)}</td>
                      <td className="px-5 py-4 font-bold text-stone-900">{language === 'bn' ? destination.nameBn : destination.nameEn}</td>
                      <td className="px-5 py-4 font-mono">{toBengaliDigits(result.stagesCount)}</td>
                      <td className="px-5 py-4 font-mono">{toBengaliDigits(result.estimatedDistanceKm)} km</td>
                      <td className="px-5 py-4 font-mono font-black text-[#C92232]">{sameStop ? '—' : formatBDT(result.fareBDT)}</td>
                      <td className="px-5 py-4 text-right sm:px-8">
                        {!sameStop && (
                          <Link href={'/tickets?from=' + encodeURIComponent(selectedOrigin) + '&to=' + encodeURIComponent(destination.id)} className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#C92232] hover:text-[#A91D2A]">
                            <Ticket className="h-3.5 w-3.5" />
                            {language === 'bn' ? 'বাছাই' : 'Select'}
                            <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex items-start gap-3 border-l-2 border-amber-500 bg-amber-50 px-5 py-4 text-xs leading-6 text-amber-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
          <p>
            {language === 'bn'
              ? 'গুরুত্বপূর্ণ: এই ভাড়া তালিকা নির্দেশক খসড়া হিসাব। এটি সরকারি বা অপারেটর কর্তৃক চূড়ান্ত অনুমোদিত তালিকা নয়। যাত্রার আগে কাউন্টারে চূড়ান্ত ভাড়া নিশ্চিত করুন।'
              : 'Important: This fare table is an indicative draft calculation, not a final approved schedule from an operator or authority. Confirm the final fare at a counter before travelling.'}
          </p>
        </div>
      </div>
    </main>
  );
}
