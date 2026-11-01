'use client';

import React from 'react';
import Link from 'next/link';
import { INITIAL_ROUTE, INITIAL_STOPS } from '@/data/mockData';
import { RouteCorridorTimeline } from '@/components/RouteCorridorTimeline';
import { useLanguage } from '@/context/LanguageContext';
import { Bus, MapPin, Clock, ArrowRight, ShieldCheck, Ticket } from 'lucide-react';
import { toBengaliDigits } from '@/lib/fareCalculator';

export default function RoutesPage() {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Route Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden border border-red-500">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30">
            <span>রুট কোড: {INITIAL_ROUTE.code}</span>
            <span>•</span>
            <span>{language === 'bn' ? 'সক্রিয় এক্সপ্রেস করিডোর' : 'Active Express Corridor'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {language === 'bn' ? INITIAL_ROUTE.nameBn : INITIAL_ROUTE.nameEn}
          </h1>

          <p className="text-sm sm:text-base text-red-50 leading-relaxed">
            {language === 'bn' ? INITIAL_ROUTE.descriptionBn : INITIAL_ROUTE.descriptionEn}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs sm:text-sm text-white">
            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <MapPin className="w-4 h-4 text-red-200" />
              <span>
                {language === 'bn'
                  ? `মোট দূরত্ব: প্রায় ${toBengaliDigits(INITIAL_ROUTE.approximateDistanceKm)} কিমি`
                  : `Distance: ~${INITIAL_ROUTE.approximateDistanceKm} km`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <Clock className="w-4 h-4 text-red-200" />
              <span>
                {language === 'bn'
                  ? `আনুমানিক সময়: ${toBengaliDigits(INITIAL_ROUTE.estimatedDurationMins)} মিনিট`
                  : `Est. Duration: ~${INITIAL_ROUTE.estimatedDurationMins} mins`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <Ticket className="w-4 h-4 text-red-200" />
              <span>
                {language === 'bn'
                  ? `ভাড়া পরিধি: ৳${toBengaliDigits(INITIAL_ROUTE.fareMinBDT)} — ৳${toBengaliDigits(INITIAL_ROUTE.fareMaxBDT)} (খসড়া)`
                  : `Fare: ৳${INITIAL_ROUTE.fareMinBDT} — ৳${INITIAL_ROUTE.fareMaxBDT} (Draft)`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Corridor Visual Sequence */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {language === 'bn' ? 'করিডোরের সকল স্টপ তালিকা' : 'Complete Stop Sequence'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'bn'
              ? 'কাপ্তাই রাস্তার মাথা থেকে কাঠগড় অভিমুখী ১২টি প্রধান স্টপেজ ও তাদের ভৌগোলিক বিবরণ।'
              : 'Detailed sequence of 12 stops from Kaptai Rastar Matha towards Katgor.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-sm">
          <RouteCorridorTimeline />
        </div>
      </div>

      {/* Action to book ticket on this route */}
      <div className="p-6 rounded-2xl bg-red-50 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-red-950 text-base">
            {language === 'bn' ? 'এই রুটে যাত্রা করবেন?' : 'Travelling on this route?'}
          </h4>
          <p className="text-xs text-red-800 mt-0.5">
            {language === 'bn'
              ? 'অনলাইনে অগ্রিম আসন নির্বাচন করুন অথবা লাইভ বাসের গতিবিধি দেখুন।'
              : 'Select your seats in advance or track the live bus on the map.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/tickets"
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            {language === 'bn' ? 'আসন বুকিং' : 'Book Seats'}
          </Link>
          <Link
            href="/tracking"
            className="px-4 py-2.5 bg-white hover:bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition"
          >
            {language === 'bn' ? 'লাইভ ট্র্যাকিং' : 'Live Tracking'}
          </Link>
        </div>
      </div>
    </div>
  );
}
