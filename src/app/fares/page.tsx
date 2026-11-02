'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FareCalculatorCard } from '@/components/FareCalculatorCard';
import { INITIAL_STOPS } from '@/data/mockData';
import { calculateFare, formatBDT, toBengaliDigits } from '@/lib/fareCalculator';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowUpRight, Info, Ticket, CreditCard, ShieldCheck } from 'lucide-react';

export default function FaresPage() {
  const { language } = useLanguage();
  const [selectedOrigin, setSelectedOrigin] = useState<string>('stop-1');

  const examples = [
    { from: 'stop-2', to: 'stop-9', titleBn: 'বহদ্দারহাট → কেইপিজেড (ইপিজেড)', titleEn: 'Bahaddarhat → KEPZ (EPZ)' },
    { from: 'stop-7', to: 'stop-9', titleBn: 'আগ্রাবাদ বাদামতলী → কেইপিজেড', titleEn: 'Agrabad Badamtoli → KEPZ' },
    { from: 'stop-1', to: 'stop-10', titleBn: 'কাপ্তাই রাস্তার মাথা → কাঠগড় (টার্মিনাল)', titleEn: 'Kaptai Rastar Matha → Katgor (Terminal)' },
  ];

  return (
    <main className="bg-[#F1EEE8] pb-20">
      {/* Header */}
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
            <span>TARIFF SCHEDULE · LINE MP-01</span>
          </div>

          <h1 className="max-w-4xl text-3xl font-black leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl font-display">
            {language === 'bn' ? 'যাত্রার আগে সঠিক' : 'Know the Fare'}
            <span className="mt-2 block text-white/80">
              {language === 'bn' ? 'ভাড়া জেনে নিন।' : 'Before You Travel.'}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/90 sm:text-base sm:leading-8 font-medium">
            {language === 'bn'
              ? 'নিচের হিসাবগুলো বর্তমান সিস্টেমে থাকা নির্দেশক খসড়া ভাড়া (৳১৫–৳৬৫)। এগুলো অনুমোদিত সরকারি রূপরেখা অনুসারে প্রস্তুত; যাত্রার আগে কাউন্টারে নিশ্চিত করুন।'
              : 'All displayed rates are indicative draft estimates based on corridor stages. Always confirm current approved fares at official station counters.'}
          </p>

          <div className="mt-8 inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-black/25 backdrop-blur-md border border-white/20 font-mono text-xs text-white/95">
            <CreditCard className="w-4 h-4 text-white" />
            <span>{language === 'bn' ? 'সর্বনিম্ন ভাড়া: ৳১৫ • সর্বোচ্চ টার্মিনাল ভাড়া: ৳৬৫' : 'Minimum: ৳15 • Terminal Fare: ৳65'}</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-12 sm:space-y-20 sm:px-6 sm:py-16 lg:px-8">
        {/* Quick Calculator Section */}
        <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-sm space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C92232]">
              <CreditCard className="w-4 h-4" />
              <span>QUICK ESTIMATE CONSOLE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#272524]">
              {language === 'bn' ? 'যেকোনো দুটি স্টেশন নির্বাচন করুন' : 'Choose Any Two Stations'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {language === 'bn'
                ? 'ক্যালকুলেটরটি স্টেজ সংখ্যা এবং আনুমানিক দূরত্বের ভিত্তিতে নির্ধারিত খসড়া ভাড়ার তাৎক্ষণিক হিসাব দেখাবে।'
                : 'The console estimates stage count, approximate kilometres, and indicative tariff steps along the 24.9 km corridor.'}
            </p>
            <div className="rounded-2xl border border-[#A87936]/30 bg-[#FAF4EB] p-4 text-xs font-semibold leading-relaxed text-[#A87936]">
              {language === 'bn'
                ? 'নির্দেশক খসড়া রূপরেখা: বিআরটিএ ও বাস মালিক সমিতি কর্তৃক অনুমোদিত দূরত্বের ধাপ অনুযায়ী হিসাবকৃত।'
                : 'Indicative Draft Tariff: Calculated according to approved corridor stage boundaries.'}
            </div>
          </div>
          <FareCalculatorCard />
        </section>

        {/* Common Journey Benchmark Table */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-sm space-y-6">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-1 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#C92232]">
                <ShieldCheck className="w-4 h-4" />
                <span>BENCHMARK COMMUTE ROUTES</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#272524]">
                {language === 'bn' ? 'কয়েকটি বহুল ব্যবহৃত দূরত্বের ভাড়া' : 'Key Corridor Travel Benchmarks'}
              </h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-[#FAF4EB] text-[#A87936] rounded-full border border-[#A87936]/30">
              {language === 'bn' ? 'সবগুলো নির্দেশক খসড়া' : 'All rates indicative'}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {examples.map((example, index) => {
              const fare = calculateFare(example.from, example.to);
              return (
                <div
                  key={example.from + '-' + example.to}
                  className="grid grid-cols-1 items-center gap-3 py-4 transition-colors hover:bg-[#F1EEE8]/40 sm:grid-cols-[60px_1fr_160px_auto] sm:gap-6 rounded-xl sm:px-3"
                >
                  <span className="font-mono text-xs font-black text-slate-400">
                    #{toBengaliDigits(index + 1)}
                  </span>
                  <div className="text-sm font-extrabold text-[#272524]">
                    {language === 'bn' ? example.titleBn : example.titleEn}
                  </div>
                  <div className="font-mono text-xs text-slate-500">
                    {fare ? `${toBengaliDigits(fare.stagesCount)} স্টেজ • ~${toBengaliDigits(fare.estimatedDistanceKm)} কিমি` : '—'}
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
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-sm space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="mb-1 font-mono text-xs font-bold uppercase tracking-wider text-[#C92232]">
                ORIGIN MATRIX · ALL 12 STATIONS
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#272524]">
                {language === 'bn' ? 'গন্তব্য অনুযায়ী সম্পূর্ণ ভাড়ার তালিকা' : 'Complete Destination Tariff Table'}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {language === 'bn' ? 'যাত্রা শুরুর স্টেশন পরিবর্তন করে নিচের তালিকা পর্যবেক্ষণ করুন।' : 'Select a starting station to recalculate stage distances and tariffs.'}
              </p>
            </div>
            <div className="w-full sm:max-w-[320px]">
              <label htmlFor="fare-matrix-origin" className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {language === 'bn' ? 'যাত্রা শুরু নির্বাচন' : 'SELECT ORIGIN STATION'}
              </label>
              <select
                id="fare-matrix-origin"
                value={selectedOrigin}
                onChange={(event) => setSelectedOrigin(event.target.value)}
                className="h-11 w-full rounded-xl border border-[#E5E0D8] bg-[#F1EEE8] px-3 text-xs sm:text-sm font-bold text-[#272524] outline-none transition focus:border-[#C92232] focus:ring-2 focus:ring-[#C92232]/20"
              >
                {INITIAL_STOPS.map((stop) => (
                  <option key={stop.id} value={stop.id}>
                    {stop.sequence}. {language === 'bn' ? stop.nameBn : stop.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-200 bg-[#F1EEE8] font-mono text-[10px] font-black uppercase tracking-wider text-slate-500 rounded-xl">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">#</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'গন্তব্য স্টেশন' : 'Destination Station'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'স্টেজ সংখ্যা' : 'Stages'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'আনুমানিক দূরত্ব' : 'Approx Distance'}</th>
                  <th className="py-3 px-4">{language === 'bn' ? 'খসড়া ভাড়া' : 'Draft Fare'}</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">{language === 'bn' ? 'আসন বুকিং' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {INITIAL_STOPS.map((destination) => {
                  const result = calculateFare(selectedOrigin, destination.id);
                  if (!result) return null;
                  const sameStop = selectedOrigin === destination.id;
                  return (
                    <tr key={destination.id} className={sameStop ? 'bg-slate-50 text-slate-400' : 'transition-colors hover:bg-[#F1EEE8]/50'}>
                      <td className="py-3.5 px-4 font-mono text-slate-400">{toBengaliDigits(destination.sequence)}</td>
                      <td className="py-3.5 px-4 font-bold text-[#272524]">
                        {language === 'bn' ? destination.nameBn : destination.nameEn}
                        {destination.isTerminal && (
                          <span className="ml-2 bg-[#C92232] px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase text-white">
                            TERM
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono">{toBengaliDigits(result.stagesCount)}</td>
                      <td className="py-3.5 px-4 font-mono">{toBengaliDigits(result.estimatedDistanceKm)} km</td>
                      <td className="py-3.5 px-4 font-mono text-base font-black text-[#C92232]">{sameStop ? '—' : formatBDT(result.fareBDT)}</td>
                      <td className="py-3.5 px-4 text-right">
                        {!sameStop && (
                          <Link
                            href={'/tickets?from=' + encodeURIComponent(selectedOrigin) + '&to=' + encodeURIComponent(destination.id)}
                            className="inline-flex items-center gap-1.5 font-bold text-xs text-[#C92232] hover:text-[#A91D2A] bg-[#FFF5F5] px-3 py-1.5 rounded-lg border border-[#F2E4E2] transition"
                          >
                            <Ticket className="h-3.5 w-3.5" />
                            <span>{language === 'bn' ? 'টিকেট' : 'Book'}</span>
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
        <div className="flex items-start gap-3 rounded-2xl border-l-4 border-[#A87936] bg-white p-5 text-xs leading-relaxed text-slate-600 shadow-sm">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#A87936]" />
          <p>
            {language === 'bn'
              ? 'আইনি ঘোষণা: এই ভাড়া তালিকা একটি নির্দেশক খসড়া হিসাব। এটি বিআরটিএ বা বাস মালিক সমিতি কর্তৃক অনুমোদিত সর্বশেষ ভাড়ার নির্দেশিকা অনুসারে প্রদর্শিত। প্রকৃত যাত্রার আগে সংশ্লিষ্ট কাউন্টারে ভাড়ার সত্যতা নিশ্চিত করে টিকিট সংগ্রহ করার জন্য যাত্রীদের অনুরোধ জানানো হচ্ছে।'
              : 'Regulatory Notice: This tariff ledger presents indicative draft calculations. It is aligned with current corridor distance guidelines. Commuters are advised to confirm final fares with counter staff before travel.'}
          </p>
        </div>
      </div>
    </main>
  );
}
