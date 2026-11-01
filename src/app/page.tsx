'use client';

import React from 'react';
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

  const services = [
    {
      titleBn: 'সহজ অনলাইন আসন বুকিং',
      titleEn: 'Easy Seat Reservation',
      descBn: 'বাসের আসন বিন্যাস দেখে পছন্দমতো সিট নির্বাচন করুন। ৫ মিনিটের পরমাণু হোল্ড সুবিধা।',
      descEn: 'Interactive 38-seat visual bus layout with 5-minute atomic reservation lease.',
      icon: Ticket,
      href: '/tickets',
      badgeBn: 'ডিজিটাল ই-পাস',
      badgeEn: 'Instant QR Pass',
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
      titleBn: 'স্বচ্ছ ভাড়া ক্যালকুলেটর',
      titleEn: 'Transparent Fare Matrix',
      descBn: 'কাপ্তাই রাস্তার মাথা থেকে কাঠগড় করিডোরের যে কোনো দুই স্টপের দূরত্ব ভিত্তিক খসড়া ভাড়া।',
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
      titleBn: 'কাউন্টার নেটওয়ার্ক ও পয়েন্ট',
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
      descEn: 'Manage booking history, download printable receipts, and present digital boarding tokens.',
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
      descBn: 'ভাড়া সংক্রান্ত তথ্য, হারানো মালামাল উদ্ধার বা যে কোনো অনুসন্ধানে সকাল ৬:০০ থেকে রাত ১১:৩০ পর্যন্ত আমাদের হেল্পলাইনে সরাসরি যোগাযোগ করুন।',
      descEn: 'Prompt assistance for routes, lost-and-found recovery, and commuter guidance seven days a week.',
      icon: PhoneCall,
    },
  ];

  const faqs = [
    {
      qBn: 'মেট্রো প্রভাতীর বাস কোন কোন রুটে চলাচল করে?',
      qEn: 'Which corridor does Metro Probati operate on?',
      aBn: 'মেট্রো প্রভাতী কাপ্তাই রাস্তার মাথা থেকে বহদ্দারহাট, মুরাদপুর, ২ নম্বর গেট, জিইসি মোড়, ওয়াসা, দেওয়ানহাট, চৌমুহনী, আগ্রাবাদ, সল্টগোলা ক্রসিং ও ইপিজেড (সিইপিজেড / কেইপিজেড) হয়ে কাঠগড় ডায়াগনস্টিক অ্যান্ড রিসার্চ সেন্টার (জালাল মার্কেট) পর্যন্ত চলাচল করে।',
      aEn: 'Metro Probati operates on the Kaptai Rastar Matha ↔ Katgor corridor via Bahaddarhat, Muradpur, 2 No Gate, GEC Mor, WASA, Dewanhat, Chowmuhani, Agrabad, Saltgola, EPZ (KEPZ), and Katgor.',
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
      aEn: 'Once seats are selected, they are held exclusively for 5 minutes. Completing payment or counter confirmation commits the seats permanently with a QR digital pass.',
    },
    {
      qBn: 'শিক্ষার্থীদের জন্য কি কোনো বিশেষ ছাড় আছে?',
      qEn: 'Is there a student concession available?',
      aBn: 'হ্যাঁ, শিক্ষার্থীদের বৈধ পরিচয়পত্র প্রদর্শন সাপেক্ষে কাউন্টার টিকিটে ৫% বিশেষ ছাড় প্রযোজ্য হয়। বিস্তারিত জানতে আমাদের হেল্পলাইনে যোগাযোগ করতে পারেন।',
      aEn: 'Yes, a 5% student concession is supported upon displaying a valid student ID card at ticket counters.',
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-20 pb-20">
      {/* SECTION 02 & 03: Flagship Cinematic Hero & Integrated Journey Planner */}
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* SECTION 04: Passenger Services Overview Grid */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-red-600 uppercase tracking-widest bg-red-50 border border-red-200 px-3 py-1 rounded-full">
              {language === 'bn' ? 'যাত্রী সেবা ও প্রযুক্তি' : 'Transit Intelligence'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {language === 'bn' ? 'মেট্রো প্রভাতীর ডিজিটাল সেবাসমূহ' : 'Core Passenger Capabilities'}
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              {language === 'bn'
                ? 'চট্টগ্রাম নগরীতে আরামদায়ক ও নির্ভরযোগ্য ভ্রমণের জন্য আমাদের প্রতিটি সেবা সহজ ও নিখুঁতভাবে তৈরি।'
                : 'Engineered for seamless everyday commuting across Chattogram with transparency and ease.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <Link
                  key={idx}
                  href={svc.href}
                  className="group bg-white rounded-3xl p-6 sm:p-7 border border-red-100 shadow-sm hover:shadow-xl hover:border-red-300 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-200 shadow-xs">
                        <Icon className="w-6 h-6 stroke-[2.2]" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 group-hover:bg-red-50 group-hover:text-red-700 transition-colors">
                        {language === 'bn' ? svc.badgeBn : svc.badgeEn}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-red-600 transition-colors">
                        {language === 'bn' ? svc.titleBn : svc.titleEn}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2">
                        {language === 'bn' ? svc.descBn : svc.descEn}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-red-600 group-hover:text-red-700">
                    <span>{language === 'bn' ? 'ব্যবহার করুন' : 'Explore Service'}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SECTION 05: Live Satellite Telemetry Tracking Preview */}
        <section id="tracking-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-red-600 uppercase tracking-wider mb-1">
                <Compass className="w-4 h-4" />
                <span>{language === 'bn' ? 'সরাসরি উপগ্রহ সংযোগ' : 'Genuine Satellite GPS'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                {t('tracking.title')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                {t('tracking.subtitle')}
              </p>
            </div>

            <Link
              href="/tracking"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-red-600/20 active:scale-95 transition-all self-start sm:self-auto"
            >
              <span>{language === 'bn' ? 'পূর্ণাঙ্গ ট্র্যাকিং স্ক্রিনে যান' : 'Open Full Screen Tracking'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <LiveTrackingMap />
        </section>

        {/* SECTION 06: Corridor Route Discovery */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black text-red-600 uppercase tracking-wider">
                {language === 'bn' ? 'করিডোর নেটওয়ার্ক' : 'Express Corridor'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {language === 'bn'
                  ? 'কাপ্তাই রাস্তার মাথা ↔ কাঠগড়'
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
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 hover:underline"
            >
              <span>{language === 'bn' ? 'সকল স্টপের বিস্তারিত দেখুন' : 'View Stop Sequence'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-sm">
            <RouteCorridorTimeline />
          </div>
        </section>

        {/* SECTION 07: Authentic Fleet Showcase */}
        <section id="fleet-showcase" className="space-y-4">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-xs font-black text-red-600 uppercase tracking-widest bg-red-50 border border-red-200 px-3 py-1 rounded-full">
              {language === 'bn' ? 'আমাদের বহর' : 'Official Fleet'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {language === 'bn' ? 'মেট্রো প্রভাতী আধুনিক বাস বহর' : 'Metro Probati Bus Fleet'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {language === 'bn'
                ? 'চট্টগ্রাম নগরীতে প্রতিদিন চলাচলরত অশোক লেল্যান্ড কাউন্টার এক্সপ্রেস বাসের বাস্তব আলোকচিত্র ও সুবিধাসমূহ।'
                : 'Authentic photos and specifications of our daily operational express fleet across Chattogram.'}
            </p>
          </div>

          <BusCarousel />
        </section>

        {/* SECTION 08: Fare Information & Calculator */}
        <section id="fare-calculator-section" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-red-600 uppercase tracking-widest bg-red-50 border border-red-200 px-3 py-1 rounded-full">
              {language === 'bn' ? 'স্বচ্ছ ভাড়া তালিকা' : 'Transparent Pricing'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {language === 'bn' ? 'কাউন্টার ভিত্তিক ভাড়া হিসাব করুন' : 'Calculate Counter Fares'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {language === 'bn'
                ? 'চট্টগ্রাম শহরের যে কোনো দুই স্টপেজের মধ্যকার অনুমোদিত খসড়া পর্যায় এবং ভাড়ার পরিমাণ জেনে নিন।'
                : 'Lookup ratified draft stages and indicative fare figures between any two corridor stops.'}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <FareCalculatorCard />
          </div>
        </section>

        {/* SECTION 09: Brand Trust & Operational Integrity */}
        <section className="bg-gradient-to-br from-red-600 via-red-600 to-red-700 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-red-500 space-y-8">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30 backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>{language === 'bn' ? 'বিশ্বাস ও নির্ভরযোগ্যতা' : 'Operational Trust & Integrity'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {language === 'bn'
                ? 'কেন মেট্রো প্রভাতী আপনার প্রথম পছন্দ?'
                : 'Why Commuters Rely on Metro Probati'}
            </h2>
            <p className="text-xs sm:text-sm text-red-100 leading-relaxed font-medium">
              {language === 'bn'
                ? 'আমরা কৃত্রিম প্রতিশ্রুতি নয়, বরং প্রযুক্তি ও আন্তরিক সেবায় বিশ্বাসী। যাত্রীদের প্রতিটি মুহূর্তকে নিরাপদ ও সময়ানুবর্তী করতে আমাদের দল বদ্ধপরিকর।'
                : 'Delivering dependable urban mobility through authentic GPS telemetry, disciplined crews, and transparent fares.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trustCommitments.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-white text-red-600 flex items-center justify-center font-bold shadow-md">
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <h3 className="font-extrabold text-white text-base sm:text-lg">
                    {language === 'bn' ? item.titleBn : item.titleEn}
                  </h3>
                  <p className="text-xs text-red-100 leading-relaxed">
                    {language === 'bn' ? item.descBn : item.descEn}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white text-red-600">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-red-100 font-bold uppercase">জরুরি হেল্পলাইন</div>
                <div className="text-sm font-black text-white font-mono">{INITIAL_HELPLINE.primaryNumber}</div>
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-red-700 hover:bg-red-50 active:scale-95 font-bold text-xs rounded-xl transition shadow-md"
            >
              <span>{language === 'bn' ? 'যোগাযোগ কেন্দ্রে যান' : 'Contact Support'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* SECTION 10: Frequently Asked Questions (FAQ) */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black text-red-600 uppercase tracking-widest bg-red-50 border border-red-200 px-3 py-1 rounded-full">
              {language === 'bn' ? 'সাধারণ জিজ্ঞাসা' : 'Got Questions?'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {language === 'bn' ? 'সাধারণ জিজ্ঞাসা (FAQ)' : 'Frequently Asked Questions'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {language === 'bn'
                ? 'মেট্রো প্রভাতী সেবা, রিয়েল-টাইম জিপিএস ও ভাড়া সম্পর্কিত জরুরি তথ্যাদি।'
                : 'Everything you need to know about operations, booking holds, and fares.'}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3.5">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-red-100 shadow-xs space-y-2 hover:border-red-300 transition"
              >
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{language === 'bn' ? faq.qBn : faq.qEn}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 pl-6 sm:pl-7 leading-relaxed">
                  {language === 'bn' ? faq.aBn : faq.aEn}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
