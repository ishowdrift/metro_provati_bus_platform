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
      number: '01',
      icon: Ticket,
      titleBn: 'অনলাইন টিকিট',
      titleEn: 'Online tickets',
      descBn: 'আসন বিন্যাস দেখুন, পছন্দের আসন নির্বাচন করুন এবং বুকিং প্রক্রিয়া অনুসরণ করুন।',
      descEn: 'Explore the seat layout, choose your seats and follow the booking flow.',
      href: '/tickets',
      labelBn: 'টিকিট বুক করুন',
      labelEn: 'Book a ticket',
    },
    {
      number: '02',
      icon: Navigation,
      titleBn: 'বাসের অবস্থান',
      titleEn: 'Bus location',
      descBn: 'সর্বশেষ পাওয়া জিপিএস তথ্য ও অবস্থানের সময় দেখে যাত্রা পরিকল্পনা করুন।',
      descEn: 'Check the latest received GPS information and its timestamp before travelling.',
      href: '/tracking',
      labelBn: 'ট্র্যাকিং দেখুন',
      labelEn: 'Open tracking',
    },
    {
      number: '03',
      icon: MapPin,
      titleBn: 'রুট ও স্টপেজ',
      titleEn: 'Routes & stops',
      descBn: 'কাপ্তাই রাস্তার মাথা থেকে কাঠগড় পর্যন্ত স্টপগুলোর ক্রম ও অবস্থান জানুন।',
      descEn: 'See the stop sequence along the Kaptai Rastar Matha to Katgor corridor.',
      href: '/routes',
      labelBn: 'রুট দেখুন',
      labelEn: 'Explore route',
    },
    {
      number: '04',
      icon: CreditCard,
      titleBn: 'ভাড়া ক্যালকুলেটর',
      titleEn: 'Fare calculator',
      descBn: 'শুরু ও গন্তব্য নির্বাচন করে নির্দেশক খসড়া ভাড়া সম্পর্কে ধারণা নিন।',
      descEn: 'Select your origin and destination to preview the indicative draft fare.',
      href: '/fares',
      labelBn: 'ভাড়া হিসাব করুন',
      labelEn: 'Calculate fare',
    },
    {
      number: '05',
      icon: Building2,
      titleBn: 'কাউন্টার ডিরেক্টরি',
      titleEn: 'Counter directory',
      descBn: 'কাউন্টার পয়েন্ট, ঠিকানা ও প্রকাশিত যোগাযোগের তথ্য খুঁজে নিন।',
      descEn: 'Find counter points, addresses and the contact details currently listed.',
      href: '/counters',
      labelBn: 'কাউন্টার খুঁজুন',
      labelEn: 'Find a counter',
    },
    {
      number: '06',
      icon: UserRound,
      titleBn: 'যাত্রী প্রোফাইল',
      titleEn: 'Passenger profile',
      descBn: 'আপনার অ্যাকাউন্ট ও টিকিট সংক্রান্ত তথ্যের জন্য প্রোফাইল দেখুন।',
      descEn: 'Visit your profile for account and ticket-related information.',
      href: '/profile',
      labelBn: 'প্রোফাইল দেখুন',
      labelEn: 'View profile',
    },
  ];

  const faqs = [
    {
      qBn: 'মেট্রো প্রভাতীর রুট কোথা থেকে কোথায়?',
      qEn: 'Where does the Metro Probati corridor run?',
      aBn: 'তালিকাভুক্ত করিডোরটি কাপ্তাই রাস্তার মাথা থেকে কাঠগড় পর্যন্ত। মাঝের স্টপগুলোর ক্রম ও ঠিকানা রুট পেজে দেওয়া আছে।',
      aEn: 'The listed corridor runs from Kaptai Rastar Matha to Katgor. The route page contains the current stop sequence and addresses.',
    },
    {
      qBn: 'ওয়েবসাইটে দেখানো ভাড়া কি চূড়ান্ত?',
      qEn: 'Are the fares shown on the website final?',
      aBn: 'না। ক্যালকুলেটরে দেখানো অঙ্কগুলো নির্দেশক খসড়া ভাড়া। যাত্রার আগে কাউন্টারে চূড়ান্ত ভাড়া নিশ্চিত করুন।',
      aEn: 'No. Figures in the calculator are indicative draft fares. Confirm the final amount at a counter before travelling.',
    },
    {
      qBn: 'বাসের জিপিএস অবস্থান কখন দেখা যাবে?',
      qEn: 'When will a bus GPS location appear?',
      aBn: 'সুপারভাইজারের ডিভাইস থেকে জিপিএস আপডেট পাওয়া গেলে অবস্থান দেখা যাবে। নতুন আপডেট না থাকলে বাসকে লাইভ হিসেবে দেখানো হবে না।',
      aEn: 'A location can appear after a supervisor device sends a GPS update to the service. Without a fresh update, the system should not present a bus as live.',
    },
    {
      qBn: 'অনলাইন পেমেন্ট কি চালু আছে?',
      qEn: 'Are online payments live?',
      aBn: 'বর্তমান অনলাইন পেমেন্ট প্রবাহটি স্যান্ডবক্স বা পরীক্ষামূলক। বাস্তব পেমেন্ট সম্পন্ন হয়েছে—এমন ধরে নেবেন না।',
      aEn: 'The current online payment flow is a sandbox/demo experience. Do not treat it as a completed real-money payment.',
    },
  ];

  return (
    <div className="bg-[#FAF9F7] pb-20 text-stone-900">
      <Hero />

      <div className="mx-auto max-w-[1240px] space-y-20 px-4 pt-16 sm:space-y-28 sm:px-6 sm:pt-24 lg:px-8">
        <section aria-labelledby="services-heading" className="space-y-9">
          <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <div className="mb-3 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#C92232]">
                <span className="h-px w-7 bg-[#C92232]" />
                <span>{language === 'bn' ? 'যাত্রীসেবা' : 'Passenger services'}</span>
              </div>
              <h2 id="services-heading" className="max-w-[520px] text-3xl font-black leading-[1.12] tracking-[-0.04em] text-stone-950 sm:text-4xl">
                {language === 'bn' ? 'আপনার যাত্রার প্রয়োজনীয় সবকিছু।' : 'Everything you need for the journey.'}
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-stone-600 md:justify-self-end">
              {language === 'bn'
                ? 'রুট দেখা থেকে শুরু করে ভাড়া বোঝা, টিকিটের ধাপ অনুসরণ কিংবা কাউন্টার খুঁজে পাওয়া—প্রয়োজনীয় সেবাগুলো এক জায়গায়।'
                : 'From checking the route and understanding indicative fares to following the ticket flow or finding a counter, the essentials are gathered in one place.'}
            </p>
          </div>

          <div className="grid gap-x-10 md:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  href={service.href}
                  key={service.number}
                  className="group grid grid-cols-[42px_1fr_auto] items-start gap-4 border-t border-stone-300 py-6 transition-all duration-200 hover:border-[#C92232] hover:bg-white/50 -mx-3 px-3 sm:-mx-4 sm:px-4"
                >
                  <span className="pt-1 font-mono text-xs font-bold tracking-wider text-stone-400 group-hover:text-[#C92232] transition-colors">
                    {service.number}
                  </span>
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Icon className="h-4 w-4 text-[#C92232] transition-transform duration-200 group-hover:scale-110" strokeWidth={1.8} />
                      <h3 className="text-base font-extrabold tracking-tight text-stone-900 transition-colors group-hover:text-[#C92232] sm:text-lg">
                        {language === 'bn' ? service.titleBn : service.titleEn}
                      </h3>
                    </div>
                    <p className="max-w-md text-xs leading-6 text-stone-500 sm:text-sm">
                      {language === 'bn' ? service.descBn : service.descEn}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-2 text-[11px] font-extrabold text-[#C92232]">
                      {language === 'bn' ? service.labelBn : service.labelEn}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 text-stone-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#C92232]" />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="relative isolate grid overflow-hidden bg-[#211F1F] text-white lg:grid-cols-[0.95fr_1.05fr]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 -top-32 h-[380px] w-[380px] rounded-full bg-[#C92232]/15 blur-[90px] animate-ambient-drift"
          />

          <div className="relative z-10 flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
            <div className="mb-4 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#F18A91]">
              <span className="h-px w-7 bg-[#F18A91]" />
              <span>{language === 'bn' ? 'অবস্থান ও আপডেট' : 'Location & updates'}</span>
            </div>
            <h2 className="max-w-lg text-3xl font-black leading-[1.12] tracking-[-0.04em] sm:text-4xl">
              {language === 'bn' ? 'যাত্রার আগে সর্বশেষ তথ্য জেনে নিন।' : 'Know what is available before you travel.'}
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/70">
              {language === 'bn'
                ? 'জিপিএস তথ্য পাওয়া গেলে ট্র্যাকিং পেজে অবস্থান ও আপডেটের সময় দেখুন। কোনো নতুন তথ্য না থাকলে সেটিকে লাইভ হিসেবে ধরে নেবেন না।'
                : 'When GPS data is received, the tracking page shows the location and update time. When no fresh update is available, the bus will not be shown as live.'}
            </p>
            <Link
              href="/tracking"
              className="mt-8 inline-flex min-h-12 w-fit items-center gap-3 bg-white px-5 py-3 text-sm font-extrabold text-[#A91D2A] transition-all duration-200 hover:bg-[#FFF4F4] active:scale-[0.99]"
            >
              <Navigation className="h-4 w-4" />
              <span>{language === 'bn' ? 'ট্র্যাকিং পেজ খুলুন' : 'Open bus tracking'}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-5 text-xs text-white/60">
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-[#F18A91]" />
                {language === 'bn' ? 'আপডেটের সময় দেখুন' : 'Check update time'}
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#F18A91]" />
                {language === 'bn' ? 'লাইভ ও পুরোনো তথ্য আলাদা' : 'Live and older data distinguished'}
              </span>
            </div>
          </div>
          <div className="relative min-h-[300px] overflow-hidden sm:min-h-[420px]">
            <Image
              src="/images/bus-2.jpg"
              alt={language === 'bn' ? 'মেট্রো প্রভাতী বাসের ছবি' : 'Metro Probati bus photograph'}
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#211F1F]/45 via-transparent to-black/10" />
            <div className="absolute bottom-5 left-5 border-l-2 border-[#C92232] bg-black/50 px-4 py-3 backdrop-blur-sm sm:bottom-8 sm:left-8">
              <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/70">{language === 'bn' ? 'মেট্রো প্রভাতী' : 'Metro Probati'}</div>
              <div className="mt-1 text-lg font-extrabold text-white">{language === 'bn' ? 'চট্টগ্রাম করিডোর' : 'Chattogram corridor'}</div>
            </div>
          </div>
        </section>

        <section aria-labelledby="route-heading" className="space-y-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#C92232]">
                <span className="h-px w-7 bg-[#C92232]" />
                <span>{language === 'bn' ? 'প্রধান করিডোর' : 'The main corridor'}</span>
              </div>
              <h2 id="route-heading" className="text-3xl font-black tracking-[-0.04em] text-stone-950 sm:text-4xl">
                {language === 'bn' ? 'কাপ্তাই রাস্তার মাথা — কাঠগড়' : 'Kaptai Rastar Matha — Katgor'}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-500">
                {language === 'bn'
                  ? 'মাঝের স্টপগুলো ধারাবাহিকভাবে দেখুন এবং আপনার কাছের পয়েন্টটি খুঁজে নিন।'
                  : 'Follow the listed stops in sequence and find the point closest to your journey.'}
              </p>
            </div>
            <Link href="/routes" className="inline-flex items-center gap-2 border-b border-[#C92232] pb-2 text-xs font-extrabold text-[#C92232] transition-colors hover:text-[#A91D2A]">
              <span>{language === 'bn' ? 'সম্পূর্ণ রুট দেখুন' : 'View full route'}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-8 border-y border-stone-300 bg-white p-5 sm:p-8 lg:grid-cols-[0.38fr_0.62fr] lg:gap-14 lg:p-10 shadow-xs">
            <div className="flex flex-col justify-between gap-8">
              <div>
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">MP — 01</div>
                <p className="mt-4 text-5xl font-black tracking-[-0.06em] text-[#C92232]">12</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-stone-500">
                  {language === 'bn' ? 'তালিকাভুক্ত স্টপ' : 'Listed stops'}
                </p>
              </div>
              <div className="border-l-2 border-[#C92232] pl-4">
                <div className="text-sm font-extrabold text-stone-900">
                  {language === 'bn' ? 'দুই প্রান্তের সংযোগ' : 'A corridor between two ends'}
                </div>
                <p className="mt-2 text-xs leading-6 text-stone-500">
                  {language === 'bn' ? 'রুট ও কাউন্টার তথ্য পরিবর্তিত হতে পারে। যাত্রার আগে সর্বশেষ তথ্য নিশ্চিত করুন।' : 'Route and counter details may change. Confirm current information before travelling.'}
                </p>
              </div>
            </div>
            <div className="lg:border-l lg:border-stone-200 lg:pl-10">
              <RouteCorridorTimeline />
            </div>
          </div>
        </section>

        <section aria-labelledby="fleet-heading" className="space-y-7">
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#C92232]">
                <span className="h-px w-7 bg-[#C92232]" />
                <span>{language === 'bn' ? 'বাসের ছবি' : 'Fleet gallery'}</span>
              </div>
              <h2 id="fleet-heading" className="text-3xl font-black tracking-[-0.04em] text-stone-950 sm:text-4xl">
                {language === 'bn' ? 'মেট্রো প্রভাতী বহর' : 'The Metro Probati fleet'}
              </h2>
            </div>
            <p className="max-w-sm text-xs leading-6 text-stone-500">
              {language === 'bn' ? 'প্রকাশিত ছবিগুলো দেখুন। আসন, সময়সূচি ও যানবাহনের সুবিধা কাউন্টারে নিশ্চিত করুন।' : 'Explore the published photographs. Confirm seating, schedules and vehicle details at a counter.'}
            </p>
          </div>
          <BusCarousel />
        </section>

        <section aria-labelledby="fare-heading" className="space-y-8">
          <div className="grid gap-5 md:grid-cols-[0.82fr_1.18fr] md:items-end">
            <div>
              <div className="mb-3 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#C92232]">
                <span className="h-px w-7 bg-[#C92232]" />
                <span>{language === 'bn' ? 'ভাড়া জানুন' : 'Fare information'}</span>
              </div>
              <h2 id="fare-heading" className="max-w-md text-3xl font-black leading-[1.12] tracking-[-0.04em] text-stone-950 sm:text-4xl">
                {language === 'bn' ? 'যাত্রার আগে ভাড়ার ধারণা নিন।' : 'Get a fare estimate before you go.'}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-stone-500">
                {language === 'bn'
                  ? 'এটি নির্দেশক খসড়া হিসাব। চূড়ান্ত ভাড়া ও প্রযোজ্য নিয়ম কাউন্টার থেকে নিশ্চিত করুন।'
                  : 'This is an indicative draft calculation. Confirm the final fare and applicable rules at a counter.'}
              </p>
              <Link href="/fares" className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold text-[#C92232] hover:text-[#A91D2A] transition-colors">
                <span>{language === 'bn' ? 'সম্পূর্ণ ভাড়া তথ্য' : 'Full fare information'}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <FareCalculatorCard />
          </div>
        </section>

        <section className="grid gap-8 border-y border-stone-300 py-9 sm:grid-cols-3 sm:gap-10 sm:py-12">
          <div>
            <div className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C92232]">01 / ROUTE</div>
            <h3 className="text-base font-extrabold text-stone-900">{language === 'bn' ? 'রুটের তথ্য' : 'Route information'}</h3>
            <p className="mt-2 text-xs leading-6 text-stone-500">{language === 'bn' ? 'স্টপ ও ঠিকানার তালিকা এক জায়গায়।' : 'A central list of stops and addresses.'}</p>
          </div>
          <div>
            <div className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C92232]">02 / FARE</div>
            <h3 className="text-base font-extrabold text-stone-900">{language === 'bn' ? 'স্বচ্ছ নির্দেশক হিসাব' : 'Clear fare estimates'}</h3>
            <p className="mt-2 text-xs leading-6 text-stone-500">{language === 'bn' ? 'খসড়া ভাড়াকে চূড়ান্ত ভাড়া বলে উপস্থাপন করা হয় না।' : 'Draft estimates are not presented as final approved fares.'}</p>
          </div>
          <div>
            <div className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C92232]">03 / SUPPORT</div>
            <h3 className="text-base font-extrabold text-stone-900">{language === 'bn' ? 'সরাসরি যোগাযোগ' : 'Direct assistance'}</h3>
            <p className="mt-2 text-xs leading-6 text-stone-500">{language === 'bn' ? 'প্রয়োজনে প্রকাশিত হেল্পলাইন বা কাউন্টারের সঙ্গে যোগাযোগ করুন।' : 'Contact the published helpline or a counter when you need assistance.'}</p>
          </div>
        </section>

        <section aria-labelledby="faq-heading" className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <div className="mb-3 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#C92232]">
              <span className="h-px w-7 bg-[#C92232]" />
              <span>{language === 'bn' ? 'সাধারণ প্রশ্ন' : 'Help & information'}</span>
            </div>
            <h2 id="faq-heading" className="text-3xl font-black tracking-[-0.04em] text-stone-950 sm:text-4xl">
              {language === 'bn' ? 'জানার মতো কিছু বিষয়।' : 'A few things to know.'}
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-500">
              {language === 'bn' ? 'আরও সহায়তার জন্য আমাদের সঙ্গে যোগাযোগ করুন।' : 'For additional help, contact the team.'}
            </p>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold text-[#C92232] hover:text-[#A91D2A] transition-colors">
              <span>{language === 'bn' ? 'যোগাযোগ করুন' : 'Contact us'}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="border-t border-stone-300">
            {faqs.map((faq, index) => (
              <details key={index} className="group border-b border-stone-300 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-extrabold text-stone-900 marker:hidden">
                  <span className="flex items-start gap-3">
                    <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#C92232]" />
                    <span>{language === 'bn' ? faq.qBn : faq.qEn}</span>
                  </span>
                  <span className="text-xl font-light text-stone-400 transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <p className="pl-7 pr-7 pt-4 text-xs leading-7 text-stone-500 sm:text-sm">
                  {language === 'bn' ? faq.aBn : faq.aEn}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-[#C92232] px-6 py-9 text-white sm:px-10 sm:py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -bottom-32 h-[340px] w-[340px] rounded-full bg-white/10 blur-[80px] animate-ambient-drift"
          />

          <div className="relative z-10 flex flex-col justify-between gap-7 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.24em] text-white/70">
                <span className="h-px w-7 bg-white/70" />
                <span>{language === 'bn' ? 'সরাসরি সহায়তা' : 'Speak to the team'}</span>
              </div>
              <h2 className="text-2xl font-black tracking-[-0.035em] sm:text-3xl">
                {language === 'bn' ? 'যাত্রা সম্পর্কে প্রশ্ন আছে?' : 'Have a question about your journey?'}
              </h2>
              <p className="mt-2 text-xs leading-6 text-white/80 sm:text-sm">
                {language === 'bn' ? 'ভাড়া, রুট বা কাউন্টার সম্পর্কে জানতে যোগাযোগ করুন।' : 'Get in touch for route, fare or counter information.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={'tel:' + INITIAL_HELPLINE.primaryNumber}
                className="inline-flex min-h-12 items-center gap-2 bg-white px-5 py-3 text-sm font-extrabold text-[#A91D2A] transition-all duration-200 hover:bg-[#FFF4F4] active:scale-[0.99]"
              >
                <Phone className="h-4 w-4" />
                <span>{language === 'bn' ? 'কল করুন' : 'Call us'}</span>
              </a>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center gap-2 border border-white/60 px-5 py-3 text-sm font-extrabold text-white transition-all duration-200 hover:bg-white/10 active:scale-[0.99]"
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
