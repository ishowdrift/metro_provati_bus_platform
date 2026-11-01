'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Hero } from '@/components/Hero';
import { BusCarousel } from '@/components/BusCarousel';
import { FareCalculatorCard } from '@/components/FareCalculatorCard';
import { RouteCorridorTimeline } from '@/components/RouteCorridorTimeline';
import { useLanguage } from '@/context/LanguageContext';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Clock3,
  CreditCard,
  HelpCircle,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Ticket,
  UserRound,
} from 'lucide-react';
import { INITIAL_HELPLINE } from '@/data/mockData';

export default function HomePage() {
  const { language } = useLanguage();

  const services = [
    {
      code: '01 / TKT',
      number: '01',
      icon: Ticket,
      titleBn: 'অনলাইন টিকিট ও আসন নির্বাচন',
      titleEn: 'Digital Ticketing & Seat Selection',
      descBn: 'আসন বিন্যাস সরাসরি দেখে পছন্দের সিট নির্বাচন ও বুকিং প্রক্রিয়া সম্পন্ন করুন।',
      descEn: 'Inspect the 2+2 layout, choose preferred seating, and proceed through booking.',
      href: '/tickets',
      labelBn: 'টিকিট কাটুন',
      labelEn: 'Book a seat',
    },
    {
      code: '02 / GPS',
      number: '02',
      icon: Navigation,
      titleBn: 'বাসের অবস্থান ও জিপিএস আপডেট',
      titleEn: 'Bus Position & Verified Telemetry',
      descBn: 'সুপারভাইজার বা চালকের ডিভাইস থেকে পাওয়া সর্বশেষ অবস্থান ও টাইমস্ট্যাম্প দেখুন।',
      descEn: 'Track actual coordinates with verified timestamps; no simulated pings.',
      href: '/tracking',
      labelBn: 'ট্র্যাকিং দেখুন',
      labelEn: 'View radar',
    },
    {
      code: '03 / RTE',
      number: '03',
      icon: MapPin,
      titleBn: 'করিডোর স্টপ সিকোয়েন্স ও রুট',
      titleEn: 'Corridor Stops & Linear Sequence',
      descBn: 'কাপ্তাই রাস্তার মাথা থেকে কাঠগড় পর্যন্ত ১২টি স্টপেজের ক্রম ও ল্যান্ডমার্ক তথ্য।',
      descEn: 'Full 12-stop milestone sequence with landmark addresses across 24.9 km.',
      href: '/routes',
      labelBn: 'রুট দেখুন',
      labelEn: 'Explore route',
    },
    {
      code: '04 / TAR',
      number: '04',
      icon: CreditCard,
      titleBn: 'স্বচ্ছ খসড়া ভাড়া ক্যালকুলেটর',
      titleEn: 'Indicative Draft Fare Calculator',
      descBn: 'যাত্রার শুরু ও গন্তব্য নির্ধারণ করে আনুমানিক স্টেজভিত্তিক ভাড়া জানুন (৳১৫–৳৬৫)।',
      descEn: 'Compute stage-based indicative fares from ৳15 minimum to ৳65 terminal.',
      href: '/fares',
      labelBn: 'ভাড়া হিসাব করুন',
      labelEn: 'Calculate fare',
    },
    {
      code: '05 / CTR',
      number: '05',
      icon: Building2,
      titleBn: 'কাউন্টার ডিরেক্টরি ও যোগাযোগ',
      titleEn: 'Station Counters & Verified Points',
      descBn: 'করিডোরজুড়ে অবস্থিত ফিজিক্যাল কাউন্টার পয়েন্ট ও যাচাইকৃত ফোন নম্বরসমূহ।',
      descEn: 'Physical booth locations, operational hours and verified telephone lines.',
      href: '/counters',
      labelBn: 'কাউন্টার তালিকা',
      labelEn: 'Find counter',
    },
    {
      code: '06 / USR',
      number: '06',
      icon: UserRound,
      titleBn: 'যাত্রী প্রোফাইল ও বুকিং হিস্ট্রি',
      titleEn: 'Commuter Profile & Trip Records',
      descBn: 'আপনার ইস্যুকৃত টিকিট, রিজার্ভেশন ও ব্যক্তিগত যাত্রাতালিকা পর্যবেক্ষণ করুন।',
      descEn: 'Access confirmed seat reservations, digital passes and travel history.',
      href: '/profile',
      labelBn: 'প্রোফাইল দেখুন',
      labelEn: 'View profile',
    },
  ];

  const operatingPrinciples = [
    {
      index: '01',
      tag: 'CORRIDOR INTEGRITY',
      titleBn: 'সুনির্দিষ্ট ২৪.৯ কিমি রুট ও ১২টি স্টেশন',
      titleEn: 'Fixed 24.9 km Corridor & 12 Stations',
      descBn: 'কাপ্তাই রাস্তার মাথা থেকে কাঠগড় পর্যন্ত প্রতিটি স্টপ নির্ধারিত ও প্রকাশিত। কোনো অনিবন্ধিত স্টপেজে অননুমোদিত সময়ক্ষেপণ নেই।',
      descEn: 'Every station along the arterial route is publicly documented with published landmark addresses. No arbitrary deviations.',
    },
    {
      index: '02',
      tag: 'TARIFF HONESTY',
      titleBn: 'স্বচ্ছ খসড়া ভাড়া ও কাউন্টার অনুমোদন',
      titleEn: 'Indicative Transparency & Approved Fares',
      descBn: 'ওয়েবসাইটে প্রদর্শিত ভাড়া খসড়া হিসেবে স্পষ্টভাবে উল্লেখ থাকে। অতিরিক্ত কোনো লুকানো চার্জ বা অননুমোদিত সারচার্জ নেই।',
      descEn: 'All online figures are explicitly marked as indicative draft rates. Final ratified amounts are confirmed at official counters.',
    },
    {
      index: '03',
      tag: 'VERIFIABLE ACCOUNTABILITY',
      titleBn: 'বাস্তব জিপিএস ও ইন-পার্সন কাউন্টার সেবা',
      titleEn: 'Live Telemetry & In-Person Presence',
      descBn: 'কৃত্রিম জিপিএস অ্যানিমেশনের পরিবর্তে শুধুমাত্র চালক বা সুপারভাইজারের ডিভাইসের সক্রিয় আপডেট অনুযায়ী বাসের তথ্য দেখানো হয়।',
      descEn: 'We strictly reject fake or simulated GPS telemetry. Locations appear only when real device pings are received.',
    },
  ];

  const faqs = [
    {
      num: '01',
      qBn: 'মেট্রো প্রভাতীর বাস করিডোর কোথা থেকে কোথায় বিস্তৃত?',
      qEn: 'Where does the Metro Probati transit corridor operate?',
      aBn: 'আমাদের নির্ধারিত করিডোরটি চট্টগ্রামের কাপ্তাই রাস্তার মাথা (মাস্টার টার্মিনাল) থেকে শুরু হয়ে বহদ্দারহাট, মুরাদপুর, জিইসি মোড়, আগ্রাবাদ এবং ইপিজেড হয়ে কাঠগড় (মাস্টার টার্মিনাল) পর্যন্ত বিস্তৃত। সম্পূর্ণ রুটের আনুমানিক দৈর্ঘ্য প্রায় ২৪.৯ কিলোমিটার।',
      aEn: 'The designated corridor operates between Kaptai Rastar Matha (Master Terminal) and Katgor (Master Terminal), connecting Bahaddarhat, Muradpur, GEC, Agrabad, and EPZ across approximately 24.9 kilometres.',
    },
    {
      num: '02',
      qBn: 'ওয়েবসাইটে দেখানো ভাড়ার অঙ্ক কি চূড়ান্ত ও অনুমোদিত?',
      qEn: 'Are the fare calculations shown on the platform final?',
      aBn: 'না। এই প্ল্যাটফর্মের ক্যালকুলেটর ও টেবিলে প্রদর্শিত ভাড়ার তথ্য নির্দেশক খসড়া হিসাব (৳১৫ সর্বনিম্ন থেকে ৳৬৫ টার্মিনাল)। যাত্রার পূর্বে সর্বদা সংশ্লিষ্ট কাউন্টারে বর্তমান অনুমোদিত ভাড়া নিশ্চিত করে টিকিট সংগ্রহ করুন।',
      aEn: 'No. Figures in our calculator are indicative draft estimates (ranging from ৳15 to ৳65 terminal-to-terminal). Always verify current approved fares with counter staff before travel.',
    },
    {
      num: '03',
      qBn: 'বাসের জিপিএস ট্র্যাকিং তথ্যে লাইভ অবস্থান কীভাবে নিশ্চিত হয়?',
      qEn: 'How is live GPS telemetry verified on the platform?',
      aBn: 'আমাদের প্ল্যাটফর্ম কৃত্রিম অ্যানিমেশন ব্যবহার করে না। ৩ মিনিটের মধ্যে সুপারভাইজার বা ড্রাইভারের ডিভাইস থেকে বৈধ স্থানাঙ্ক পাওয়া গেলেই কেবল বাসকে "লাইভ" হিসেবে দেখানো হয়। ৩–১০ মিনিটের পুরনো তথ্য "বিলম্বিত" হিসেবে চিহ্নিত থাকে।',
      aEn: 'We do not generate simulated locations. A bus is displayed as live strictly when valid device telemetry is received within 3 minutes. Updates between 3 and 10 minutes are explicitly marked delayed.',
    },
    {
      num: '04',
      qBn: 'বর্তমান অনলাইন পেমেন্ট কি সম্পূর্ণ সক্রিয় এবং চূড়ান্ত?',
      qEn: 'Is the current online booking payment live and operational?',
      aBn: 'বর্তমান পেমেন্ট প্রবাহটি একটি স্যান্ডবক্স বা পরীক্ষামূলক ইন্টারফেস। এটি আসল আর্থিক লেনদেনের প্রতিনিধিত্ব করে না। বাস্তব যাত্রার জন্য কাউন্টারে সরাসরি টিকিট সংগ্রহ বা যাচাই সম্পন্ন করুন।',
      aEn: 'The online payment gateway operates in sandbox/demonstration mode and does not process real money. Please confirm your physical seat ticket at the counter point.',
    },
  ];

  return (
    <div className="bg-[#FAF9F7] pb-20 text-stone-900">
      {/* 1. Dramatic Swiss-Art-Directed Transit Hero */}
      <Hero />

      <div className="mx-auto max-w-[1240px] space-y-24 px-4 pt-16 sm:space-y-32 sm:px-6 sm:pt-24 lg:px-8">
        {/* 2. Anti-Template Editorial Transit Service Ledger */}
        <section aria-labelledby="services-heading" className="space-y-10">
          <div className="flex flex-col justify-between gap-6 border-b border-stone-300 pb-8 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#C92232]">
                <span className="h-px w-8 bg-[#C92232]" />
                <span>INDEX 01 / PASSENGER SERVICES</span>
              </div>
              <h2
                id="services-heading"
                className="max-w-xl text-3xl font-black leading-[1.08] tracking-[-0.04em] text-stone-950 sm:text-4xl"
              >
                {language === 'bn'
                  ? 'আপনার যাত্রার প্রয়োজনীয় সবকিছু।'
                  : 'Comprehensive Transit Operations.'}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-stone-600 lg:text-right">
              {language === 'bn'
                ? 'রুট, নির্দেশক ভাড়া, জিপিএস ট্র্যাকিং ও কাউন্টার সহায়তা—চট্টগ্রাম করিডোরে চলাচলের জন্য সম্পূর্ণ নির্দেশিকা।'
                : 'Corridor routes, indicative tariff calculation, verified tracking and counter points for Chattogram commuters.'}
            </p>
          </div>

          {/* Full-Width Swiss Horizontal Ledger (No cards, no boxes!) */}
          <div className="divide-y divide-stone-200 border-b border-stone-300">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  href={service.href}
                  key={service.code}
                  className="group grid grid-cols-1 items-baseline gap-4 py-6 transition-all duration-200 hover:bg-white hover:px-4 sm:grid-cols-[100px_1.2fr_1.8fr_auto] sm:gap-6 sm:py-7 sm:hover:px-6"
                >
                  <span className="font-mono text-xs font-bold text-stone-400 group-hover:text-[#C92232] transition-colors">
                    {service.code}
                  </span>

                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0 text-[#C92232] transition-transform duration-200 group-hover:scale-110" />
                    <h3 className="text-base font-extrabold tracking-tight text-stone-950 group-hover:text-[#C92232] transition-colors sm:text-lg">
                      {language === 'bn' ? service.titleBn : service.titleEn}
                    </h3>
                  </div>

                  <p className="text-xs leading-6 text-stone-600 sm:text-sm">
                    {language === 'bn' ? service.descBn : service.descEn}
                  </p>

                  <div className="flex items-center gap-2 justify-self-start font-mono text-xs font-bold text-[#C92232] sm:justify-self-end">
                    <span>{language === 'bn' ? service.labelBn : service.labelEn}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 3. High-Contrast Transit Operations & Telemetry Board */}
        <section className="relative isolate overflow-hidden bg-[#211F1F] text-white">
          {/* Subtle Ambient Light Drift */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-36 -top-36 h-[440px] w-[440px] rounded-full bg-[#C92232]/15 blur-[100px] animate-ambient-drift"
          />

          <div className="relative z-10 grid grid-cols-1 items-stretch lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col justify-between p-7 sm:p-12 lg:p-16">
              <div>
                <div className="mb-4 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#F18A91]">
                  <span className="h-px w-8 bg-[#F18A91]" />
                  <span>OPERATIONS · REAL-TIME TELEMETRY</span>
                </div>

                <h2 className="max-w-lg text-3xl font-black leading-[1.08] tracking-[-0.04em] sm:text-4xl">
                  {language === 'bn'
                    ? 'প্রকৃত জিপিএস আপডেট — কোনো কৃত্রিম অবস্থান নয়।'
                    : 'Verifiable Coordinates Over Simulated Movement.'}
                </h2>

                <p className="mt-5 max-w-lg text-sm leading-7 text-stone-300">
                  {language === 'bn'
                    ? 'মেট্রো প্রভাতী কোনো কাল্পনিক অ্যানিমেশন দেখায় না। ড্রাইভার বা সুপারভাইজারের ডিভাইস থেকে সক্রিয় জিপিএস আপডেট পাওয়া গেলেই কেবল বাসের অবস্থান প্রদর্শিত হয়।'
                    : 'We reject artificial animations. Locations appear strictly from authenticated driver/supervisor GPS devices, distinguishing fresh live pings from delayed data.'}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/tracking"
                    className="inline-flex min-h-12 items-center gap-3 bg-white px-6 py-3 text-sm font-extrabold text-[#A91D2A] transition-all duration-200 hover:bg-[#FFF4F4] active:scale-[0.99]"
                  >
                    <Navigation className="h-4 w-4" />
                    <span>{language === 'bn' ? 'লাইভ ট্র্যাকিং খুলুন' : 'Open live radar'}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/routes"
                    className="inline-flex min-h-12 items-center gap-2 border border-white/40 px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-white/10"
                  >
                    <span>{language === 'bn' ? 'স্টপ সিকোয়েন্স' : 'Stop sequence'}</span>
                  </Link>
                </div>
              </div>

              {/* Wayfinding Technical Telemetry Ledger */}
              <div className="mt-12 grid grid-cols-2 gap-4 border-t border-stone-800 pt-6 font-mono text-[10px] text-stone-400 sm:grid-cols-3 sm:text-[11px]">
                <div>
                  <span className="block text-[9px] text-stone-500">CORRIDOR GEOFENCE</span>
                  <span className="font-bold text-white">22.15°N — 22.45°N</span>
                </div>
                <div>
                  <span className="block text-[9px] text-stone-500">FRESHNESS THRESHOLD</span>
                  <span className="font-bold text-[#F18A91]">ACTIVE &lt; 3 MINS</span>
                </div>
                <div>
                  <span className="block text-[9px] text-stone-500">DISPATCH CONTROL</span>
                  <span className="font-bold text-white">CHATTOGRAM METRO</span>
                </div>
              </div>
            </div>

            {/* Asymmetrical High-Impact Photographic Window */}
            <div className="relative min-h-[320px] overflow-hidden lg:min-h-full">
              <Image
                src="/images/bus-2.jpg"
                alt={language === 'bn' ? 'মেট্রো প্রভাতী বহর' : 'Metro Probati on Chattogram Corridor'}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#211F1F] via-transparent to-black/20 lg:bg-gradient-to-r lg:from-[#211F1F] lg:via-transparent" />
              <div className="absolute bottom-6 left-6 border-l-2 border-[#C92232] bg-black/60 px-4 py-3 backdrop-blur-sm">
                <div className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#F18A91]">
                  FLEET IN MOTION
                </div>
                <div className="mt-1 text-sm font-extrabold text-white sm:text-base">
                  {language === 'bn' ? 'চট্টগ্রাম আর্টেরিয়াল করিডোর' : 'Chattogram Arterial Transit'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Transport Wayfinding Corridor & Linear Schematic */}
        <section aria-labelledby="route-heading" className="space-y-10">
          <div className="flex flex-col justify-between gap-6 border-b border-stone-300 pb-8 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#C92232]">
                <span className="h-px w-8 bg-[#C92232]" />
                <span>WAYFINDING · ARTERIAL CORRIDOR</span>
              </div>
              <h2
                id="route-heading"
                className="text-3xl font-black leading-[1.08] tracking-[-0.04em] text-stone-950 sm:text-4xl"
              >
                {language === 'bn' ? 'কাপ্তাই রাস্তার মাথা — কাঠগড়' : 'Kaptai Rastar Matha — Katgor'}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div className="font-mono text-xs text-stone-500">
                <span className="font-black text-[#C92232]">12</span> STATIONS · <span className="font-black text-stone-900">24.9</span> KM
              </div>
              <Link
                href="/routes"
                className="inline-flex items-center gap-2 border-b border-[#C92232] pb-1 text-xs font-extrabold text-[#C92232] transition-colors hover:text-[#A91D2A]"
              >
                <span>{language === 'bn' ? 'সম্পূর্ণ রুট ডিরেক্টরি' : 'Full route directory'}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Connected Wayfinding Corridor: Schematic & Ledger */}
          <RouteCorridorTimeline />
        </section>

        {/* 5. Editorial Fleet Monograph Exhibition */}
        <section aria-labelledby="fleet-heading" className="space-y-6">
          <div className="flex flex-col justify-between gap-4 border-b border-stone-300 pb-6 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#C92232]">
                <span className="h-px w-8 bg-[#C92232]" />
                <span>MONOGRAPH · URBAN FLEET</span>
              </div>
              <h2
                id="fleet-heading"
                className="text-3xl font-black tracking-[-0.04em] text-stone-950 sm:text-4xl"
              >
                {language === 'bn' ? 'মেট্রো প্রভাতী বহর' : 'The Metro Probati Fleet'}
              </h2>
            </div>
            <p className="max-w-sm text-xs leading-6 text-stone-500">
              {language === 'bn'
                ? 'চট্টগ্রাম নগরীতে নিয়মিত যাত্রী পরিবহনে নিয়োজিত আধুনিক ও নিয়মতান্ত্রিক বাস বহর।'
                : 'Commuter coaches deployed across Chattogram’s primary transit corridor.'}
            </p>
          </div>

          <BusCarousel />
        </section>

        {/* 6. Tariff Information & Regulatory Fare Schedule */}
        <section aria-labelledby="fare-heading" className="space-y-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="space-y-6">
              <div>
                <div className="mb-3 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#C92232]">
                  <span className="h-px w-8 bg-[#C92232]" />
                  <span>TARIFF SCHEDULE · 2026</span>
                </div>
                <h2
                  id="fare-heading"
                  className="text-3xl font-black leading-[1.08] tracking-[-0.04em] text-stone-950 sm:text-4xl"
                >
                  {language === 'bn' ? 'স্বচ্ছ খসড়া ভাড়া হিসাব।' : 'Indicative Stage-Based Fares.'}
                </h2>
                <p className="mt-4 text-sm leading-7 text-stone-600">
                  {language === 'bn'
                    ? 'ক্যালকুলেটরে দেখানো অঙ্কগুলো স্টেজভিত্তিক নির্দেশক ভাড়া (সর্বনিম্ন ৳১৫ থেকে টার্মিনাল ৳৬৫)। অনুমোদিত ভাড়া কাউন্টারে নিশ্চিত করা আবশ্যক।'
                    : 'Calculated from official corridor stage steps. Indicative range spans ৳15 minimum to ৳65 terminal-to-terminal.'}
                </p>
              </div>

              {/* Wayfinding Tariff Matrix Snippet */}
              <div className="border border-stone-200 bg-white p-5 font-mono text-xs">
                <div className="border-b border-stone-200 pb-3 font-bold uppercase tracking-wider text-stone-400">
                  STAGE FARE MATRIX SUMMARY
                </div>
                <div className="divide-y divide-stone-100 pt-2 text-stone-700">
                  <div className="flex justify-between py-2">
                    <span>1 STAGE (LOCAL JUMP)</span>
                    <strong className="text-[#C92232]">৳15</strong>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>BAHADDARHAT ⇄ EPZ (9 STAGES)</span>
                    <strong className="text-[#C92232]">৳55</strong>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>TERMINAL-TO-TERMINAL (11 STAGES)</span>
                    <strong className="text-[#C92232]">৳65</strong>
                  </div>
                </div>
              </div>

              <Link
                href="/fares"
                className="inline-flex items-center gap-2 text-xs font-extrabold text-[#C92232] hover:text-[#A91D2A] transition-colors"
              >
                <span>{language === 'bn' ? 'সম্পূর্ণ স্টেজ ম্যাট্রিক্স দেখুন' : 'View full stage matrix'}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <FareCalculatorCard />
          </div>
        </section>

        {/* 7. Asymmetrical Editorial Transit Manifesto (Anti-Template: NO repetitive 3-box cards!) */}
        <section aria-labelledby="charter-heading" className="border-t border-stone-300 pt-16">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <div className="mb-3 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#C92232]">
                <span className="h-px w-8 bg-[#C92232]" />
                <span>TRANSIT PRINCIPLES · CHARTER</span>
              </div>
              <h2
                id="charter-heading"
                className="text-3xl font-black leading-[1.08] tracking-[-0.04em] text-stone-950 sm:text-4xl"
              >
                {language === 'bn'
                  ? 'তথ্যের সততা ও নির্ভরযোগ্য যাত্রীসেবা।'
                  : 'Operational Integrity Over Embellishment.'}
              </h2>
              <p className="mt-5 text-sm leading-7 text-stone-600">
                {language === 'bn'
                  ? 'আমরা যাত্রীদের সাথে স্বচ্ছ তথ্যে বিশ্বাসী। বাস্তব রুট, সঠিক খসড়া হিসাব এবং ফিজিক্যাল কাউন্টারের জবাবদিহিতাই আমাদের মূল চালিকাশক্তি।'
                  : 'We prioritize verifiable data, honest draft disclosures, and physical counter accountability above marketing promises.'}
              </p>
            </div>

            {/* Asymmetrical Horizontal Charter Ledger */}
            <div className="divide-y divide-stone-200 border-y border-stone-300">
              {operatingPrinciples.map((principle) => (
                <div key={principle.index} className="grid grid-cols-1 gap-3 py-6 sm:grid-cols-[70px_1fr] sm:gap-6">
                  <span className="font-mono text-xl font-black text-[#C92232]">
                    {principle.index}
                  </span>
                  <div>
                    <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                      {principle.tag}
                    </span>
                    <h3 className="mt-1 text-base font-extrabold text-stone-950 sm:text-lg">
                      {language === 'bn' ? principle.titleBn : principle.titleEn}
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-stone-600 sm:text-sm">
                      {language === 'bn' ? principle.descBn : principle.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Open Passenger Advisory & Help Ledger (No boxed accordion cards!) */}
        <section aria-labelledby="faq-heading" className="border-t border-stone-300 pt-16">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div>
              <div className="mb-3 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#C92232]">
                <span className="h-px w-8 bg-[#C92232]" />
                <span>COMMUTER ADVISORY · FAQ</span>
              </div>
              <h2
                id="faq-heading"
                className="text-3xl font-black tracking-[-0.04em] text-stone-950 sm:text-4xl"
              >
                {language === 'bn' ? 'যাত্রী সহায়তা ও নির্দেশিকা।' : 'Passenger Advisory & Guide.'}
              </h2>
              <p className="mt-4 text-sm leading-7 text-stone-600">
                {language === 'bn'
                  ? 'দৈনন্দিন চলাচল সংক্রান্ত সাধারণ প্রশ্নাবলি ও স্পষ্ট উত্তর।'
                  : 'Clear answers to essential everyday transit questions.'}
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold text-[#C92232] hover:text-[#A91D2A] transition-colors"
              >
                <span>{language === 'bn' ? 'সরাসরি যোগাযোগ করুন' : 'Contact helpline team'}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Open Swiss Q&A Rows (Clean, airy, zero SaaS box cards!) */}
            <div className="divide-y divide-stone-200 border-y border-stone-300">
              {faqs.map((faq) => (
                <article key={faq.num} className="py-6 sm:py-8">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs font-bold text-[#C92232]">
                      {faq.num}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-base font-extrabold text-stone-950 sm:text-lg">
                        {language === 'bn' ? faq.qBn : faq.qEn}
                      </h3>
                      <p className="mt-3 text-xs leading-7 text-stone-600 sm:text-sm">
                        {language === 'bn' ? faq.aBn : faq.aEn}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Bold Swiss Transport Helpline & Action Ending */}
        <section className="relative isolate overflow-hidden bg-[#C92232] p-8 text-white sm:p-12 lg:p-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -bottom-32 h-[360px] w-[360px] rounded-full bg-white/10 blur-[80px] animate-ambient-drift"
          />

          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
                <span className="h-px w-8 bg-white/70" />
                <span>DIRECT PASSENGER HOTLINE</span>
              </div>
              <h2 className="text-3xl font-black leading-[1.08] tracking-[-0.035em] sm:text-4xl">
                {language === 'bn' ? 'যাত্রা সম্পর্কে যেকোনো প্রশ্ন?' : 'Direct Transit Assistance'}
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/85">
                {language === 'bn'
                  ? 'ভাড়া, রুট বা নিকটস্থ কাউন্টারের তথ্য জানতে আমাদের প্রকাশিত হেল্পলাইনে কল করুন অথবা সরাসরি WhatsApp-এ বার্তা তৈরি করুন।'
                  : 'Contact our published helpline directly or open a prepared message in WhatsApp for immediate routing guidance.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={'tel:' + INITIAL_HELPLINE.primaryNumber}
                className="inline-flex min-h-12 items-center gap-3 bg-white px-6 py-3 text-sm font-extrabold text-[#A91D2A] transition-all duration-200 hover:bg-[#FFF4F4] active:scale-[0.99]"
              >
                <Phone className="h-4 w-4" />
                <span>{language === 'bn' ? 'কল করুন' : 'Call'} {INITIAL_HELPLINE.primaryNumber}</span>
              </a>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center gap-2 border border-white/60 px-6 py-3 text-sm font-extrabold text-white transition-all duration-200 hover:bg-white/10 active:scale-[0.99]"
              >
                <span>{language === 'bn' ? 'যোগাযোগ পেজ' : 'Contact page'}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
