'use client';

import React from 'react';
import Link from 'next/link';
import { INITIAL_ROUTE, INITIAL_STOPS } from '@/data/mockData';
import { RouteCorridorTimeline } from '@/components/RouteCorridorTimeline';
import { useLanguage } from '@/context/LanguageContext';
import {
  Bus,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Ticket,
  Building2,
  Navigation,
  Compass,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { toBengaliDigits, formatBDT } from '@/lib/fareCalculator';

export default function RoutesPage() {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Route Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden border border-red-500">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>রুট কোড: {INITIAL_ROUTE.code}</span>
            <span>•</span>
            <span>{language === 'bn' ? 'সক্রিয় এক্সপ্রেস করিডোর' : 'Active Express Corridor'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            {language === 'bn' ? INITIAL_ROUTE.nameBn : INITIAL_ROUTE.nameEn}
          </h1>

          <p className="text-xs sm:text-base text-red-50 leading-relaxed font-medium">
            {language === 'bn' ? INITIAL_ROUTE.descriptionBn : INITIAL_ROUTE.descriptionEn}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm text-white">
            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/20">
              <MapPin className="w-4 h-4 text-red-200" />
              <span>
                {language === 'bn'
                  ? `মোট দূরত্ব: প্রায় ${toBengaliDigits(INITIAL_ROUTE.approximateDistanceKm)} কিমি`
                  : `Distance: ~${INITIAL_ROUTE.approximateDistanceKm} km`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/20">
              <Clock className="w-4 h-4 text-red-200" />
              <span>
                {language === 'bn'
                  ? `আনুমানিক সময়: ${toBengaliDigits(INITIAL_ROUTE.estimatedDurationMins)} মিনিট`
                  : `Est. Duration: ~${INITIAL_ROUTE.estimatedDurationMins} mins`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/20">
              <Ticket className="w-4 h-4 text-red-200" />
              <span>
                {language === 'bn'
                  ? `ভাড়া পরিধি: ৳${toBengaliDigits(INITIAL_ROUTE.fareMinBDT)} — ৳${toBengaliDigits(INITIAL_ROUTE.fareMaxBDT)} (অনুমোদিত খসড়া)`
                  : `Fare: ৳${INITIAL_ROUTE.fareMinBDT} — ৳${INITIAL_ROUTE.fareMaxBDT} (Draft)`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Corridor Visual Sequence Timeline */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {language === 'bn' ? 'করিডোরের সকল ১২টি অনুমোদিত স্টপেজ' : 'All 12 Verified Corridor Stops'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {language === 'bn'
                ? 'কাপ্তাই রাস্তার মাথা থেকে কাঠগড় অভিমুখী প্রধান স্টপসমূহ ও তাদের ভৌগোলিক ক্রম।'
                : 'Ordered sequence of 12 stops from Kaptai Rastar Matha towards Katgor terminal.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/fares"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold border border-red-200 transition"
            >
              <span>ভাড়া তালিকা দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-sm">
          <RouteCorridorTimeline />
        </div>
      </div>

      {/* Detailed Stop Cards Grid */}
      <div className="space-y-6">
        <h3 className="text-lg sm:text-xl font-black text-slate-900">
          {language === 'bn' ? 'স্টপ ও কাউন্টার পরিচিতি' : 'Stop & Counter Profiles'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {INITIAL_STOPS.map((stop) => (
            <div
              key={stop.id}
              className="bg-white rounded-3xl p-5 border border-red-100 shadow-xs hover:shadow-md hover:border-red-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-red-50 border border-red-200 text-red-700 font-extrabold text-xs flex items-center justify-center font-mono">
                    {toBengaliDigits(stop.sequence)}
                  </span>
                  {stop.isTerminal ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                      {language === 'bn' ? 'মাস্টার টার্মিনাল' : 'Master Terminal'}
                    </span>
                  ) : stop.boothAvailable ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {language === 'bn' ? 'কাউন্টার সক্রিয়' : 'Counter Available'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {language === 'bn' ? 'বাস স্টপ' : 'Bus Stop'}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">
                    {language === 'bn' ? stop.nameBn : stop.nameEn}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {language === 'bn' ? stop.addressBn : stop.addressEn}
                  </p>
                </div>

                {stop.boothNameBn && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                    <span className="truncate">{language === 'bn' ? stop.boothNameBn : stop.boothNameEn}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-red-600">
                <Link
                  href={`/tickets?from=${stop.id}`}
                  className="hover:underline flex items-center gap-1"
                >
                  <span>{language === 'bn' ? 'এখান থেকে সিট বুক করুন' : 'Book From Here'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-red-50 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <h4 className="font-black text-red-950 text-lg">
            {language === 'bn' ? 'এই করিডোরে নিশ্চিন্তে ভ্রমণ করুন' : 'Travel Along This Corridor'}
          </h4>
          <p className="text-xs sm:text-sm text-red-800 font-medium max-w-xl">
            {language === 'bn'
              ? 'অনলাইনে অগ্রিম আসন নির্বাচন করুন অথবা সরাসরি স্যাটেলাইট জিপিএসে বাসের বর্তমান অবস্থান পর্যবেক্ষণ করুন।'
              : 'Reserve your seats in advance or track active vehicles with real satellite telemetry.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/tickets"
            className="px-5 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-extrabold transition shadow-md shadow-red-600/20 flex items-center gap-2"
          >
            <Ticket className="w-4 h-4" />
            <span>{language === 'bn' ? 'আসন বুকিং' : 'Book Seats'}</span>
          </Link>

          <Link
            href="/tracking"
            className="px-5 py-3 bg-white hover:bg-red-100 text-red-700 border-2 border-red-200 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2"
          >
            <Navigation className="w-4 h-4 text-red-600" />
            <span>{language === 'bn' ? 'বাস ট্র্যাকিং' : 'Live Tracking'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
