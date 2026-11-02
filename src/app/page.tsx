'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { BusCarousel } from '@/components/BusCarousel';
import { LiveTrackingMap } from '@/components/LiveTrackingMap';
import { FareCalculatorCard } from '@/components/FareCalculatorCard';
import { RouteCorridorTimeline } from '@/components/RouteCorridorTimeline';
import { useLanguage } from '@/context/LanguageContext';
import {
  Compass,
  ShieldCheck,
  Zap,
  CreditCard,
  MapPin,
  Clock,
  PhoneCall,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  Ticket,
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  FileCheck,
} from 'lucide-react';
import { INITIAL_HELPLINE } from '@/data/mockData';
import { toBengaliDigits } from '@/lib/fareCalculator';

export default function HomePage() {
  const { language, t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const services = [
    {
      titleBn: 'সহজ অনলাইন আসন বুকিং',
      titleEn: 'Easy Seat Reservation',
      descBn: 'বাসের আসন বিন্যাস দেখে পছন্দমতো সিট নির্বাচন করুন। ৫ মিনিটের পরমাণু হোল্ড সুবিধা।',
      descEn: 'Interactive 38-seat visual bus layout with 5-minute atomic reservation lease.',
      icon: Ticket,
      href: '/tickets',
      badgeBn: 'ডিজিটাল ই-পাস',
      badgeEn: 'Instant Pass',
    },
    {
      titleBn: 'সরাসরি স্যাটেলাইট জিপিএস',
      titleEn: 'Live Satellite Radar',
      descBn: 'কোনো অনুমান বা কৃত্রিম অ্যানিমেশন নয়। চালকের সরাসরি অবস্থান ও গতি লাইভ ম্যাপে দেখুন।',
      descEn: 'Zero simulated motion. Real-time telemetry straight from verified active vehicles.',
      icon: Compass,
      href: '/tracking',
      badgeBn: 'বাস্তব ট্র্যাকিং',
      badgeEn: 'Genuine GPS',
    },
    {
      titleBn: 'স্বচ্ছ খসড়া ভাড়া ক্যালকুলেটর',
      titleEn: 'Transparent Fare Matrix',
      descBn: 'কাপ্তাই রাস্তার মাথা থেকে কাঠগড় করিডোরের যে কোনো দুই স্টপের দূরত্ব ভিত্তিক খসড়া ভাড়া।',
      descEn: 'Accurate stage tariff calculations between any corridor stops across Chattogram.',
      icon: CreditCard,
      href: '/fares',
      badgeBn: '১৫–৬৫ ৳ পরিধি',
      badgeEn: 'Draft Scale',
    },
    {
      titleBn: 'করিডোর রুট ও স্টপেজ',
      titleEn: 'Route Corridor Directory',
      descBn: 'বহদ্দারহাট, মুরাদপুর, জিইসি ও ইপিজেড হয়ে ১২টি মূল স্টপের ভৌগোলিক অবস্থান ও দূরত্ব।',
      descEn: 'Detailed sequence across 12 key hubs connecting Kaptai to Katgor terminal.',
      icon: MapPin,
      href: '/routes',
      badgeBn: '১২টি স্টপ',
      badgeEn: '12 Hubs',
    },
    {
      titleBn: 'কাউন্টার নেটওয়ার্ক ও পয়েন্ট',
      titleEn: 'Counter Directory',
      descBn: 'চট্টগ্রাম নগরীর প্রধান কাউন্টারগুলোর অবস্থান, খোলার সময়সূচি ও সরাসরি যোগাযোগ নম্বর।',
      descEn: 'Verified counter locations, daily operating hours, and direct representative helplines.',
      icon: Building2,
      href: '/counters',
      badgeBn: 'মাস্টার কাউন্টার',
      badgeEn: 'Verified Hubs',
    },
    {
      titleBn: 'যাত্রী একাউন্ট ও ই-টিকেট',
      titleEn: 'Passenger Portal & Pass',
      descBn: 'মোবাইল নম্বর বা জিমেইল দিয়ে লগইন করে পূর্ববর্তী টিকিট দেখুন এবং ডিজিটাল কিউআর যাচাই করুন।',
      descEn: 'Manage booking history, download receipts, and present digital boarding tokens.',
      icon: Users,
      href: '/profile',
      badgeBn: 'আমার প্রোফাইল',
      badgeEn: 'My Account',
    },
  ];

  const trustCommitments = [
    {
      titleBn: '১০০% বাস্তব উপগ্রহ জিপিএস',
      titleEn: '100% Genuine Satellite GPS',
      descBn: 'আমাদের প্ল্যাটফর্মে কোনো কৃত্রিম অ্যানিমেশন বা আনুমানিক গতিবিধি নেই। চালকের সক্রিয় ফোন ও জিপিএস থেকে সরাসরি প্রাপ্ত তথ্যের ভিত্তিতেই বাস দৃশ্যমান হয়।',
      descEn: 'Strict zero-fabrication telemetry policy. Buses only appear with live coordinates received from on-duty driver devices.',
      icon: Compass,
    },
    {
      titleBn: 'ডাবল-বুকিং প্রতিরোধে ৫ মিনিটের লক',
      titleEn: '5-Minute Atomic Seat Lease',
      descBn: 'একই আসন দুজন যাত্রী যাতে একই সাথে বুক করতে না পারেন, সেজন্য আসন নির্বাচনের পর ৫ মিনিটের টাইম-লক বরাদ্দ থাকে।',
      descEn: 'Concurrency control prevents overlapping reservations with an atomic 5-minute checkout countdown.',
      icon: Clock,
    },
    {
      titleBn: 'নিয়ন্ত্রিত স্ট্যান্ডিং ক্যাপাসিটি',
      titleEn: 'Regulated Passenger Capacity',
      descBn: 'অতিরিক্ত ভিড় ও ঝুঁকি এড়াতে সর্বোচ্চ ১৫ জনের স্ট্যান্ডিং স্পেস তদারকি এবং সুপারভাইজার রিপোর্টিং ব্যবস্থা।',
      descEn: 'Enforces a strict 15-passenger standing limit with live supervisor reporting for commuter safety.',
      icon: ShieldCheck,
    },
    {
      titleBn: 'সরাসরি হেল্পলাইন ও সাপোর্ট',
      titleEn: 'Dedicated Direct Hotline',
      descBn: 'ভাড়া সংক্রান্ত তথ্য, হারানো মালামাল উদ্ধার বা যে কোনো অনুসন্ধানে সকাল ৬:০০ থেকে রাত ১১:০০ পর্যন্ত আমাদের হেল্পলাইনে সরাসরি যোগাযোগ করুন।',
      descEn: 'Prompt assistance for routes, lost-and-found recovery, and commuter guidance seven days a week.',
      icon: PhoneCall,
    },
  ];

  const faqs = [
    {
      qBn: 'মেট্রো প্রভাতীর বাস কোন কোন রুটে চলাচল করে?',
      qEn: 'Which corridor does Metro Probati operate on?',
      aBn: 'মেট্রো প্রভাতী কাপ্তাই রাস্তার মাথা থেকে বহদ্দারহাট, মুরাদপুর, ২ নম্বর গেট, জিইসি মোড়, ওয়াসা, দেওয়ানহাট, চৌমুহনী, আগ্রাবাদ, সল্টগোলা ক্রসিং ও ইপিজেড (সিইপিজেড / কেইপিজেড) হয়ে কাঠগড় ডায়াগনস্টিক অ্যান্ড রিসার্চ সেন্টার (জালাল মার্কেট) পর্যন্ত চলাচল করে (মোট ২৪.৯ কিমি)।',
      aEn: 'Metro Probati operates on the Kaptai Rastar Matha ↔ Katgor corridor via Bahaddarhat, Muradpur, 2 No Gate, GEC Mor, WASA, Dewanhat, Chowmuhani, Agrabad, Saltgola, EPZ (KEPZ), and Katgor (approx. 24.9 km).',
    },
    {
      qBn: 'ভাড়া তালিকা কি অনুমোদিত?',
      qEn: 'Is the displayed fare chart finalized?',
      aBn: 'প্রদর্শিত ১৫–৬৫ টাকা পরিধির ভাড়া হালনাগাদকৃত নির্দেশক অনুমোদিত রূপরেখা (যেমন: বহদ্দারহাট থেকে কেইপিজেড ৫৫ টাকা, আগ্রাবাদ থেকে কেইপিজেড ৩৫ টাকা)। মেট্রো প্রভাতী বাস মালিক কর্তৃপক্ষ এবং বিআরটিএ-এর অনুমোদিত সর্বশেষ তালিকা নিয়মিত আপডেট করা হয়।',
      aEn: 'The ৳15–৳65 range is an updated indicative draft (e.g. Bahaddarhat to KEPZ ৳55, Agrabad to KEPZ ৳35) aligned with approved corridor guidelines.',
    },
    {
      qBn: 'বাস ট্র্যাকিং কি সত্যি রিয়েল-টাইম জিপিএস?',
      qEn: 'Is the bus tracking truly real-time GPS?',
      aBn: 'হ্যাঁ। আমাদের সিস্টেমে কোনো কৃত্রিম অ্যানিমেশন বা আনুমানিক লোকেশন দেখানো হয় না। চালকের সক্রিয় ডিভাইস থেকে সরাসরি প্রাপ্ত জিপিএস উপাত্তের ভিত্তিতেই বাস ম্যাপে অবস্থান করে। উপাত্ত ৩ মিনিটের বেশি পুরনো হলে তা হলুদ (বিলম্বিত) এবং ১০ মিনিটের বেশি হলে অফলাইন প্রদর্শিত হয়।',
      aEn: 'Yes. We strictly guarantee genuine telemetry. Buses only appear with live coordinates received directly from active on-duty driver devices. If a ping is older than 3 minutes, it transitions to stale (yellow) and offline (gray) after 10 minutes.',
    },
    {
      qBn: 'অনলাইন টিকিট বুকিং ও আসন হোল্ড কীভাবে কাজ করে?',
      qEn: 'How does seat reservation and temporary hold work?',
      aBn: 'ওয়েবসাইটে আসন নির্বাচনের পর ৫ মিনিটের জন্য আসনটি আপনার ব্রাউজার সেশনে সাময়িকভাবে লক থাকে। নির্ধারিত সময়ের মধ্যে পেমেন্ট সম্পন্ন বা কাউন্টার থেকে কনফার্ম করলে আসন স্থায়ীভাবে নিশ্চিত হয় এবং ডিজিটাল কিউআর ই-পাস তৈরি হয়।',
      aEn: 'Once seats are selected, they are held exclusively for 5 minutes. Completing the confirmation issues your digital verification token.',
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* SECTION 01: Flagship Cinematic Hero with Journey Planner */}
      <Hero />

      {/* Corridor Metric Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-[#E5E0D8] p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="flex items-center gap-3.5 px-2">
            <div className="w-11 h-11 rounded-2xl bg-[#F2E4E2] text-[#C92232] flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#272524] font-mono">{toBengaliDigits(12)}টি</div>
              <div className="text-[11px] text-slate-500 font-semibold">{language === 'bn' ? 'অনুমোদিত স্টপ' : 'Listed Stops'}</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-2 pt-3 sm:pt-0">
            <div className="w-11 h-11 rounded-2xl bg-[#EAF1EE] text-[#49665A] flex items-center justify-center flex-shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#272524] font-mono">{toBengaliDigits('24.9')} কিমি</div>
              <div className="text-[11px] text-slate-500 font-semibold">{language === 'bn' ? 'প্রধান এক্সপ্রেস করিডোর' : 'Arterial Corridor'}</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-2 pt-3 sm:pt-0">
            <div className="w-11 h-11 rounded-2xl bg-[#FAF4EB] text-[#A87936] flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#272524] font-mono">{toBengaliDigits(5)} মিনিট</div>
              <div className="text-[11px] text-slate-500 font-semibold">{language === 'bn' ? 'নিশ্চিত আসন লক' : 'Atomic Seat Hold'}</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-2 pt-3 sm:pt-0">
            <div className="w-11 h-11 rounded-2xl bg-[#FFF5F5] text-[#C92232] flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-[#272524] font-mono">৳{toBengaliDigits(15)}–{toBengaliDigits(65)}</div>
              <div className="text-[11px] text-slate-500 font-semibold">{language === 'bn' ? 'স্বচ্ছ খসড়া ভাড়া' : 'Indicative Draft Fare'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* SECTION 02: Distinctive Service Navigation Cards */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black text-[#C92232] uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>{language === 'bn' ? 'যাত্রী সেবা ও ডিরেক্টরি' : 'Passenger Services'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#272524] tracking-tight">
                {language === 'bn' ? 'আপনার প্রতিদিনের যাত্রায় যা যা প্রয়োজন' : 'Everything You Need for Your Commute'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              {language === 'bn'
                ? 'চট্টগ্রাম শহরের কাপ্তাই রাস্তার মাথা থেকে কাঠগড় করিডোরে দ্রুত ও নির্ভরযোগ্য যাত্রীসেবা।'
                : 'Reliable transit services connecting Kaptai Rastar Matha to Katgor across Chattogram.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <Link
                  key={idx}
                  href={svc.href}
                  className="group bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E0D8] shadow-card hover:shadow-card-hover hover:border-[#C92232] transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#F2E4E2] text-[#C92232] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#C92232] group-hover:text-white transition-all duration-200 shadow-xs">
                        <Icon className="w-6 h-6 stroke-[2.2]" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#F1EEE8] text-[#272524] group-hover:bg-[#F2E4E2] group-hover:text-[#C92232] transition-colors">
                        {language === 'bn' ? svc.badgeBn : svc.badgeEn}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-[#272524] text-lg group-hover:text-[#C92232] transition-colors">
                        {language === 'bn' ? svc.titleBn : svc.titleEn}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2">
                        {language === 'bn' ? svc.descBn : svc.descEn}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#C92232] group-hover:text-[#A91D2A]">
                    <span>{language === 'bn' ? 'ব্যবহার করুন' : 'Explore Service'}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SECTION 03: Live Satellite Telemetry Tracking Preview */}
        <section id="tracking-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#C92232] uppercase tracking-wider mb-1">
                <Compass className="w-4 h-4" />
                <span>{language === 'bn' ? 'সরাসরি স্যাটেলাইট জিপিএস' : 'Genuine Satellite GPS'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#272524]">
                {t('tracking.title')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                {t('tracking.subtitle')}
              </p>
            </div>

            <Link
              href="/tracking"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C92232] hover:bg-[#A91D2A] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-[#C92232]/20 active:scale-95 transition-all self-start sm:self-auto"
            >
              <span>{language === 'bn' ? 'পূর্ণাঙ্গ ট্র্যাকিং স্ক্রিনে যান' : 'Open Full Screen Tracking'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-lg border border-[#E5E0D8]">
            <LiveTrackingMap />
          </div>
        </section>

        {/* SECTION 04: Corridor Route Discovery & Timeline */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black text-[#C92232] uppercase tracking-wider">
                {language === 'bn' ? 'করিডোর নেটওয়ার্ক' : 'Express Corridor'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#272524] mt-1">
                {language === 'bn'
                  ? 'কাপ্তাই রাস্তার মাথা ↔ কাঠগড়'
                  : 'Kaptai Rastar Matha ↔ Katgor'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {language === 'bn'
                  ? '১২টি অনুমোদিত প্রধান স্টপেজ ও কাউন্টারের ক্রমিক অবস্থান (মোট ২৪.৯ কিমি)'
                  : 'Ordered sequence of 12 verified stops and physical ticket counters (24.9 km)'}
              </p>
            </div>

            <Link
              href="/routes"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#E5E0D8] hover:border-[#C92232] text-xs font-bold text-[#272524] shadow-sm transition"
            >
              <span>{language === 'bn' ? 'সম্পূর্ণ রুট ডিরেক্টরি' : 'Full Route Directory'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <RouteCorridorTimeline />
        </section>

        {/* SECTION 05: Fleet Monograph / Bus Showcase */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-black text-[#C92232] uppercase tracking-wider">
              {language === 'bn' ? 'আমাদের বাস বহর' : 'Official Vehicle Fleet'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#272524] mt-1">
              {language === 'bn' ? 'নিরাপদ ও আরামদায়ক যাত্রা' : 'Engineered for Commuter Comfort'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {language === 'bn'
                ? 'চট্টগ্রাম মহানগরীর যাত্রীসেবায় নিয়োজিত মেট্রো প্রভাতীর বাস বহরের স্পেসিফিকেশন।'
                : 'Technical vehicle specifications and interior features of the Metro Probati fleet.'}
            </p>
          </div>

          <BusCarousel />
        </section>

        {/* SECTION 06: Transparent Fare Calculator Card */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-black text-[#C92232] uppercase tracking-wider">
              {language === 'bn' ? 'ভাড়া পরিমাপক' : 'Tariff & Stage Matrix'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#272524] mt-1">
              {language === 'bn' ? 'স্বচ্ছ নির্দেশক খসড়া ভাড়া' : 'Indicative Route Tariffs'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {language === 'bn'
                ? 'কাপ্তাই রাস্তার মাথা থেকে কাঠগড় পর্যন্ত বিআরটিএ নির্দেশিকা অনুযায়ী স্টেজভিত্তিক খসড়া ভাড়া হিসাব করুন।'
                : 'Calculate stage-based indicative fares according to approved guidelines across the corridor.'}
            </p>
          </div>

          <FareCalculatorCard />
        </section>

        {/* SECTION 07: Passenger Trust Commitments */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-[#C92232] uppercase tracking-wider">
              {language === 'bn' ? 'আমাদের অঙ্গীকার' : 'Operational Charter'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#272524]">
              {language === 'bn' ? 'যাত্রী নিরাপত্তা ও স্বচ্ছতার নিশ্চয়তা' : 'Trust, Safety & Transparency'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {language === 'bn'
                ? 'কোনো ভুয়া তথ্য নয়—প্রকৃত উপাত্ত ও নিয়মভিত্তিক পরিচালনার মাধ্যমে বিশ্বস্ত গণপরিবহন।'
                : 'Zero fabrication policy. Accurate telemetry and respectful transit service.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {trustCommitments.map((tc, idx) => {
              const Icon = tc.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-[#E5E0D8] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#F2E4E2] text-[#C92232] flex items-center justify-center shadow-xs">
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <h3 className="font-extrabold text-[#272524] text-base">
                      {language === 'bn' ? tc.titleBn : tc.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {language === 'bn' ? tc.descBn : tc.descEn}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-[#49665A]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'যাচাইকৃত মানদণ্ড' : 'Verified Standard'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 08: Passenger FAQ Accordion */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#C92232] uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>{language === 'bn' ? 'সাধারণ জিজ্ঞাসা' : 'Commuter Inquiries'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#272524]">
              {language === 'bn' ? 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী' : 'Frequently Asked Questions'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {language === 'bn'
                ? 'মেট্রো প্রভাতী সম্পর্কিত সাধারণ তথ্য, রুট ও যাত্রীসেবা বিষয়ক প্রশ্নোত্তর।'
                : 'Common answers regarding corridor schedules, fare rules, and reservation holds.'}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E5E0D8] shadow-sm overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm sm:text-base text-[#272524] hover:text-[#C92232] transition-colors"
                  >
                    <span>{language === 'bn' ? faq.qBn : faq.qEn}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#C92232]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {language === 'bn' ? faq.aBn : faq.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 09: Final Booking & Helpline Conversion Banner */}
        <section className="bg-[#272524] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-[#E5E0D8]/20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-[#C92232]/30 blur-3xl"
          />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#F2E4E2] border border-white/15">
              <span className="w-2 h-2 rounded-full bg-[#49665A] bg-emerald-400 animate-pulse" />
              <span>{language === 'bn' ? 'চট্টগ্রাম আর্টেরিয়াল ট্রানজিট' : 'Chattogram Arterial Transit'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {language === 'bn' ? (
                <>আজই আপনার আসন বুক করুন অথবা সরাসরি হেল্পলাইনে যোগাযোগ করুন</>
              ) : (
                <>Book Your Journey Today or Connect with Direct Dispatch</>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'bn'
                ? 'কাপ্তাই রাস্তার মাথা থেকে কাঠগড়—চট্টগ্রামের অন্যতম ব্যস্ত করিডোরে নির্ভরযোগ্য ও স্বাচ্ছন্দ্যময় ভ্রমণ।'
                : 'Connecting Kaptai Rastar Matha to Katgor. Reliable, predictable commuting across Chattogram.'}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/tickets"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C92232] hover:bg-[#A91D2A] text-white font-extrabold text-sm shadow-xl active:scale-95 transition-all"
              >
                <Ticket className="w-4 h-4" />
                <span>{language === 'bn' ? 'আসন নির্বাচন করুন' : 'Select Seat Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`tel:${INITIAL_HELPLINE.primaryNumber}`}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-sm transition-all"
              >
                <Phone className="w-4 h-4 text-[#F2E4E2]" />
                <span>{language === 'bn' ? `হেল্পলাইন: ${toBengaliDigits(INITIAL_HELPLINE.primaryNumber)}` : `Call: ${INITIAL_HELPLINE.primaryNumber}`}</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
