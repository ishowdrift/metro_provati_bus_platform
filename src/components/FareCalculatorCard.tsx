'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRightLeft, Calculator, Compass, Info, CheckCircle2, Ticket } from 'lucide-react';
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
    <div className="bg-white rounded-3xl shadow-xl border border-red-100 p-6 md:p-8 transition-all">
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-50 rounded-2xl text-red-600">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg md:text-xl">
              {language === 'bn' ? 'ভাড়া ও পর্যায় ক্যালকুলেটর' : 'Fare & Stage Calculator'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'bn'
                ? 'চট্টগ্রাম করিডোরের যে কোনো দুটি স্টপের আনুমানিক খসড়া ভাড়া'
                : 'Indicative draft fare between any two stops along the corridor'}
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
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
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
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
            className="p-3 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 rounded-full border border-slate-200 shadow-sm transition hover:scale-105"
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
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
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

      {/* Calculated Result Card */}
      {fareResult && (
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-red-100 font-semibold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {language === 'bn'
                    ? `${fareResult.stagesCount}টি পর্যায় অতিক্রম`
                    : `${fareResult.stagesCount} Stages Traversed`}
                </span>
                <span>•</span>
                <span>
                  {language === 'bn'
                    ? `আনুমানিক দূরত্ব: ${toBengaliDigits(fareResult.estimatedDistanceKm)} কিমি`
                    : `Est. Distance: ${fareResult.estimatedDistanceKm} km`}
                </span>
              </div>
              <h4 className="text-xl font-bold tracking-tight">
                {language === 'bn' ? fareResult.fromStop.nameBn : fareResult.fromStop.nameEn}
                {' ➔ '}
                {language === 'bn' ? fareResult.toStop.nameBn : fareResult.toStop.nameEn}
              </h4>
            </div>

            <div className="text-left md:text-right flex md:flex-col items-center md:items-end justify-between">
              <span className="text-xs uppercase text-red-100 font-semibold tracking-wider">
                {language === 'bn' ? 'জনপ্রতি আনুমানিক ভাড়া' : 'Estimated Fare / Person'}
              </span>
              <div className="text-3xl md:text-4xl font-extrabold text-white font-mono tracking-tight">
                {formatBDT(fareResult.fareBDT)}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-red-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-2 text-xs text-red-100">
              <Info className="w-4 h-4 text-amber-200 flex-shrink-0 mt-0.5" />
              <p>{language === 'bn' ? fareResult.disclaimerBn : fareResult.disclaimerEn}</p>
            </div>

            <Link
              href={`/tickets?from=${fromStopId}&to=${toStopId}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-red-50 active:scale-95 text-red-700 font-bold text-sm rounded-xl transition shadow-md flex-shrink-0"
            >
              <Ticket className="w-4 h-4" />
              <span>{language === 'bn' ? 'আসন নির্বাচন করুন' : 'Book Seats'}</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
