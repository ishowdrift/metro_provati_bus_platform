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
  ArrowRight,
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
    featuresBn: ['সরাসরি স্যাটেলাইট জিপিএস', 'কাউন্টার ভিত্তিক স্বচ্ছ ভাড়া', 'নিয়মিত পরিচ্ছন্নতা অডিট'],
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
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, total]);

  const current = BUS_SLIDES[currentIndex];

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-[#E5E0D8] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left Column: Authentic Bus Photograph */}
        <div className="relative min-h-[320px] sm:min-h-[420px] lg:col-span-7 bg-[#272524] overflow-hidden group">
          <Image
            src={current.image}
            alt={language === 'bn' ? current.titleBn : current.titleEn}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            priority={currentIndex === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Registration Plate Pill */}
          <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#272524] font-mono text-xs font-black shadow-md border border-white/40">
            {language === 'bn' ? current.regBn : current.regEn}
          </div>

          {/* Slide Indicator Bar */}
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {BUS_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'w-8 bg-[#C92232]' : 'w-2 bg-white/60 hover:bg-white'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Vehicle & Fleet Specifications */}
        <div className="p-6 sm:p-8 lg:p-10 lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2E4E2] text-[#C92232] text-xs font-black uppercase tracking-wider">
              <Bus className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? current.modelBn : current.modelEn}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#272524] leading-tight">
              {language === 'bn' ? current.titleBn : current.titleEn}
            </h3>

            <p className="text-sm text-slate-500 leading-relaxed">
              {language === 'bn' ? current.descBn : current.descEn}
            </p>

            {/* Feature Checklist */}
            <div className="space-y-2 pt-2">
              {(language === 'bn' ? current.featuresBn : current.featuresEn).map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#272524]">
                  <span className="w-5 h-5 rounded-full bg-[#EAF1EE] text-[#49665A] flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
            <Link
              href="/tickets"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C92232] hover:bg-[#A91D2A] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#C92232]/20 active:scale-95 transition-all"
            >
              <Ticket className="w-4 h-4" />
              <span>{language === 'bn' ? 'এই বাসে টিকিট বুক করুন' : 'Book on this Bus'}</span>
            </Link>
            <Link
              href="/routes"
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#F1EEE8] hover:bg-[#E5E0D8] text-[#272524] font-bold text-xs sm:text-sm transition-all"
            >
              <span>{language === 'bn' ? 'করিডোর রুট দেখুন' : 'View Corridor'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
