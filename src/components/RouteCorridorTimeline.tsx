'use client';

import React from 'react';
import { RouteStop } from '@/types';
import { INITIAL_STOPS } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';
import { Building2, CheckCircle2, MapPin, Compass } from 'lucide-react';
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
      {/* Top Schematic Track Ribbon */}
      {showSchematic && (
        <div className="bg-white rounded-3xl p-5 border border-[#E5E0D8] shadow-sm">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 text-xs font-black uppercase tracking-wider text-slate-500">
            <span className="flex items-center gap-2 text-[#C92232]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C92232] animate-pulse" />
              {language === 'bn' ? 'করিডোর স্কিম্যাটিক ম্যাপ' : 'Corridor Schematic Map'}
            </span>
            <span className="font-mono text-[#272524] bg-[#F1EEE8] px-2.5 py-1 rounded-full text-[11px] font-bold">
              LINE MP-01 · 24.9 KM
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-1 overflow-x-auto pb-2 pt-1 no-scrollbar">
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
                  className="group relative flex flex-col items-center px-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C92232]"
                >
                  {/* Station Node */}
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`flex items-center justify-center font-mono text-[10px] font-black rounded-full transition-all duration-200 ${
                        isTerminal
                          ? 'h-7 w-7 bg-[#C92232] text-white ring-4 ring-[#F2E4E2] shadow-sm'
                          : isSelected
                          ? 'h-7 w-7 bg-[#272524] text-white ring-4 ring-slate-200 shadow-sm'
                          : isHub
                          ? 'h-6 w-6 border-2 border-[#C92232] bg-white text-[#C92232] group-hover:bg-[#C92232] group-hover:text-white'
                          : 'h-5 w-5 border border-slate-300 bg-white text-slate-600 group-hover:border-[#C92232] group-hover:text-[#C92232]'
                      }`}
                    >
                      {isTerminal ? 'T' : toBengaliDigits(stop.sequence)}
                    </span>
                  </div>

                  {/* Station Name */}
                  <span
                    className={`mt-2 max-w-[64px] truncate text-center text-[10px] font-bold transition-colors ${
                      isSelected
                        ? 'text-[#C92232]'
                        : isTerminal || isHub
                        ? 'text-slate-900'
                        : 'text-slate-500 group-hover:text-slate-900'
                    }`}
                  >
                    {language === 'bn' ? stop.nameBn : stop.nameEn}
                  </span>

                  {/* Connecting Track Line */}
                  {i < stops.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-[calc(50%+14px)] top-[13px] h-0.5 w-[calc(100%-14px)] bg-[#E5E0D8]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Vertical Station Timeline Cards */}
      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-[11px] sm:before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#C92232] before:via-[#A91D2A] before:to-[#8B1621]">
        {stops.map((stop) => {
          const isSelected = selectedStopId === stop.id;
          const isTerminal = stop.isTerminal;

          return (
            <div
              key={stop.id}
              onClick={() => onSelectStop && onSelectStop(stop)}
              className={`relative group cursor-pointer transition-all duration-200 ${
                onSelectStop ? 'hover:translate-x-1' : ''
              }`}
            >
              {/* Timeline Node Point */}
              <div
                className={`absolute -left-[30px] sm:-left-[35px] top-3 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isTerminal
                    ? 'bg-[#C92232] text-white ring-4 ring-[#F2E4E2] shadow-md scale-110'
                    : isSelected
                    ? 'bg-[#272524] text-white ring-4 ring-slate-200 shadow-md'
                    : 'bg-white border-2 border-[#C92232] text-[#C92232] group-hover:bg-[#F2E4E2]'
                }`}
              >
                {toBengaliDigits(stop.sequence)}
              </div>

              {/* Stop Content Card */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-red-50/70 border-[#C92232] shadow-md'
                    : 'bg-white border-[#E5E0D8] hover:border-[#C92232]/50 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-[#272524] text-base">
                      {language === 'bn' ? stop.nameBn : stop.nameEn}
                    </h4>
                    {isTerminal && (
                      <span className="px-2 py-0.5 bg-[#F2E4E2] text-[#C92232] text-[10px] font-extrabold rounded-full uppercase">
                        {language === 'bn' ? 'মাস্টার টার্মিনাল' : 'Terminal'}
                      </span>
                    )}
                    {stop.boothAvailable && (
                      <span className="px-2 py-0.5 bg-[#EAF1EE] text-[#49665A] border border-[#49665A]/20 text-[10px] font-bold rounded-full">
                        {language === 'bn' ? 'কাউন্টার যুক্ত' : 'Booth'}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-400 font-mono">
                    {stop.lat.toFixed(4)}°N, {stop.lng.toFixed(4)}°E
                  </div>
                </div>

                {/* Address / Location Details */}
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {language === 'bn' ? stop.addressBn : stop.addressEn}
                </p>

                {/* Counter Booth info if present */}
                {stop.boothAvailable && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-[#272524]">
                      <Building2 className="w-3.5 h-3.5 text-[#C92232]" />
                      <span className="font-semibold">
                        {language === 'bn' ? stop.boothNameBn : stop.boothNameEn}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                      {stop.phoneVerificationStatus === 'verified' ? (
                        <span className="flex items-center gap-1 text-[#49665A] bg-[#EAF1EE] border border-[#49665A]/20 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-[#49665A]" />
                          {language === 'bn' ? 'যাচাইকৃত হেল্পলাইন' : 'Verified Line'}
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          {language === 'bn' ? 'কাউন্টার পয়েন্ট' : 'Booth Station'}
                        </span>
                      )}
                    </div>
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
