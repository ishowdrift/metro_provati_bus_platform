'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftRight, Info, Ticket } from 'lucide-react';
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
  const { language } = useLanguage();
  const [fromStopId, setFromStopId] = useState(initialFromStopId);
  const [toStopId, setToStopId] = useState(initialToStopId);
  const [isSwapping, setIsSwapping] = useState(false);
  const fareResult = calculateFare(fromStopId, toStopId);

  const handleOriginChange = (value: string) => {
    setFromStopId(value);
    onSelectRoute?.(value, toStopId);
  };

  const handleDestinationChange = (value: string) => {
    setToStopId(value);
    onSelectRoute?.(fromStopId, value);
  };

  const handleSwap = () => {
    setIsSwapping(true);
    setFromStopId(toStopId);
    setToStopId(fromStopId);
    onSelectRoute?.(toStopId, fromStopId);
    setTimeout(() => setIsSwapping(false), 260);
  };

  const fieldClass =
    'h-12 w-full min-w-0 border border-stone-300 bg-[#FAF9F7] px-3 text-sm font-bold text-stone-900 outline-none transition focus:border-[#C92232] focus:ring-2 focus:ring-[#C92232]/15';

  return (
    <div className="border border-stone-300 bg-white p-5 shadow-xs transition-shadow duration-300 hover:shadow-transit sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C92232]">
            {language === 'bn' ? 'ভাড়া ক্যালকুলেটর' : 'Fare calculator'}
          </div>
          <h3 className="mt-2 text-lg font-black tracking-tight text-stone-950 sm:text-xl">
            {language === 'bn' ? 'আপনার যাত্রার ভাড়া' : 'Your journey fare'}
          </h3>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            {language === 'bn' ? 'দুটি স্টপ নির্বাচন করুন' : 'Choose two stops along the corridor'}
          </p>
        </div>
        <span className="border border-[#B7791F]/30 bg-[#FEF7EC] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#B7791F]">
          {language === 'bn' ? 'খসড়া' : 'Draft'}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <div className="min-w-0">
          <label htmlFor="fare-origin" className="mb-2 block text-[11px] font-bold text-stone-500">
            {language === 'bn' ? 'যাত্রা শুরু' : 'From'}
          </label>
          <select id="fare-origin" value={fromStopId} onChange={(event) => handleOriginChange(event.target.value)} className={fieldClass}>
            {INITIAL_STOPS.map((stop) => (
              <option key={stop.id} value={stop.id}>
                {stop.sequence}. {language === 'bn' ? stop.nameBn : stop.nameEn}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleSwap}
          aria-label={language === 'bn' ? 'শুরু ও গন্তব্য অদলবদল করুন' : 'Swap origin and destination'}
          className="mx-auto flex h-10 w-10 items-center justify-center border border-stone-200 text-stone-500 transition hover:border-[#C92232] hover:text-[#C92232] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C92232] sm:mb-1"
        >
          <ArrowLeftRight className={'h-4 w-4 transition-transform duration-300 ' + (isSwapping ? 'rotate-180 text-[#C92232]' : '')} />
        </button>

        <div className="min-w-0">
          <label htmlFor="fare-destination" className="mb-2 block text-[11px] font-bold text-stone-500">
            {language === 'bn' ? 'গন্তব্য' : 'To'}
          </label>
          <select id="fare-destination" value={toStopId} onChange={(event) => handleDestinationChange(event.target.value)} className={fieldClass}>
            {INITIAL_STOPS.map((stop) => (
              <option key={stop.id} value={stop.id}>
                {stop.sequence}. {language === 'bn' ? stop.nameBn : stop.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {fareResult && (
        <div className="mt-6 border-t border-stone-200 pt-5">
          {fromStopId === toStopId ? (
            <p className="text-sm font-semibold text-stone-600">
              {language === 'bn' ? 'একই স্টপ নির্বাচন করা হয়েছে। অন্য গন্তব্য বেছে নিন।' : 'You selected the same stop. Choose a different destination.'}
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
                    {language === 'bn' ? 'নির্বাচিত যাত্রা' : 'Selected journey'}
                  </div>
                  <div className="mt-2 text-sm font-extrabold leading-6 text-stone-900">
                    {language === 'bn' ? fareResult.fromStop.nameBn : fareResult.fromStop.nameEn}
                    <span className="mx-2 text-[#C92232]">→</span>
                    {language === 'bn' ? fareResult.toStop.nameBn : fareResult.toStop.nameEn}
                  </div>
                  <p className="mt-2 text-[11px] text-stone-500">
                    {language === 'bn'
                      ? toBengaliDigits(fareResult.stagesCount) + 'টি স্টেজ · প্রায় ' + toBengaliDigits(fareResult.estimatedDistanceKm) + ' কিমি'
                      : fareResult.stagesCount + ' stages · approx. ' + fareResult.estimatedDistanceKm + ' km'}
                  </p>
                </div>
                <div className="sm:text-right">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
                    {language === 'bn' ? 'জনপ্রতি নির্দেশক ভাড়া' : 'Indicative fare / person'}
                  </div>
                  <div className="mt-1 text-3xl font-black tracking-[-0.05em] text-[#C92232]">
                    {formatBDT(fareResult.fareBDT)}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4 border-t border-stone-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex max-w-md items-start gap-2 text-[11px] leading-5 text-stone-500">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#B7791F]" />
                  <p>{language === 'bn' ? fareResult.disclaimerBn : fareResult.disclaimerEn}</p>
                </div>
                <Link
                  href={'/tickets?from=' + encodeURIComponent(fromStopId) + '&to=' + encodeURIComponent(toStopId)}
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-[#C92232] px-5 py-3 text-xs font-extrabold text-white transition-all duration-200 hover:bg-[#A91D2A] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C92232]"
                >
                  <Ticket className="h-4 w-4" />
                  <span>{language === 'bn' ? 'আসন নির্বাচন করুন' : 'Choose seats'}</span>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
