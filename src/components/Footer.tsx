'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, ShieldCheck, MapPin, AlertTriangle, Compass, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_HELPLINE } from '@/data/mockData';
import { toBengaliDigits } from '@/lib/fareCalculator';

export const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer className="border-t-4 border-[#C92232] bg-[#272524] pt-12 pb-12 text-slate-300 sm:pt-16 sm:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Terminal Route Connector Ribbon */}
        <div className="pb-10 mb-10 border-b border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-black/40 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#C92232] animate-pulse flex-shrink-0" />
              <div>
                <span className="font-mono text-[10px] font-bold text-[#F2E4E2] uppercase tracking-widest block">
                  CHATTOGRAM ARTERIAL CORRIDOR · LINE MP-01
                </span>
                <span className="text-base sm:text-lg font-black text-white font-display mt-0.5 block">
                  {language === 'bn' ? 'কাপ্তাই রাস্তার মাথা ⇄ কাঠগড় টার্মিনাল' : 'Kaptai Rastar Matha ⇄ Katgor Terminal'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
              <span className="bg-white/10 px-3 py-1 rounded-full text-white font-bold">24.9 KM</span>
              <span className="text-slate-600">•</span>
              <span>12 VERIFIED STOPS</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ACTIVE SERVICE
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Info & Transit Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-2xl overflow-hidden ring-2 ring-[#C92232]/40 bg-white flex items-center justify-center p-0.5 shadow-md">
                <Image
                  src="/logo.png"
                  alt="মেট্রো প্রভাতী লোগো"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
              <div>
                <span className="font-black text-xl text-white tracking-tight font-display">মেট্রো প্রভাতী</span>
                <span className="block text-[10px] uppercase font-bold text-[#F2E4E2] tracking-wider">
                  Metro Probati Transit Network
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {language === 'bn'
                ? 'চট্টগ্রাম নগরীর কাপ্তাই রাস্তার মাথা থেকে কাঠগড় করিডোরের রুট, ভাড়া, কাউন্টার ও যাত্রীসেবার নির্ভরযোগ্য তথ্য এক জায়গায়।'
                : 'Verified route, fare, counter, and passenger-service information for the Kaptai Rastar Matha to Katgor corridor in Chattogram.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#F2E4E2] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#C92232] flex-shrink-0" />
              <span>
                {language === 'bn'
                  ? 'যাচাইকৃত রুট, কাউন্টার ও যাত্রীসেবা'
                  : 'Verified route, counter & commuter services'}
              </span>
            </div>
          </div>

          {/* Corridor & Stops */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C92232]" />
              <span>{language === 'bn' ? 'প্রধান করিডোর স্টপেজ' : 'Key Corridor Stops'}</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C92232]" />
                <span>{language === 'bn' ? 'কাপ্তাই রাস্তার মাথা (মাস্টার টার্মিনাল)' : 'Kaptai Rastar Matha (Terminal)'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C92232]" />
                <span>{language === 'bn' ? 'বহদ্দারহাট • মুরাদপুর • ২ নম্বর গেট' : 'Bahaddarhat • Muradpur • 2 No Gate'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C92232]" />
                <span>{language === 'bn' ? 'জিইসি মোড় • ওয়াসা • দেওয়ানহাট' : 'GEC Circle • WASA • Dewanhat'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C92232]" />
                <span>{language === 'bn' ? 'চৌমুহনী • আগ্রাবাদ বাদামতলী • সল্টগোলা' : 'Chowmuhani • Agrabad Badamtoli • Saltgola'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C92232]" />
                <span>{language === 'bn' ? 'ইপিজেড (সিইপিজেড / কেইপিজেড)' : 'EPZ (CEPZ / KEPZ)'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C92232]" />
                <span>{language === 'bn' ? 'কাঠগড় (মাস্টার টার্মিনাল)' : 'Katgor (Terminal)'}</span>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
              <span>{language === 'bn' ? '১২টি অনুমোদিত স্টপেজ' : '12 listed stops'}</span>
              <span className="font-mono text-[#F2E4E2] font-bold">{language === 'bn' ? 'প্রায় ২৪.৯ কিমি করিডোর' : 'Approx. 24.9 km corridor'}</span>
            </div>
          </div>

          {/* Direct Navigation Links */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#C92232]" />
              <span>{language === 'bn' ? 'যাত্রী সেবা ও ডিরেক্টরি' : 'Commuter Portals'}</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/tracking" className="text-slate-300 hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C92232]" />
                  <span>{language === 'bn' ? 'বাসের জিপিএস আপডেট' : 'Bus GPS updates'}</span>
                </Link>
              </li>
              <li>
                <Link href="/tickets" className="text-slate-300 hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C92232]" />
                  <span>{language === 'bn' ? 'অনলাইন আসন বুকিং' : 'Online Seat Reservation'}</span>
                </Link>
              </li>
              <li>
                <Link href="/fares" className="text-slate-300 hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C92232]" />
                  <span>{language === 'bn' ? 'ভাড়া তালিকা ও ক্যালকুলেটর' : 'Fare Schedule & Calculator'}</span>
                </Link>
              </li>
              <li>
                <Link href="/routes" className="text-slate-300 hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C92232]" />
                  <span>{language === 'bn' ? 'রুট করিডোর ও স্টপ তালিকা' : 'Route Sequence & Corridor'}</span>
                </Link>
              </li>
              <li>
                <Link href="/counters" className="text-slate-300 hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C92232]" />
                  <span>{language === 'bn' ? 'কাউন্টার ডিরেক্টরি ও পয়েন্ট' : 'Counter Directory & Points'}</span>
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-slate-300 hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C92232]" />
                  <span>{language === 'bn' ? 'আমার প্রোফাইল ও ই-পাস' : 'My Profile & E-Pass'}</span>
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-[#F2E4E2] hover:text-white font-bold transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C92232]" />
                  <span>{language === 'bn' ? 'পোর্টাল লগইন / স্টাফ প্রবেশ' : 'Portal Sign In / Staff Access'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Helplines & Contact */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C92232]" />
              <span>{language === 'bn' ? 'হেল্পলাইন ও জরুরি সহায়তা' : 'Direct Support Hotline'}</span>
            </h4>
            <div className="space-y-3">
              <a
                href={`tel:${INITIAL_HELPLINE.primaryNumber}`}
                className="flex items-center gap-3 p-3.5 bg-black/40 hover:bg-black/60 rounded-2xl border border-slate-700/60 transition group"
              >
                <div className="p-2.5 rounded-xl bg-[#C92232] text-white group-hover:scale-105 transition-transform shadow-xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {language === 'bn' ? 'জরুরি যাত্রী হেল্পলাইন' : 'Emergency Transit Helpline'}
                  </div>
                  <div className="text-sm font-black text-white font-mono tracking-wide">
                    {toBengaliDigits(INITIAL_HELPLINE.primaryNumber)}
                  </div>
                </div>
              </a>

              <div className="pt-2 text-xs text-slate-400 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#F2E4E2]" />
                  <span>{language === 'bn' ? 'সকাল ০৬:০০ — রাত ১১:০০' : '06:00 AM — 11:00 PM'}</span>
                </div>
                <div className="text-slate-500">{language === 'bn' ? 'চট্টগ্রাম মেট্রোপলিটন এলাকা, বাংলাদেশ' : 'Chattogram Metropolitan Area, Bangladesh'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Official Ratification Disclaimer */}
        <div className="mt-8 rounded-2xl border-l-4 border-[#A87936] bg-white/[0.04] p-4 text-xs text-slate-400 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-[#A87936] flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {language === 'bn'
              ? 'ঘোষণা: ওয়েবসাইটে প্রদর্শিত সময়সূচি, স্টপ ও ভাড়ার তথ্য নির্দেশক খসড়া হিসেবে দেখানো হতে পারে। যাত্রার আগে কাউন্টারে বর্তমান সময়সূচি, চূড়ান্ত ভাড়া ও সেবার প্রাপ্যতা নিশ্চিত করুন।'
              : 'Notice: Schedules, stops and fare figures displayed on this website may be indicative draft information. Confirm current services, schedules and final fares at a counter before travelling.'}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} মেট্রো প্রভাতী (Metro Probati) Transit Platform. {language === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-300 transition">
              {language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-300 transition">
              {language === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}
            </Link>
            <span>•</span>
            <Link href="/incidents/report" className="hover:text-slate-300 transition">
              {language === 'bn' ? 'অভিযোগ ও হারানো মালামাল' : 'Incident & Lost Item'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
