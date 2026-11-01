'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bus,
  Search,
  Navigation,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  Ticket,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_STOPS } from '@/data/mockData';
import { calculateFare, formatBDT, toBengaliDigits } from '@/lib/fareCalculator';

export const Hero: React.FC = () => {
  const { language, t } = useLanguage();
  const router = useRouter();

  const [fromStopId, setFromStopId] = useState('stop-1'); // Kaptai Rastar Matha
  const [toStopId, setToStopId] = useState('stop-10'); // Katgor Master Terminal
  const [passengers, setPassengers] = useState(1);

  const fareResult = calculateFare(fromStopId, toStopId);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/tickets?from=${fromStopId}&to=${toStopId}&passengers=${passengers}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-red-50/80 via-white to-slate-50 text-slate-900 pt-4 pb-8 sm:pt-10 sm:pb-16 border-b border-red-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>{t('hero.badge')}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-snug text-slate-900">
              {t('hero.title')}
            </h1>

            <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              {t('hero.subtitle')}
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
              <Link
                href="/tickets"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/20 active:scale-95 transition-all"
              >
                <Ticket className="w-4 h-4" />
                <span>{t('hero.cta.book')}</span>
              </Link>

              <Link
                href="/tracking"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-white hover:bg-red-50 text-red-700 font-bold text-xs sm:text-sm border-2 border-red-200 active:scale-95 transition-all shadow-xs"
              >
                <Navigation className="w-4 h-4 text-red-600" />
                <span>{t('hero.cta.track')}</span>
              </Link>

              <Link
                href="/fares"
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-white hover:bg-red-50 text-slate-700 hover:text-red-700 text-xs sm:text-sm font-semibold transition border border-slate-200"
              >
                <span>{t('hero.cta.fares')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Highlights Bar */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-red-100">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white border border-red-100 shadow-xs text-center sm:text-left">
                <div className="text-base sm:text-2xl font-extrabold text-red-600 font-mono">
                  {toBengaliDigits(4)}+
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500">{t('hero.stat.fleet')}</div>
              </div>
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white border border-red-100 shadow-xs text-center sm:text-left">
                <div className="text-base sm:text-2xl font-extrabold text-red-600 font-mono">
                  {toBengaliDigits(11)}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500">{t('hero.stat.stops')}</div>
              </div>
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white border border-red-100 shadow-xs text-center sm:text-left">
                <div className="text-base sm:text-2xl font-extrabold text-red-600 font-mono">
                  {toBengaliDigits(31)} কিমি
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500">{t('hero.stat.routeLength')}</div>
              </div>
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white border border-red-100 shadow-xs text-center sm:text-left">
                <div className="text-base sm:text-2xl font-extrabold text-red-600 font-mono">
                  ৳১০–৳৪৫
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500">{t('hero.stat.fareRange')}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Quick Route & Fare Search Widget */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 text-slate-900 border-2 border-red-100 relative">
              <div className="flex items-center justify-between pb-3 border-b border-red-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-red-50 text-red-600 rounded-lg">
                    <Search className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    {t('search.title')}
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                  {language === 'bn' ? 'সরাসরি সেবা' : 'Direct Line'}
                </span>
              </div>

              <form onSubmit={handleSearchSubmit} className="mt-4 space-y-3 sm:space-y-4">
                {/* Origin Stop */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    {t('search.from')}
                  </label>
                  <select
                    value={fromStopId}
                    onChange={(e) => setFromStopId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {INITIAL_STOPS.map((stop) => (
                      <option key={stop.id} value={stop.id}>
                        {stop.sequence}. {language === 'bn' ? stop.nameBn : stop.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Destination Stop */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    {t('search.to')}
                  </label>
                  <select
                    value={toStopId}
                    onChange={(e) => setToStopId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {INITIAL_STOPS.map((stop) => (
                      <option key={stop.id} value={stop.id}>
                        {stop.sequence}. {language === 'bn' ? stop.nameBn : stop.nameEn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Number of Passengers */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    {language === 'bn' ? 'যাত্রী সংখ্যা' : 'Passengers'}
                  </label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {toBengaliDigits(num)} {language === 'bn' ? 'জন যাত্রী' : 'passenger(s)'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Real-time Fare Preview Box */}
                {fareResult && (
                  <div className="p-3 rounded-xl bg-red-50/70 border border-red-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-slate-600 font-medium">
                        {language === 'bn' ? 'আনুমানিক ভাড়া (জনপ্রতি)' : 'Est. Fare / Person'}
                      </div>
                      <div className="font-bold text-slate-800">
                        {toBengaliDigits(fareResult.stagesCount)} {language === 'bn' ? 'টি স্টেজ' : 'stages'} (
                        {toBengaliDigits(fareResult.estimatedDistanceKm)} কিমি)
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-extrabold text-red-600 font-mono">
                        {formatBDT(fareResult.fareBDT * passengers)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm rounded-xl transition shadow-md shadow-red-600/20 flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4 text-white" />
                  <span>{t('search.bookNow')}</span>
                </button>
              </form>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                <span>{t('search.disclaimer')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
