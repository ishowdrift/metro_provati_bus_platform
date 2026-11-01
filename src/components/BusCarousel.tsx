'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Bus,
  Sparkles,
  ShieldCheck,
  Ticket,
  Navigation,
  Play,
  Pause,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface BusSlide {
  id: string;
  image: string;
  regBn: string;
  regEn: string;
  modelBn: string;
  modelEn: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  featuresBn: string[];
  featuresEn: string[];
}

const BUS_SLIDES: BusSlide[] = [
  {
    id: 'bus-1',
    image: '/images/bus-1.jpg',
    regBn: 'চট্ট মেট্রো ব ১১-০১৮৩',
    regEn: 'Chatto Metro-BA 11-0183',
    modelBn: 'অশোক লেল্যান্ড ভাইকিং প্রিমিয়াম এক্সপ্রেস',
    modelEn: 'Ashok Leyland Viking Premium Express',
    titleBn: 'মেট্রো প্রভাতী এক্সপ্রেস বহর — চট্টগ্রাম নগরী',
    titleEn: 'Metro Probati Express Fleet — Chattogram City',
    descBn:
      'কাপ্তাই রাস্তার মাথা টার্মিনাল থেকে বহদ্দারহাট, মুরাদপুর, জিইসি ও ইপিজেড হয়ে কাঠগড় পর্যন্ত নিরবচ্ছিন্ন আধুনিক গণপরিবহন।',
    descEn:
      'Seamless modern transit from Kaptai Rastar Matha Terminal to Katgor via Bahaddarhat, Muradpur, GEC, and EPZ.',
    featuresBn: ['৪১টি আরামদায়ক পুশব্যাক সিট', 'ডুয়েল গেট দ্রুত প্যাসেঞ্জার এন্ট্রি', 'অনলাইন সিট বুকিং'],
    featuresEn: ['41 Comfort Pushback Seats', 'Dual-Door Fast Entry/Exit', 'Online Seat Reservation'],
  },
  {
    id: 'bus-2',
    image: '/images/bus-2.jpg',
    regBn: 'চট্ট মেট্রো ব ১১-০১৮৪',
    regEn: 'Chatto Metro-BA 11-0184',
    modelBn: 'আলোকিত ফ্রন্টভিউ ও ডিজিটাল রুট ডিসপ্লে',
    modelEn: 'Illuminated Front Profile & Digital Route Board',
    titleBn: 'নিরাপদ, পরিচ্ছন্ন ও সুশৃঙ্খল যাত্রীযাত্রা',
    titleEn: 'Safe, Clean & Disciplined Commuting',
    descBn:
      'দক্ষ চালক ও প্রশিক্ষিত বাস সুপারভাইজার কর্তৃক পরিচালিত। যাত্রীদের নির্বিঘ্ন সেবা নিশ্চিতকরণে বিআরটিএ ও ট্রাফিক আইনসম্মত গতিসীমা নিয়ন্ত্রিত।',
    descEn:
      'Operated by verified drivers and certified supervisors with strict adherence to BRTA route protocols and commuter comfort.',
    featuresBn: ['লাইভ স্যাটেলাইট জিপিএস', 'কাউন্টার ভিত্তিক স্বচ্ছ ভাড়া', 'নিয়মিত পরিচ্ছন্নতা অডিট'],
    featuresEn: ['Live Satellite GPS', 'Fixed Transparent Fares', 'Daily Hygiene Audited'],
  },
  {
    id: 'bus-3',
    image: '/images/bus-3.jpg',
    regBn: 'চট্ট মেট্রো ব ১১-০১৮৫',
    regEn: 'Chatto Metro-BA 11-0185',
    modelBn: 'দৈনিক অবিরাম সময়সূচি (ভোর ৫:৪৫ - রাত ১০:৪৫)',
    modelEn: 'Daily Scheduled Operations (5:45 AM - 10:45 PM)',
    titleBn: 'কাঠগড় থেকে কাপ্তাই মাথা — স্মার্ট সংযোগ',
    titleEn: 'Katgor to Kaptai Matha — Smart Corridor',
    descBn:
      'যাত্রীদের দীর্ঘ অপেক্ষার অবসান। প্রতি ১০-১৫ মিনিট পর পর নির্দিষ্ট কাউন্টার থেকে পরবর্তী বাস যাত্রা শুরু করে।',
    descEn:
      'No more endless waiting. Scheduled departures every 10–15 minutes connecting 11 major city hub counters.',
    featuresBn: ['১০-১৫ মিনিট ফ্রিকোয়েন্সি', 'জরুরি হেল্পলাইন সেবা', 'কাউন্টার ও কিউআর টিকিট'],
    featuresEn: ['10–15 Min Frequency', 'Direct Helpline Support', 'Counter & QR Tickets'],
  },
];

export const BusCarousel: React.FC = () => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const total = BUS_SLIDES.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, total]);

  const current = BUS_SLIDES[currentIndex];

  return (
    <section className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-red-100 shadow-md bg-slate-950 text-white">
      {/* Top Header Bar with Fleet Identity */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3 bg-white border-b border-red-100 text-slate-900">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 sm:w-8 sm:h-8 rounded-md overflow-hidden bg-white p-0.5 ring-1 ring-red-200 shadow-xs flex-shrink-0">
            <Image
              src="/logo.png"
              alt="মেট্রো প্রভাতী"
              width={32}
              height={32}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight">
              মেট্রো প্রভাতী বহর
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
              ফটো
            </span>
          </div>
        </div>

        {/* Carousel Status and Pause/Play Toggle */}
        <div className="flex items-center gap-2">
          <div className="text-[11px] font-mono text-slate-500">
            <span className="text-red-600 font-bold">{currentIndex + 1}</span>/{total}
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            className="p-1 rounded bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Main Slide Stage - Compact mobile height */}
      <div className="relative h-[220px] sm:h-[320px] md:h-[380px] lg:h-[440px] flex items-end overflow-hidden group">
        {/* Background Bus Image */}
        {BUS_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.titleBn}
              fill
              priority={idx === 0}
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
              unoptimized
            />
            {/* Smooth dark gradient overlay for text readability without GPU-heavy filters */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          </div>
        ))}

        {/* Floating Content Card over the Bus Photo */}
        <div className="relative z-20 w-full p-3 sm:p-6 lg:p-8 space-y-1.5 sm:space-y-3 max-w-3xl">
          {/* Registration Plate & Model Pill */}
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-red-600 text-white text-[10px] sm:text-xs font-bold tracking-wide shadow-xs">
              <Bus className="w-3 h-3" />
              <span>{language === 'bn' ? current.regBn : current.regEn}</span>
            </div>

            <div className="hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-slate-200 text-[10px] sm:text-xs font-medium">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>{language === 'bn' ? current.modelBn : current.modelEn}</span>
            </div>
          </div>

          {/* Bus Slide Title */}
          <h2 className="text-sm sm:text-xl lg:text-2xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm line-clamp-1 sm:line-clamp-none">
            {language === 'bn' ? current.titleBn : current.titleEn}
          </h2>

          {/* Description */}
          <p className="text-[11px] sm:text-xs text-slate-300 leading-snug line-clamp-2 max-w-xl hidden xs:block">
            {language === 'bn' ? current.descBn : current.descEn}
          </p>

          {/* Feature Badges */}
          <div className="hidden sm:flex flex-wrap gap-1.5 pt-0.5">
            {(language === 'bn' ? current.featuresBn : current.featuresEn).map((feat, fIdx) => (
              <span
                key={fIdx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-[10px] text-slate-200"
              >
                <ShieldCheck className="w-2.5 h-2.5 text-red-400 flex-shrink-0" />
                <span>{feat}</span>
              </span>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 pt-1 sm:pt-2">
            <Link
              href="/tickets"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] sm:text-xs shadow-sm active:scale-95 transition"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'সিট বুক করুন' : 'Book Seat'}</span>
            </Link>

            <Link
              href="/tracking"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/95 hover:bg-white text-red-700 font-bold text-[11px] sm:text-xs border border-red-200 active:scale-95 transition shadow-xs"
            >
              <Navigation className="w-3 h-3 text-red-600" />
              <span>{language === 'bn' ? 'লাইভ জিপিএস' : 'Live GPS'}</span>
            </Link>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous bus photo"
          className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2 rounded-full bg-slate-900/80 text-white border border-slate-700 shadow-md transition active:scale-95 hover:bg-red-600"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next bus photo"
          className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2 rounded-full bg-slate-900/80 text-white border border-slate-700 shadow-md transition active:scale-95 hover:bg-red-600"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Carousel Dot Indicators */}
        <div className="absolute bottom-2.5 right-3 sm:right-6 z-30 flex items-center gap-1.5">
          {BUS_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-5 bg-red-500' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
