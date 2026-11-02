'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  ArrowRightLeft,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_STOPS } from '@/data/mockData';
import { calculateFare, formatBDT, toBengaliDigits } from '@/lib/fareCalculator';

export const Hero: React.FC = () => {
  const { language, t } = useLanguage();
  const router = useRouter();

  const [fromStopId, setFromStopId] = useState('stop-1'); // Kaptai Rastar Matha
  const [toStopId, setToStopId] = useState('stop-10'); // Katgor Terminal
  const [passengers, setPassengers] = useState(1);
  const [routeError, setRouteError] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  const fareResult = calculateFare(fromStopId, toStopId);

  const handleSwapStops = () => {
    setIsSwapping(true);
    setFromStopId(toStopId);
    setToStopId(fromStopId);
    setRouteError('');
    setTimeout(() => setIsSwapping(false), 260);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromStopId === toStopId) {
      setRouteError(
        language === 'bn'
          ? 'যাত্রা শুরুর স্থান ও গন্তব্য আলাদা নির্বাচন করুন।'
          : 'Choose two different stops for your journey.'
      );
      return;
    }
    setRouteError('');
    router.push(`/tickets?from=${encodeURIComponent(fromStopId)}&to=${encodeURIComponent(toStopId)}&passengers=${passengers}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#C92232] via-[#C92232] to-[#A91D2A] text-white pt-6 pb-12 sm:pt-12 sm:pb-20 border-b-4 border-[#8B1621] shadow-xl">
      {/* Background Subtle Transit Geometry */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 L100,100 M20,0 L100,80 M0,20 L80,100" stroke="white" strokeWidth="0.5" fill="none" />
          <circle cx="85" cy="20" r="15" stroke="white" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      {/* Native Ambient Drift Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-36 -top-36 h-[520px] w-[520px] rounded-full bg-white/10 blur-[110px] animate-ambient-drift"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-36 right-1/4 h-[440px] w-[440px] rounded-full bg-black/25 blur-[100px] animate-ambient-drift"
        style={{ animationDelay: '-10s' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Cinematic Headline & Mission */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Transit Operational Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/25 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#49665A] bg-emerald-400 animate-pulse" />
              <span>{language === 'bn' ? 'চট্টগ্রাম আর্টেরিয়াল এক্সপ্রেস করিডোর' : 'Chattogram Arterial Transit Corridor'}</span>
            </div>

            {/* Compelling Clean Headline (NO ZIGZAG / WAVY UNDERLINE) */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
                {language === 'bn' ? (
                  <>
                    চট্টগ্রামের পথে, <br className="hidden sm:inline" />
                    <span className="text-red-100 font-extrabold">
                      যাত্রা হোক নিশ্চিন্ত।
                    </span>
                  </>
                ) : (
                  <>
                    Seamless Transit, <br className="hidden sm:inline" />
                    <span className="text-red-100 font-extrabold">
                      Every Mile in Chattogram.
                    </span>
                  </>
                )}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-red-50/90 leading-relaxed max-w-xl font-medium pt-1">
                {language === 'bn'
                  ? 'আপনার প্রতিদিনের যাত্রায় নির্ভরযোগ্য সঙ্গী — Metro Probati। কাপ্তাই রাস্তার মাথা থেকে কাঠগড় পর্যন্ত জিপিএস তথ্য ও ডিজিটাল কাউন্টার নেটওয়ার্ক।'
                  : 'Your dependable everyday commuting partner. Connecting Kaptai Rastar Matha to Katgor with live satellite telemetry and transparent fares.'}
              </p>
            </div>

            {/* Route Wayfinding Linear Strip */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-black/25 backdrop-blur-md border border-white/20 font-mono text-xs text-white/95">
              <span className="font-bold text-white">LINE MP-01</span>
              <span className="text-white/40">|</span>
              <span>{language === 'bn' ? 'কাপ্তাই মাথা' : 'Kaptai Matha'}</span>
              <span className="text-white/50">── 24.9 KM ──</span>
              <span>{language === 'bn' ? 'কাঠগড়' : 'Katgor'}</span>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/tickets"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-white hover:bg-red-50 active:scale-95 text-[#C92232] font-extrabold text-sm shadow-xl transition-all duration-150"
              >
                <Ticket className="w-4 h-4 text-[#C92232]" />
                <span>{language === 'bn' ? 'আসন বুক করুন' : 'Book a Ticket'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/tracking"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-[#A91D2A]/60 hover:bg-[#A91D2A] active:scale-95 border border-white/30 text-white font-bold text-sm backdrop-blur-sm transition-all duration-150"
              >
                <MapPin className="w-4 h-4 text-white" />
                <span>{language === 'bn' ? 'বাসের অবস্থান' : 'Bus Location'}</span>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-red-500/30 max-w-lg">
              <div className="flex items-center gap-2 text-xs font-semibold text-red-50">
                <Compass className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>{language === 'bn' ? 'জিপিএস অবস্থান' : 'GPS Telemetry'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-red-50">
                <MapPin className="w-4 h-4 text-amber-300 flex-shrink-0" />
                <span>{language === 'bn' ? '১২টি অনুমোদিত স্টপ' : '12 Listed Stops'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-red-50">
                <ShieldCheck className="w-4 h-4 text-sky-300 flex-shrink-0" />
                <span>{language === 'bn' ? '৫ মিনিটের নিশ্চিত হোল্ড' : '5-Min Atomic Hold'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Journey Planner Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/40 text-[#272524]">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#F2E4E2] text-[#C92232] flex items-center justify-center shadow-xs">
                    <Search className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                      {language === 'bn' ? 'দ্রুত টিকিট অনুসন্ধান ও ভাড়া' : 'Quick Fare & Booking'}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {language === 'bn' ? 'কাপ্তাই মাথা ↔ কাঠগড় এক্সপ্রেস করিডোর' : 'Kaptai Matha ↔ Katgor Corridor'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#EAF1EE] text-[#49665A]">
                  {language === 'bn' ? 'অনলাইন সেবা' : 'Direct Booking'}
                </span>
              </div>

              <form onSubmit={handleSearchSubmit} className="mt-5 space-y-4">
                {/* Origin Stop */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    {language === 'bn' ? 'যাত্রা শুরুর স্টপ (Origin)' : 'Origin Stop'}
                  </label>
                  <div className="relative">
                    <select
                      value={fromStopId}
                      onChange={(e) => {
                        setFromStopId(e.target.value);
                        setRouteError('');
                      }}
                      className="w-full px-4 py-3 bg-[#F1EEE8] border border-[#E5E0D8] rounded-xl text-xs sm:text-sm font-bold text-[#272524] focus:outline-none focus:ring-2 focus:ring-[#C92232] focus:border-[#C92232] transition"
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

                {/* Swap Origin / Destination */}
                <div className="flex justify-center -my-2 relative z-10">
                  <button
                    type="button"
                    onClick={handleSwapStops}
                    aria-label={language === 'bn' ? 'শুরু ও গন্তব্য অদলবদল করুন' : 'Swap origin and destination'}
                    className="p-2 rounded-full bg-white border border-[#E5E0D8] text-[#C92232] hover:bg-[#F2E4E2] transition shadow-xs active:scale-90"
                  >
                    <ArrowRightLeft className={`w-3.5 h-3.5 transition-transform duration-300 ${isSwapping ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Destination Stop */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    {language === 'bn' ? 'গন্তব্য স্টপ (Destination)' : 'Destination Stop'}
                  </label>
                  <div className="relative">
                    <select
                      value={toStopId}
                      onChange={(e) => {
                        setToStopId(e.target.value);
                        setRouteError('');
                      }}
                      className="w-full px-4 py-3 bg-[#F1EEE8] border border-[#E5E0D8] rounded-xl text-xs sm:text-sm font-bold text-[#272524] focus:outline-none focus:ring-2 focus:ring-[#C92232] focus:border-[#C92232] transition"
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

                {/* Passenger Count */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    {language === 'bn' ? 'যাত্রী সংখ্যা' : 'Number of Passengers'}
                  </label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#F1EEE8] border border-[#E5E0D8] rounded-xl text-xs sm:text-sm font-bold text-[#272524] focus:outline-none focus:ring-2 focus:ring-[#C92232] transition"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {toBengaliDigits(num)} {language === 'bn' ? 'জন যাত্রী' : 'passenger(s)'}
                      </option>
                    ))}
                  </select>
                </div>

                {routeError && (
                  <p role="alert" className="text-xs font-semibold text-[#A91D2A] bg-red-50 p-2 rounded-lg border border-red-200">
                    {routeError}
                  </p>
                )}

                {/* Real-time Fare Preview Box */}
                {fareResult && fromStopId !== toStopId && (
                  <div className="p-3.5 rounded-2xl bg-[#FFF5F5] border border-[#F2E4E2] flex items-center justify-between text-xs">
                    <div>
                      <div className="text-slate-600 font-semibold">
                        {toBengaliDigits(fareResult.stagesCount)}টি স্টেজ • প্রায়{' '}
                        {toBengaliDigits(fareResult.estimatedDistanceKm)} কিমি
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {language === 'bn' ? 'জনপ্রতি নির্দেশক ভাড়া' : 'Fare / Passenger'}: {formatBDT(fareResult.fareBDT)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-black text-[#C92232] font-mono">
                        {formatBDT(fareResult.fareBDT * passengers)}
                      </div>
                      <span className="text-[9px] text-[#A91D2A] font-bold uppercase tracking-wider">
                        {language === 'bn' ? 'মোট নির্দেশক ভাড়া' : 'Total Fare'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#C92232] hover:bg-[#A91D2A] active:scale-95 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-[#C92232]/30 flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4 text-white" />
                  <span>{language === 'bn' ? 'আসন নির্বাচন ও বুকিং' : 'Search & Select Seats'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Disclaimer */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C92232] flex-shrink-0" />
                <span>
                  {language === 'bn'
                    ? 'আসন নির্বাচনের পর ৫ মিনিটের জন্য স্বয়ংক্রিয় হোল্ড কার্যকর হয়।'
                    : '5-minute atomic reservation hold prevents double-booking.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
