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
} from 'lucide-react';
import { INITIAL_HELPLINE } from '@/data/mockData';

export default function HomePage() {
  const { language, t } = useLanguage();

  const faqs = [
    {
      qBn: 'মেট্রো প্রভাতীর বাস কোন কোন রুটে চলাচল করে?',
      qEn: 'Which corridor does Metro Probati operate on?',
      aBn: 'মেট্রো প্রভাতী কাপ্তাই রাস্তার মাথা থেকে বহদ্দারহাট, মুরাদপুর, ২ নম্বর গেট, জিইসি মোড়, ওয়াসা, দেওয়ানহাট, চৌমুহনী, আগ্রাবাদ, সল্টগোলা ক্রসিং ও ইপিজেড (কেইপিজেড) হয়ে কাঠগড় পর্যন্ত চলাচল করে।',
      aEn: 'Metro Probati operates on the Kaptai Rastar Matha ↔ Katgor corridor via Bahaddarhat, Muradpur, 2 No Gate, GEC Mor, WASA, Dewanhat, Chowmuhani, Agrabad, Saltgola, EPZ (KEPZ), and Kathgar.',
    },
    {
      qBn: 'ভাড়া তালিকা কি চূড়ান্ত?',
      qEn: 'Is the displayed fare chart finalized?',
      aBn: 'প্রদর্শিত ১৫–৬৫ টাকা পরিধির ভাড়া হালনাগাদকৃত নির্দেশক খসড়া (যেমন: বহদ্দারহাট থেকে কেইপিজেড ৫৫ টাকা)। মেট্রো প্রভাতী বাস মালিক কর্তৃপক্ষ এবং বিআরটিএ-এর অনুমোদিত চূড়ান্ত কাউন্টার তালিকা অচিরেই প্রকাশ করা হবে।',
      aEn: 'The ৳15–৳65 range is an updated pilot draft (e.g. Bahaddarhat to KEPZ ৳55). Official counter-specific fare tariffs approved by transit operators will be ratified soon.',
    },
    {
      qBn: 'বাস ট্র্যাকিং কি সত্যি রিয়েল-টাইম জিপিএস?',
      qEn: 'Is the bus tracking truly real-time GPS?',
      aBn: 'হ্যাঁ। আমাদের সিস্টেমে কোনো কৃত্রিম অ্যানিমেশন বা আনুমানিক লোকেশন দেখানো হয় না। চালকের সক্রিয় ডিভাইস থেকে সরাসরি প্রাপ্ত জিপিএস উপাত্তের ভিত্তিতেই বাস ম্যাপে অবস্থান করে। জিপিএস ৩ মিনিটের অধিক পুরনো হলে তা হলুদ (বিলম্বিত) এবং ১০ মিনিটের বেশি হলে অফলাইন প্রদর্শিত হয়।',
      aEn: 'Yes. We strictly guarantee genuine telemetry. Buses only appear with live coordinates received directly from active on-duty driver devices. If a ping is older than 3 minutes, it transitions to stale (yellow) and offline (gray) after 10 minutes.',
    },
    {
      qBn: 'অনলাইন টিকিট বুকিং ও আসন হোল্ড কীভাবে কাজ করে?',
      qEn: 'How does seat reservation and temporary hold work?',
      aBn: 'ওয়েবসাইটে আসন নির্বাচনের পর ৫ মিনিটের জন্য আসনটি আপনার ব্রাউজার সেশনে সাময়িকভাবে লক থাকে। নির্ধারিত সময়ের মধ্যে পেমেন্ট সম্পন্ন বা কাউন্টার থেকে কনফার্ম করলে আসন স্থায়ীভাবে নিশ্চিত হয়।',
      aEn: 'Once seats are selected, they are held exclusively for 5 minutes. Completing payment or counter confirmation commits the seats permanently.',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-12 pb-16">
      {/* Hero Section */}
      <Hero />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-16">
        {/* Bus Fleet Carousel */}
        <section id="bus-fleet-carousel" className="space-y-2 sm:space-y-4">
          <BusCarousel />
        </section>

        {/* Live Tracking Map Section */}
        <section id="tracking-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>{language === 'bn' ? 'সরাসরি উপগ্রহ সংযোগ' : 'Genuine Telemetry'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {t('tracking.title')}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {t('tracking.subtitle')}
              </p>
            </div>

            <Link
              href="/tracking"
              className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 self-start sm:self-auto"
            >
              <span>{language === 'bn' ? 'পূর্ণাঙ্গ ট্র্যাকিং স্ক্রিনে যান' : 'Open Full Screen Tracking'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <LiveTrackingMap />
        </section>

        {/* Fare Calculator Section */}
        <section id="fare-calculator-section" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {language === 'bn' ? 'কাউন্টার ভিত্তিক ভাড়া হিসাব করুন' : 'Calculate Counter Fares'}
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              {language === 'bn'
                ? 'চট্টগ্রাম শহরের যে কোনো দুই স্টপেজের মধ্যকার অনুমোদিত খসড়া পর্যায় এবং ভাড়ার পরিমাণ জেনে নিন।'
                : 'Lookup draft stages and indicative fare figures between any two corridor stops.'}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <FareCalculatorCard />
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
              {language === 'bn' ? 'আধুনিক গণপরিবহন' : 'Next-Gen Transit'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {language === 'bn' ? 'মেট্রো প্রভাতীর বিশেষ সেবাসমূহ' : 'Key Platform Capabilities'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-red-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                {language === 'bn' ? '১০০% বাস্তব জিপিএস ট্র্যাকিং' : 'Genuine GPS Verification'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {language === 'bn'
                  ? 'কোনো সিমুলেশন বা অনুমান নয়। চালকের সরাসরি অবস্থান, গতি এবং দিকনির্দেশক উপাত্ত প্রদর্শিত হয়।'
                  : 'Zero fabricated motion. Real coordinates, speed, and directional telemetry straight from the vehicle.'}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-red-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                {language === 'bn' ? '৫ মিনিটের পরমাণু আসন হোল্ড' : '5-Minute Atomic Seat Lease'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {language === 'bn'
                  ? 'একই আসন একাধিক যাত্রী নির্বাচন রোধ করতে ৫ মিনিটের টাইম-লক সিস্টেম, যা মেয়াদ শেষে স্বয়ংক্রিয়ভাবে অবমুক্ত হয়।'
                  : 'Double-booking prevention with an atomic 5-minute reservation lease and live countdown.'}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-red-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                {language === 'bn' ? 'নিয়ন্ত্রিত স্ট্যান্ডিং ক্যাপাসিটি' : 'Controlled Standing Limits'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {language === 'bn'
                  ? 'অতিরিক্ত ভিড় ঠেকাতে ১৫ জনের নিয়ন্ত্রিত অনুমোদিত স্ট্যান্ডিং স্পেস ট্র্যাকিং এবং সুপারভাইজার রিপোর্টিং।'
                  : 'Enforces a strict 15-passenger standing limit with real-time supervisor capacity logging.'}
              </p>
            </div>
          </div>
        </section>

        {/* Corridor Timeline & Stops */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                {language === 'bn' ? 'করিডোর নেটওয়ার্ক' : 'Transit Corridor'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {language === 'bn'
                  ? 'কাপ্তাই রাস্তার মাথা ↔ কাঠগড়'
                  : 'Kaptai Rastar Matha ↔ Katgor'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {language === 'bn'
                  ? '১২টি মূল স্টপ এবং কাউন্টারের ভৌগোলিক অবস্থান'
                  : 'Geographic sequence across 12 key corridor stops and counters'}
              </p>
            </div>

            <Link
              href="/routes"
              className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700"
            >
              <span>{language === 'bn' ? 'সকল স্টপের বিবরণ' : 'View Stop Sequence'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-sm">
            <RouteCorridorTimeline />
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {language === 'bn' ? 'সাধারণ জিজ্ঞাসা (FAQ)' : 'Frequently Asked Questions'}
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              {language === 'bn'
                ? 'মেট্রো প্রভাতী সেবা, ট্র্যাকিং ও ভাড়া সম্পর্কিত গুরুত্বপূর্ণ তথ্যাদি।'
                : 'Essential information regarding operations, booking, and fares.'}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-red-100 shadow-xs space-y-2 hover:border-red-200 transition"
              >
                <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{language === 'bn' ? faq.qBn : faq.qEn}</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 pl-6 leading-relaxed">
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
