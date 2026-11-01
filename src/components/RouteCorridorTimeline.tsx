'use client';

import React from 'react';
import { RouteStop } from '@/types';
import { INITIAL_STOPS } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin, Phone, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
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
    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-[11px] sm:before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-red-600 before:via-red-500 before:to-red-700">
      {stops.map((stop, idx) => {
        const isSelected = selectedStopId === stop.id;
        const isTerminal = stop.isTerminal;

        return (
          <div
            key={stop.id}
            onClick={() => onSelectStop && onSelectStop(stop)}
            className={`relative group cursor-pointer transition-all ${
              onSelectStop ? 'hover:translate-x-1' : ''
            }`}
          >
            {/* Timeline Node Point */}
            <div
              className={`absolute -left-[30px] sm:-left-[35px] top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                isTerminal
                  ? 'bg-red-700 text-white ring-4 ring-red-100 shadow-md scale-110'
                  : isSelected
                  ? 'bg-red-600 text-white ring-4 ring-red-100 shadow-md'
                  : 'bg-white border-2 border-red-500 text-red-700 group-hover:bg-red-50'
              }`}
            >
              {toBengaliDigits(stop.sequence)}
            </div>

            {/* Stop Content Box */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-red-50/70 border-red-300 shadow-sm'
                  : 'bg-white border-slate-200/90 hover:border-red-200 hover:shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-base">
                    {language === 'bn' ? stop.nameBn : stop.nameEn}
                  </h4>
                  {isTerminal && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded uppercase">
                      {language === 'bn' ? 'মাস্টার টার্মিনাল' : 'Terminal'}
                    </span>
                  )}
                  {stop.boothAvailable && (
                    <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold rounded">
                      {language === 'bn' ? 'কাউন্টার যুক্ত' : 'Booth'}
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  {stop.lat.toFixed(4)}°N, {stop.lng.toFixed(4)}°E
                </div>
              </div>

              {/* Address / Location details */}
              <p className="mt-1 text-xs text-slate-500">
                {language === 'bn' ? stop.addressBn : stop.addressEn}
              </p>

              {/* Counter Booth info if present */}
              {stop.boothAvailable && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-red-600" />
                    <span className="font-semibold">
                      {language === 'bn' ? stop.boothNameBn : stop.boothNameEn}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                    {stop.phoneVerificationStatus === 'verified' ? (
                      <span className="flex items-center gap-1 text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-red-600" />
                        {language === 'bn' ? 'যাচাইকৃত হেল্পলাইন' : 'Verified Line'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        <AlertCircle className="w-3 h-3" />
                        {language === 'bn' ? 'অফিসিয়াল যোগাযোগ সংযুক্তাধীন' : 'Pending Line Verification'}
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
  );
};
