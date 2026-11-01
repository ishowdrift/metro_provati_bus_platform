'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const FLEET_PHOTOS = [
  {
    id: 'fleet-01',
    image: '/images/bus-1.jpg',
    titleBn: 'মেট্রো প্রভাতী কমিউটার কোচ',
    titleEn: 'Metro Probati Commuter Coach',
    captionBn: 'চট্টগ্রামের প্রধান রুটে প্রতিদিনের নিয়মিত যাত্রীসেবায় নিয়োজিত বহর।',
    captionEn: 'Serving daily commuters along Chattogram’s primary east-west arterial corridor.',
    spec: 'CHATTA-METRO-B / COMMUTER 40-SEAT',
  },
  {
    id: 'fleet-02',
    image: '/images/bus-2.jpg',
    titleBn: 'নগর পরিবহন আর্টেরিয়াল ইউনিট',
    titleEn: 'Urban Arterial Unit',
    captionBn: 'কাপ্তাই রাস্তার মাথা থেকে বহদ্দারহাট, জিইসি ও আগ্রাবাদ হয়ে কাঠগড় পর্যন্ত সংযোগ।',
    captionEn: 'Connecting Kaptai Rastar Matha, Bahaddarhat, GEC, and Agrabad onward to Katgor.',
    spec: 'DUAL-DOOR PASSENGER TRANSIT',
  },
  {
    id: 'fleet-03',
    image: '/images/bus-3.jpg',
    titleBn: 'করিডোর প্যাসেঞ্জার ক্যারিয়ার',
    titleEn: 'Corridor Passenger Carrier',
    captionBn: 'যাত্রীদের সুবিধার জন্য নির্ধারিত স্টপ ও নিয়মতান্ত্রিক বোর্ডিং ব্যবস্থা।',
    captionEn: 'Systematic boarding and designated stop alignment for high-density commuter flow.',
    spec: 'SCHEDULED CORRIDOR DEPLOYMENT',
  },
];

export const BusCarousel: React.FC = () => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = FLEET_PHOTOS[currentIndex];
  const total = FLEET_PHOTOS.length;

  const showPrevious = () => setCurrentIndex((index) => (index - 1 + total) % total);
  const showNext = () => setCurrentIndex((index) => (index + 1) % total);

  return (
    <div className="border-t border-stone-300 pt-8">
      {/* Editorial Header & Minimalist Controls */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#C92232]">
            EXHIBIT {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
          <h3 className="mt-1 text-2xl font-black tracking-tight text-stone-950 sm:text-3xl">
            {language === 'bn' ? current.titleBn : current.titleEn}
          </h3>
          <p className="mt-1 text-xs text-stone-500 sm:text-sm">
            {language === 'bn' ? current.captionBn : current.captionEn}
          </p>
        </div>

        {/* Swiss Architectural Navigation Controls */}
        <div className="flex items-center gap-3 self-start sm:self-end">
          <div className="flex items-center gap-1 font-mono text-xs font-bold text-stone-400">
            <span className="text-stone-900">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span>/</span>
            <span>{String(total).padStart(2, '0')}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={showPrevious}
              aria-label={language === 'bn' ? 'পূর্ববর্তী বহরের ছবি' : 'Previous fleet photograph'}
              className="flex h-11 w-11 items-center justify-center border border-stone-300 bg-white text-stone-700 transition hover:border-[#C92232] hover:bg-[#C92232] hover:text-white active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C92232]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label={language === 'bn' ? 'পরবর্তী বহরের ছবি' : 'Next fleet photograph'}
              className="flex h-11 w-11 items-center justify-center border border-stone-300 bg-white text-stone-700 transition hover:border-[#C92232] hover:bg-[#C92232] hover:text-white active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C92232]"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Dramatic Wide Architectural Photographic Spread */}
      <div className="relative aspect-[16/9] max-h-[560px] w-full overflow-hidden bg-stone-950 sm:aspect-[21/9]">
        <Image
          key={current.id}
          src={current.image}
          alt={language === 'bn' ? current.titleBn : current.titleEn}
          fill
          priority={currentIndex === 0}
          sizes="(max-width: 1240px) 100vw, 1240px"
          className="object-cover object-center transition-all duration-700 ease-out hover:scale-[1.02]"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Corner Wayfinding Badge */}
        <div className="absolute left-4 top-4 flex items-center gap-2 bg-[#211F1F]/90 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm sm:left-6 sm:top-6 sm:text-[10px]">
          <span className="h-1.5 w-1.5 bg-[#C92232]" />
          <span>LINE MP-01</span>
          <span className="text-white/40">•</span>
          <span className="text-white/70">{current.spec}</span>
        </div>

        {/* Bottom Editorial Caption */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3 text-white sm:bottom-6 sm:left-6 sm:right-6">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-[#F18A91]">
              {language === 'bn' ? 'বহর পরিচিতি' : 'Fleet Profile'}
            </div>
            <div className="mt-1 text-sm font-extrabold sm:text-lg">
              {language === 'bn' ? 'কাপ্তাই রাস্তার মাথা — কাঠগড় করিডোর' : 'Kaptai Rastar Matha — Katgor Corridor'}
            </div>
          </div>
          <Link
            href="/routes"
            className="inline-flex items-center gap-1.5 border-b border-white/60 pb-1 text-xs font-bold text-white transition-colors hover:border-white"
          >
            <span>{language === 'bn' ? 'রুট করিডোর দেখুন' : 'Explore route corridor'}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Transit Technical Specification Ledger Bar */}
      <div className="grid grid-cols-2 gap-4 border-b border-stone-300 py-4 font-mono text-[10px] uppercase text-stone-500 sm:grid-cols-4 sm:text-[11px]">
        <div>
          <span className="block text-[9px] text-stone-400">CORRIDOR</span>
          <span className="font-bold text-stone-800">KAPTAI ⇄ KATGOR</span>
        </div>
        <div>
          <span className="block text-[9px] text-stone-400">STOPS SERVED</span>
          <span className="font-bold text-stone-800">12 KEY STATIONS</span>
        </div>
        <div>
          <span className="block text-[9px] text-stone-400">DISTANCE</span>
          <span className="font-bold text-stone-800">24.9 KM ARTERIAL</span>
        </div>
        <div>
          <span className="block text-[9px] text-stone-400">OPERATOR</span>
          <span className="font-bold text-stone-800">METRO PROBATI LTD</span>
        </div>
      </div>
    </div>
  );
};
