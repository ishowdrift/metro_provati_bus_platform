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

  const handleSwapStops = () => {
    const temp = fromStopId;
    setFromStopId(toStopId);
    setToStopId(temp);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/tickets?from=${fromStopId}&to=${toStopId}&passengers=${passengers}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-red-600 via-red-600 to-red-700 text-white pt-6 pb-12 sm:pt-12 sm:pb-20 border-b-4 border-red-800 shadow-xl">
      {/* Background Subtle Transit Geometry */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 L100,100 M20,0 L100,80 M0,20 L80,100" stroke="white" strokeWidth="0.5" fill="none" />
          <circle cx="85" cy="20" r="15" stroke="white" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Cinematic Headline & Mission */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Transit Operational Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/25 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{language === 'bn' ? 'চট্টগ্রামের আধুনিক এক্সপ্রেস করিডোর' : 'Chattogram Express Transit Corridor'}</span>
            </div>

            {/* Compelling Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
                {language === 'bn' ? (
                  <>
                    চট্টগ্রামের পথে, <br className="hidden sm:inline" />
                    <span className="text-red-100 underline decoration-white/40 decoration-wavy underline-offset-8">
                      যাত্রা হোক নিশ্চিন্ত।
                    </span>
                  </>
                ) : (
                  <>
                    Seamless Transit, <br className="hidden sm:inline" />
                    <span className="text-red-100 underline decoration-white/40 underline-offset-8">
                      Every Mile in Chattogram.
                    </span>
                  </>
                )}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-red-50/90 leading-relaxed max-w-xl font-medium pt-1">
                {language === 'bn'
                  ? 'আপনার প্রতিদিনের যাত্রায় নির্ভরযোগ্য সঙ্গী — Metro Probati। কাপ্তাই রাস্তার মাথা থেকে কাঠগড় পর্যন্ত লাইভ জিপিএস ও ডিজিটাল কাউন্টার নেটওয়ার্ক।'
                  : 'Your dependable everyday commuting partner. Connecting Kaptai Rastar Matha to Katgor with live satellite telemetry and transparent fares.'}
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/tickets"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-white hover:bg-red-50 active:scale-95 text-red-600 font-extrabold text-sm shadow-xl transition-all duration-150"
              >
                <Ticket className="w-4 h-4 text-red-600" />
                <span>{language === 'bn' ? 'আসন বুক করুন' : 'Book a Ticket'}</span>
              </Link>

              <Link
                href="/tracking"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-red-800/80 hover:bg-red-800 active:scale-95 text-white font-extrabold text-sm border border-white/20 transition-all duration-150 shadow-md backdrop-blur-sm"
              >
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>{language === 'bn' ? 'লাইভ বাস ট্র্যাক' : 'Track Your Bus'}</span>
              </Link>

              <Link
                href="/routes"
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition backdrop-blur-sm"
              >
                <span>{language === 'bn' ? 'রুট দেখুন' : 'Explore Routes'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Authoritative Transit Corridor Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/20">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                <div className="text-xl sm:text-2xl font-black text-white font-mono">
                  {toBengaliDigits(12)}টি
                </div>
                <div className="text-[11px] text-red-100 font-medium">
                  {language === 'bn' ? 'অনুমোদিত স্টপ' : 'Corridor Stops'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                <div className="text-xl sm:text-2xl font-black text-white font-mono">
                  {toBengaliDigits(24.9)} কিমি
                </div>
                <div className="text-[11px] text-red-100 font-medium">
                  {language === 'bn' ? 'এক্সপ্রেস করিডোর' : 'Route Length'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                <div className="text-xl sm:text-2xl font-black text-white font-mono">
                  ৳১৫–৳৬৫
                </div>
                <div className="text-[11px] text-red-100 font-medium">
                  {language === 'bn' ? 'অনুমোদিত খসড়া ভাড়া' : 'Draft Fare Range'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>১০০%</span>
                </div>
                <div className="text-[11px] text-red-100 font-medium">
                  {language === 'bn' ? 'বাস্তব জিপিএস' : 'Genuine GPS'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Journey Planner Booking Widget */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-7 text-slate-900 border-2 border-white/80 relative">
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                      {language === 'bn' ? 'যাত্রা পরিকল্পনা ও বুকিং' : 'Journey Planner'}
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      {language === 'bn' ? 'স্টপেজ নির্বাচন করে ভাড়া ও আসন জানুন' : 'Select origin & destination'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                  {language === 'bn' ? 'সরাসরি লাইন' : 'Express'}
                </span>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleSearchSubmit} className="mt-4 space-y-3.5">
                {/* Origin Stop */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    {language === 'bn' ? 'যাত্রা শুরুর স্টপ (Origin)' : 'Boarding From'}
                  </label>
                  <div className="relative">
                    <select
                      value={fromStopId}
                      onChange={(e) => setFromStopId(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
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

                {/* Swap Stops Button */}
                <div className="flex justify-center -my-1.5">
                  <button
                    type="button"
                    onClick={handleSwapStops}
                    title={language === 'bn' ? 'প্রারম্ভিক ও গন্তব্য পরিবর্তন করুন' : 'Swap origin & destination'}
                    className="p-2 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 transition shadow-xs active:scale-90"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
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
                      onChange={(e) => setToStopId(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
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
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {toBengaliDigits(num)} {language === 'bn' ? 'জন যাত্রী' : 'passenger(s)'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Real-time Fare Preview Box */}
                {fareResult && (
                  <div className="p-3.5 rounded-2xl bg-red-50/80 border border-red-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-slate-600 font-semibold">
                        {toBengaliDigits(fareResult.stagesCount)}টি স্টেজ • প্রায়{' '}
                        {toBengaliDigits(fareResult.estimatedDistanceKm)} কিমি
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {language === 'bn' ? 'জনপ্রতি আনুমানিক ভাড়া' : 'Fare / Passenger'}: {formatBDT(fareResult.fareBDT)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-black text-red-600 font-mono">
                        {formatBDT(fareResult.fareBDT * passengers)}
                      </div>
                      <span className="text-[9px] text-red-700 font-bold uppercase">মোট ভাড়া</span>
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4 text-white" />
                  <span>{language === 'bn' ? 'যাত্রা অনুসন্ধান ও আসন বুকিং' : 'Search & Book Seats'}</span>
                </button>
              </form>

              {/* Disclaimer */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                <span>
                  {language === 'bn'
                    ? 'আসন নির্বাচনের পর ৫ মিনিটের জন্য স্বয়ংক্রিয় লক কার্যকর হয়।'
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
