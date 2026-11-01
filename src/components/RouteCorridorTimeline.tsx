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
  showSchematic?: boolean;
}

export const RouteCorridorTimeline: React.FC<RouteCorridorTimelineProps> = ({
  stops = INITIAL_STOPS,
  onSelectStop,
  selectedStopId,
  showSchematic = true,
}) => {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Swiss Transport Wayfinding Schematic Ribbon */}
      {showSchematic && (
        <div className="border border-stone-200 bg-[#FAF9F7] p-4">
          <div className="flex items-center justify-between gap-2 border-b border-stone-200 pb-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-stone-500">
            <span className="flex items-center gap-1.5 text-[#C92232]">
              <span className="h-2 w-2 bg-[#C92232]" />
              {language === 'bn' ? 'করিডোর স্কিম্যাটিক' : 'Corridor Schematic'}
            </span>
            <span className="font-mono text-stone-400">LINE MP-01 · 24.9 KM</span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-1 overflow-x-auto pb-2 pt-1 no-scrollbar">
            {stops.map((stop, i) => {
              const isSelected = selectedStopId === stop.id;
              const isTerminal = stop.isTerminal;
              const isHub = stop.id === 'stop-9'; // EPZ / KEPZ major hub

              return (
                <button
                  type="button"
                  key={stop.id}
                  onClick={onSelectStop ? () => onSelectStop(stop) : undefined}
                  title={`${stop.sequence}. ${language === 'bn' ? stop.nameBn : stop.nameEn}`}
                  className="group relative flex flex-col items-center px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C92232]"
                >
                  {/* Station Node */}
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`flex items-center justify-center font-mono text-[9px] font-black transition-all duration-200 ${
                        isTerminal
                          ? 'h-6 w-6 bg-[#C92232] text-white'
                          : isSelected
                          ? 'h-6 w-6 bg-stone-900 text-white'
                          : isHub
                          ? 'h-5 w-5 border-2 border-[#C92232] bg-white text-[#C92232] group-hover:bg-[#C92232] group-hover:text-white'
                          : 'h-4 w-4 border border-stone-300 bg-white text-stone-500 group-hover:border-[#C92232] group-hover:text-[#C92232]'
                      }`}
                    >
                      {isTerminal ? 'T' : toBengaliDigits(stop.sequence)}
                    </span>
                  </div>

                  {/* Micro label for key milestones */}
                  <span
                    className={`mt-1.5 max-w-[58px] truncate text-center text-[9px] font-bold transition-colors ${
                      isSelected
                        ? 'text-[#C92232]'
                        : isTerminal || isHub
                        ? 'text-stone-900'
                        : 'text-stone-400 group-hover:text-stone-700'
                    }`}
                  >
                    {language === 'bn' ? stop.nameBn : stop.nameEn}
                  </span>

                  {/* Connecting track line between nodes */}
                  {i < stops.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-[calc(50%+12px)] top-[11px] h-0.5 w-[calc(100%-12px)] bg-stone-200"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Structured Station Wayfinding Ledger */}
      <div className="divide-y divide-stone-200 border-t border-stone-200">
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
              className={`group grid grid-cols-[38px_1fr] gap-3 py-3.5 first:pt-3 last:pb-3 sm:grid-cols-[46px_1fr] sm:gap-4 transition-colors duration-150 ${
                onSelectStop
                  ? 'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C92232]'
                  : ''
              } ${isSelected ? 'bg-[#FFF7F6] -mx-2 px-2 sm:-mx-3 sm:px-3' : 'hover:bg-white/80'}`}
            >
              {/* Wayfinding Sequence Marker */}
              <div className="relative flex justify-center">
                <span
                  className={`relative z-10 flex h-7 w-7 items-center justify-center font-mono text-[10px] font-black transition-all duration-200 ${
                    isTerminal
                      ? 'bg-[#C92232] text-white'
                      : isSelected
                      ? 'bg-[#211F1F] text-white'
                      : 'border border-stone-300 bg-white text-stone-600 group-hover:border-[#C92232] group-hover:text-[#C92232]'
                  }`}
                >
                  {toBengaliDigits(stop.sequence)}
                </span>
                {index !== stops.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="absolute bottom-[-16px] top-7 w-px bg-stone-200 overflow-hidden"
                  >
                    {(isSelected || isTerminal) && (
                      <div className="w-full h-full bg-gradient-to-b from-[#C92232] to-transparent opacity-70 animate-route-travel" />
                    )}
                  </div>
                )}
              </div>

              {/* Station Details */}
              <div className="min-w-0 pb-1">
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <h4 className="text-sm font-extrabold tracking-tight text-stone-900 group-hover:text-[#C92232] transition-colors sm:text-base">
                    {stopName}
                  </h4>
                  {isTerminal && (
                    <span className="bg-[#211F1F] px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.18em] text-white">
                      {language === 'bn' ? 'মাস্টার টার্মিনাল' : 'Master Terminal'}
                    </span>
                  )}
                  {stop.id === 'stop-9' && (
                    <span className="border border-[#C92232]/30 bg-[#FFF7F6] px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.16em] text-[#C92232]">
                      {language === 'bn' ? 'বাণিজ্যিক হাব' : 'Industrial Interchange'}
                    </span>
                  )}
                </div>

                {stopAddress && (
                  <p className="mt-0.5 text-[11px] leading-5 text-stone-500 sm:text-xs">
                    {stopAddress}
                  </p>
                )}

                {stop.boothAvailable && boothName && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold text-stone-500">
                    <span className="inline-flex items-center gap-1 text-stone-700">
                      <Building2 className="h-3 w-3 text-[#C92232]" />
                      {boothName}
                    </span>
                    {stop.phoneVerificationStatus === 'verified' ? (
                      <span className="inline-flex items-center gap-1 font-bold text-[#24775F]">
                        <CheckCircle2 className="h-3 w-3" />
                        {language === 'bn' ? 'যাচাইকৃত কাউন্টার' : 'Verified Counter'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-[#B7791F]">
                        <AlertCircle className="h-3 w-3" />
                        {language === 'bn' ? 'যাচাইাধীন' : 'Pending Verification'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
