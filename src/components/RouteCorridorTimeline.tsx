'use client';

import React from 'react';
import { RouteStop } from '@/types';
import { INITIAL_STOPS } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';
import { Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toBengaliDigits } from '@/lib/fareCalculator';

interface RouteCorridorTimelineProps {
  stops?: RouteStop[];
  onSelectStop?: (stop: RouteStop) => void;
  selectedStopId?: string;
}

export const RouteCorridorTimeline: React.FC<RouteCorridorTimelineProps> = ({
  stops = INITIAL_STOPS,
  onSelectStop,
  selectedStopId,
}) => {
  const { language } = useLanguage();

  return (
    <div className="divide-y divide-stone-200">
      {stops.map((stop, index) => {
        const isSelected = selectedStopId === stop.id;
        const isTerminal = stop.isTerminal;
        const stopName = language === 'bn' ? stop.nameBn : stop.nameEn;
        const stopAddress = language === 'bn' ? stop.addressBn : stop.addressEn;
        const boothName = language === 'bn' ? stop.boothNameBn : stop.boothNameEn;

        return (
          <div
            key={stop.id}
            onClick={onSelectStop ? () => onSelectStop(stop) : undefined}
            onKeyDown={
              onSelectStop
                ? (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onSelectStop(stop);
                    }
                  }
                : undefined
            }
            role={onSelectStop ? 'button' : undefined}
            tabIndex={onSelectStop ? 0 : undefined}
            aria-pressed={onSelectStop ? isSelected : undefined}
            className={
              'group grid grid-cols-[42px_1fr] gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[50px_1fr] sm:gap-4 transition-colors duration-150 ' +
              (onSelectStop ? 'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C92232] ' : '') +
              (isSelected ? 'bg-[#FFF7F6] -mx-3 px-3 sm:-mx-4 sm:px-4 ' : '')
            }
          >
            <div className="relative flex justify-center">
              <span
                className={
                  'relative z-10 flex h-8 w-8 items-center justify-center border text-[11px] font-black transition-all duration-200 ' +
                  (isTerminal
                    ? 'border-[#C92232] bg-[#C92232] text-white shadow-xs'
                    : isSelected
                    ? 'border-[#C92232] bg-[#C92232] text-white shadow-xs'
                    : 'border-stone-300 bg-white text-stone-600 group-hover:border-[#C92232] group-hover:text-[#C92232]')
                }
              >
                {toBengaliDigits(stop.sequence)}
              </span>
              {index !== stops.length - 1 && (
                <div aria-hidden="true" className="absolute bottom-[-18px] top-8 w-px bg-stone-200 overflow-hidden">
                  {(isSelected || isTerminal) && (
                    <div className="w-full h-full bg-gradient-to-b from-[#C92232] to-transparent opacity-75 animate-route-travel" />
                  )}
                </div>
              )}
            </div>

            <div className="min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h4 className="text-sm font-extrabold tracking-tight text-stone-900 group-hover:text-[#C92232] transition-colors sm:text-base">
                  {stopName}
                </h4>
                {isTerminal && (
                  <span className="border border-[#FCEBEC] bg-[#FFF7F6] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#A91D2A]">
                    {language === 'bn' ? 'টার্মিনাল' : 'Terminal'}
                  </span>
                )}
              </div>

              {stopAddress && (
                <p className="mt-1 text-[11px] leading-5 text-stone-500 sm:text-xs">
                  {stopAddress}
                </p>
              )}

              {stop.boothAvailable && boothName && (
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] font-semibold text-stone-500">
                  <span className="inline-flex items-center gap-1.5 text-stone-600">
                    <Building2 className="h-3.5 w-3.5 text-[#C92232]" />
                    {boothName}
                  </span>
                  {stop.phoneVerificationStatus === 'verified' ? (
                    <span className="inline-flex items-center gap-1 text-[#24775F]">
                      <CheckCircle2 className="h-3 w-3" />
                      {language === 'bn' ? 'যোগাযোগ যাচাইকৃত' : 'Contact verified'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[#B7791F]">
                      <AlertCircle className="h-3 w-3" />
                      {language === 'bn' ? 'যোগাযোগ যাচাইাধীন' : 'Contact unverified'}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
