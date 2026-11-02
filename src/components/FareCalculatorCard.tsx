'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRightLeft, Calculator, Compass, Info, CheckCircle2, Ticket, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_STOPS } from '@/data/mockData';
import { calculateFare, formatBDT, toBengaliDigits } from '@/lib/fareCalculator';

interface FareCalculatorCardProps {
  initialFromStopId?: string;
  initialToStopId?: string;
  onSelectRoute?: (fromId: string, toId: string) => void;
}

export const FareCalculatorCard: React.FC<FareCalculatorCardProps> = ({
  initialFromStopId = 'stop-1',
  initialToStopId = 'stop-10',
  onSelectRoute,
}) => {
  const { language, t } = useLanguage();
  const [fromStopId, setFromStopId] = useState(initialFromStopId);
  const [toStopId, setToStopId] = useState(initialToStopId);

  const handleSwap = () => {
    const temp = fromStopId;
    setFromStopId(toStopId);
    setToStopId(temp);
  };

  const fareResult = calculateFare(fromStopId, toStopId);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-[#E5E0D8] p-6 md:p-8 transition-all">
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#F2E4E2] rounded-2xl text-[#C92232]">
            <Calculator className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-extrabold text-[#272524] text-lg md:text-xl">
              {language === 'bn' ? 'ভাড়া ও পর্যায় ক্যালকুলেটর' : 'Fare & Stage Calculator'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'bn'
                ? 'চট্টগ্রাম করিডোরের যে কোনো দুটি স্টপের নির্দেশক খসড়া ভাড়া'
                : 'Indicative draft fare between any two stops along the corridor'}
            </p>
          </div>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-[#FAF4EB] text-[#A87936] rounded-full border border-[#A87936]/30">
          {language === 'bn' ? 'খসড়া তালিকা' : 'Draft Matrix'}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
        {/* Origin Selector */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {language === 'bn' ? 'যাত্রা শুরুর স্টপ' : 'Origin Stop'}
          </label>
          <select
            value={fromStopId}
            onChange={(e) => setFromStopId(e.target.value)}
            className="w-full px-4 py-3 bg-[#F1EEE8] border border-[#E5E0D8] rounded-xl text-sm font-bold text-[#272524] focus:outline-none focus:ring-2 focus:ring-[#C92232] transition"
          >
            {INITIAL_STOPS.map((stop) => (
              <option key={stop.id} value={stop.id}>
                {stop.sequence}. {language === 'bn' ? stop.nameBn : stop.nameEn}
                {stop.isTerminal ? (language === 'bn' ? ' (টার্মিনাল)' : ' (Terminal)') : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center md:col-span-1 pt-2 md:pt-6">
          <button
            onClick={handleSwap}
            aria-label="Swap origin and destination"
            className="p-3 bg-white hover:bg-[#F2E4E2] hover:text-[#C92232] text-slate-700 rounded-full border border-[#E5E0D8] shadow-sm transition hover:scale-105 active:scale-95"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Destination Selector */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {language === 'bn' ? 'গন্তব্য স্টপ' : 'Destination Stop'}
          </label>
          <select
            value={toStopId}
            onChange={(e) => setToStopId(e.target.value)}
            className="w-full px-4 py-3 bg-[#F1EEE8] border border-[#E5E0D8] rounded-xl text-sm font-bold text-[#272524] focus:outline-none focus:ring-2 focus:ring-[#C92232] transition"
          >
            {INITIAL_STOPS.map((stop) => (
              <option key={stop.id} value={stop.id}>
                {stop.sequence}. {language === 'bn' ? stop.nameBn : stop.nameEn}
                {stop.isTerminal ? (language === 'bn' ? ' (টার্মিনাল)' : ' (Terminal)') : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fare Result Card */}
      {fareResult && fromStopId !== toStopId ? (
        <div className="mt-6 p-5 rounded-2xl bg-[#FFF5F5] border border-[#F2E4E2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#272524]">
              <span>{fareResult.fromStop.nameBn}</span>
              <span className="text-[#C92232]">→</span>
              <span>{fareResult.toStop.nameBn}</span>
            </div>
            <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
              <span>{toBengaliDigits(fareResult.stagesCount)}টি স্টেজ</span>
              <span>•</span>
              <span>আনুমানিক {toBengaliDigits(fareResult.estimatedDistanceKm)} কিমি</span>
              <span>•</span>
              <span className="text-[#A87936] font-bold">নির্দেশক রূপরেখা</span>
            </div>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            <div className="text-right">
              <span className="block text-[10px] uppercase font-bold text-[#A91D2A] tracking-wider">
                {language === 'bn' ? 'জনপ্রতি ভাড়া' : 'Fare / Passenger'}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#C92232] font-mono">
                {formatBDT(fareResult.fareBDT)}
              </div>
            </div>

            <Link
              href={`/tickets?from=${encodeURIComponent(fromStopId)}&to=${encodeURIComponent(toStopId)}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C92232] hover:bg-[#A91D2A] text-white font-extrabold text-xs shadow-md transition"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'আসন বুক করুন' : 'Book Seats'}</span>
            </Link>
          </div>
        </div>
      ) : fromStopId === toStopId ? (
        <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
          {language === 'bn'
            ? 'দয়া করে দুটি ভিন্ন স্টপেজ নির্বাচন করুন।'
            : 'Please select two different stops.'}
        </div>
      ) : null}

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-[#C92232] flex-shrink-0" />
        <span>
          {language === 'bn'
            ? 'ভাড়া বিআরটিএ নির্দেশিকা ও মেট্রো প্রভাতী বাস মালিক সমিতির অনুমোদিত সর্বশেষ খসড়া অনুযায়ী সমন্বয়কৃত।'
            : 'Fares are indicative and aligned with approved corridor guidelines.'}
        </span>
      </div>
    </div>
  );
};
