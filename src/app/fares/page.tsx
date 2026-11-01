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
    { from: 'stop-2', to: 'stop-9', titleBn: 'বহদ্দারহাট → কেইপিজেড (ইপিজেড)', titleEn: 'Bahaddarhat → KEPZ (EPZ)' },
    { from: 'stop-7', to: 'stop-9', titleBn: 'আগ্রাবাদ বাদামতলী → কেইপিজেড', titleEn: 'Agrabad Badamtoli → KEPZ' },
    { from: 'stop-1', to: 'stop-10', titleBn: 'কাপ্তai রাস্তার মাথা → কাঠগড় (টার্মিনাল)', titleEn: 'Kaptai Rastar Matha → Katgor (Terminal)' },
  ];

  return (
    <main className="bg-[#FAF9F7] pb-20">
      <div className="mx-auto max-w-[1240px] space-y-16 px-4 py-12 sm:space-y-20 sm:px-6 sm:py-16 lg:px-8">
        {/* Header */}
        <header className="border-b border-stone-300 pb-8">
          <div className="mb-4 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#C92232]">
            <span className="h-px w-8 bg-[#C92232]" />
            <span>TARIFF SCHEDULE · 2026</span>
          </div>
          <h1 className="text-3xl font-black leading-[1.06] tracking-[-0.045em] text-stone-950 sm:text-5xl">
            {language === 'bn' ? 'যাত্রার আগে ভাড়া জেনে নিন।' : 'Know the Fare Before You Travel.'}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            {language === 'bn'
              ? 'নিচের হিসাবগুলো বর্তমান সিস্টেমে থাকা নির্দেশক খসড়া ভাড়া (৳১৫–৳৬৫)। এগুলো অনুমোদিত সরকারি বা চূড়ান্ত টিকিটের বিকল্প নয়; যাত্রার আগে কাউন্টারে নিশ্চিত করুন।'
              : 'All displayed rates are indicative draft estimates based on corridor stages. Always confirm current approved fares at official station counters.'}
          </p>
        </header>

        {/* Quick Calculator Section */}
        <section className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div className="space-y-5">
            <div className="font-mono text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C92232]">
              QUICK ESTIMATE CONSOLE
            </div>
            <h2 className="text-2xl font-black tracking-[-0.035em] text-stone-950 sm:text-3xl">
              {language === 'bn' ? 'যেকোনো দুটি স্টেশন নির্বাচন করুন।' : 'Choose Any Two Stations.'}
            </h2>
            <p className="text-sm leading-7 text-stone-600">
              {language === 'bn'
                ? 'ক্যালকুলেটরটি স্টেজ সংখ্যা এবং আনুমানিক দূরত্বের ভিত্তিতে নির্ধারিত খসড়া ভাড়ার তাৎক্ষণিক হিসাব দেখাবে।'
                : 'The console estimates stage count, approximate kilometres, and indicative tariff steps along the 24.9 km corridor.'}
            </p>
            <div className="border-l-2 border-[#B7791F] bg-[#FEF7EC] px-4 py-3 font-mono text-xs leading-6 text-[#7C5010]">
              INDICATIVE DRAFT TARIFF · SUBJECT TO RATIFICATION
            </div>
          </div>
          <FareCalculatorCard />
        </section>

        {/* Common Journey Benchmark Table (Swiss Ledger) */}
        <section className="space-y-6">
          <div className="flex flex-col justify-between gap-4 border-b border-stone-300 pb-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#C92232]">
                <span className="h-px w-8 bg-[#C92232]" />
                <span>BENCHMARK COMMUTE ROUTES</span>
              </div>
              <h2 className="text-2xl font-black tracking-[-0.035em] text-stone-950 sm:text-3xl">
                {language === 'bn' ? 'কয়েকটি পরিচিত যাত্রার ভাড়া।' : 'Key Corridor Travel Benchmarks.'}
              </h2>
            </div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#B7791F]">
              {language === 'bn' ? 'সবগুলো নির্দেশক খসড়া' : 'All rates indicative'}
            </span>
          </div>

          <div className="divide-y divide-stone-200 border-b border-stone-300">
            {examples.map((example, index) => {
              const fare = calculateFare(example.from, example.to);
              return (
                <div
                  key={example.from + '-' + example.to}
                  className="grid grid-cols-1 items-baseline gap-3 py-4 transition-colors hover:bg-white sm:grid-cols-[80px_1fr_120px_auto] sm:gap-6 sm:px-4"
                >
                  <span className="font-mono text-xs font-bold text-stone-400">
                    EX.{toBengaliDigits(index + 1)}
                  </span>
                  <div className="text-sm font-extrabold text-stone-900 sm:text-base">
                    {language === 'bn' ? example.titleBn : example.titleEn}
                  </div>
                  <div className="font-mono text-xs text-stone-500">
                    {fare ? `${fare.stagesCount} STAGES · ~${fare.estimatedDistanceKm} KM` : '—'}
                  </div>
                  <div className="font-mono text-xl font-black text-[#C92232] sm:text-right">
                    {fare ? formatBDT(fare.fareBDT) : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Full Comprehensive Stage Matrix */}
        <section className="border-t border-stone-300 pt-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 font-mono text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C92232]">
                ORIGIN MATRIX · ALL 12 STATIONS
              </div>
              <h2 className="text-2xl font-black tracking-tight text-stone-950 sm:text-3xl">
                {language === 'bn' ? 'গন্তব্য অনুযায়ী সম্পূর্ণ ভাড়ার তালিকা' : 'Complete Destination Tariff Table'}
              </h2>
              <p className="mt-1 text-xs text-stone-500">
                {language === 'bn' ? 'যাত্রা শুরুর স্টেশন পরিবর্তন করে নিচের তালিকা পর্যবেক্ষণ করুন।' : 'Select a starting station to recalculate stage distances and tariffs.'}
              </p>
            </div>
            <div className="w-full sm:max-w-[320px]">
              <label htmlFor="fare-matrix-origin" className="mb-2 block font-mono text-[11px] font-bold text-stone-500">
                {language === 'bn' ? 'যাত্রা শুরু নির্বাচন' : 'SELECT ORIGIN STATION'}
              </label>
              <select
                id="fare-matrix-origin"
                value={selectedOrigin}
                onChange={(event) => setSelectedOrigin(event.target.value)}
                className="h-12 w-full border border-stone-300 bg-white px-3 text-sm font-bold text-stone-900 outline-none transition focus:border-[#C92232] focus:ring-2 focus:ring-[#C92232]/15"
              >
                {INITIAL_STOPS.map((stop) => (
                  <option key={stop.id} value={stop.id}>
                    {stop.sequence}. {language === 'bn' ? stop.nameBn : stop.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto border-t border-stone-200">
            <table className="w-full min-w-[680px] border-collapse text-left text-xs sm:text-sm">
              <thead className="border-b border-stone-300 bg-[#FAF9F7] font-mono text-[10px] font-extrabold uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="py-3 pr-4">#</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'গন্তব্য স্টেশন' : 'Destination Station'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'স্টেজ সংখ্যা' : 'Stages'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'আনুমানিক দূরত্ব' : 'Approx Distance'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'খসড়া ভাড়া' : 'Draft Fare'}</th>
                  <th className="py-3 pl-4 text-right">{language === 'bn' ? 'আসন বুকিং' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-700">
                {INITIAL_STOPS.map((destination) => {
                  const result = calculateFare(selectedOrigin, destination.id);
                  if (!result) return null;
                  const sameStop = selectedOrigin === destination.id;
                  return (
                    <tr key={destination.id} className={sameStop ? 'bg-[#FAF9F7] text-stone-400' : 'transition-colors hover:bg-white'}>
                      <td className="py-4 pr-4 font-mono text-stone-400">{toBengaliDigits(destination.sequence)}</td>
                      <td className="py-4 px-4 font-bold text-stone-900">
                        {language === 'bn' ? destination.nameBn : destination.nameEn}
                        {destination.isTerminal && (
                          <span className="ml-2 bg-[#211F1F] px-1.5 py-0.5 font-mono text-[8px] font-black uppercase text-white">
                            TERM
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-mono">{toBengaliDigits(result.stagesCount)}</td>
                      <td className="py-4 px-4 font-mono">{toBengaliDigits(result.estimatedDistanceKm)} km</td>
                      <td className="py-4 px-4 font-mono text-base font-black text-[#C92232]">{sameStop ? '—' : formatBDT(result.fareBDT)}</td>
                      <td className="py-4 pl-4 text-right">
                        {!sameStop && (
                          <Link
                            href={'/tickets?from=' + encodeURIComponent(selectedOrigin) + '&to=' + encodeURIComponent(destination.id)}
                            className="inline-flex items-center gap-1.5 font-mono text-[11px] font-extrabold text-[#C92232] hover:text-[#A91D2A]"
                          >
                            <Ticket className="h-3.5 w-3.5" />
                            <span>{language === 'bn' ? 'টিকিট' : 'Book'}</span>
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

        {/* Regulatory Disclosure */}
        <div className="flex items-start gap-3 border-l-2 border-[#B7791F] bg-[#FEF7EC] px-5 py-4 text-xs leading-6 text-[#7C5010]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#B7791F]" />
          <p>
            {language === 'bn'
              ? 'আইনি ঘোষণা: এই ভাড়া তালিকা একটি নির্দেশক খসড়া হিসাব। এটি বিআরটিএ বা বাস মালিক সমিতি কর্তৃক অনুমোদিত চূড়ান্ত ভাড়ার বিকল্প নয়। প্রকৃত যাত্রার আগে সংশ্লিষ্ট কাউন্টারে ভাড়ার সত্যতা নিশ্চিত করে টিকিট সংগ্রহ করার জন্য যাত্রীদের অনুরোধ জানানো হচ্ছে।'
              : 'Regulatory Notice: This tariff ledger presents indicative draft calculations. It is not a replacement for final regulatory approvals from licensing authorities. Commuters are advised to confirm the current ratified fare with counter staff before travel.'}
          </p>
        </div>
      </div>
    </main>
  );
}
