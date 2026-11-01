'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, ShieldCheck, MapPin, Mail, ExternalLink, AlertTriangle, Compass, Ticket, Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_HELPLINE } from '@/data/mockData';

export const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer className="border-t-2 border-[#C92232] bg-[#211F1F] pt-12 pb-12 text-stone-300 sm:pt-16 sm:pb-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Info & Transit Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-none overflow-hidden ring-2 ring-red-500/30 bg-white flex items-center justify-center p-0.5">
                <Image
                  src="/logo.png"
                  alt="মেট্রো প্রভাতী লোগো"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain rounded-none"
                  unoptimized
                />
              </div>
              <div>
                <span className="font-black text-xl text-white tracking-tight">মেট্রো প্রভাতী</span>
                <span className="block text-[10px] uppercase font-bold text-red-400 tracking-wider">
                  Metro Probati Transit Network
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {language === 'bn'
                ? 'চট্টগ্রাম নগরীর কাপ্তাই রাস্তার মাথা থেকে কাঠগড় করিডোরের রুট, ভাড়া, কাউন্টার ও যাত্রীসেবার তথ্য এক জায়গায়।'
                : 'Route, fare, counter and passenger-service information for the Kaptai Rastar Matha to Katgor corridor in Chattogram.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-red-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>
                {language === 'bn'
                  ? 'রুট, কাউন্টার ও যাত্রীসেবার তথ্য'
                  : 'Route, counter and passenger information'}
              </span>
            </div>
          </div>

          {/* Corridor & Stops */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>{language === 'bn' ? 'প্রধান করিডোর স্টপেজ' : 'Key Corridor Stops'}</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>কাপ্তাই রাস্তার মাথা (মাস্টার টার্মিনাল)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>বহদ্দারহাট • মুরাদপুর • ২ নম্বর গেট</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>জিইসি মোড় • ওয়াসা • দেওয়ানহাট</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>চৌমুহনী • আগ্রাবাদ বাদামতলী • সল্টগোলা</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>ইপিজেড (সিইপিজেড / কেইপিজেড)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>কাঠগড় (মাস্টার টার্মিনাল)</span>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-500 flex items-center justify-between">
              <span>১২টি প্রধান স্টপেজ</span>
              <span className="font-mono text-red-400 font-bold">প্রায় ২৪.৯ কিমি করিডোর</span>
            </div>
          </div>

          {/* Direct Navigation Links */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-red-500" />
              <span>{language === 'bn' ? 'যাত্রী সেবা ও ডিরেক্টরি' : 'Commuter Portals'}</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/tracking" className="text-slate-300 hover:text-white hover:underline transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>{language === 'bn' ? 'বাসের জিপিএস আপডেট' : 'Bus GPS updates'}</span>
                </Link>
              </li>
              <li>
                <Link href="/tickets" className="text-slate-300 hover:text-white hover:underline transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>{language === 'bn' ? 'অনলাইন আসন বুকিং' : 'Online Seat Reservation'}</span>
                </Link>
              </li>
              <li>
                <Link href="/fares" className="text-slate-300 hover:text-white hover:underline transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>{language === 'bn' ? 'ভাড়া তালিকা ও ক্যালকুলেটর' : 'Fare Schedule & Calculator'}</span>
                </Link>
              </li>
              <li>
                <Link href="/routes" className="text-slate-300 hover:text-white hover:underline transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>{language === 'bn' ? 'রুট করিডোর ও স্টপ তালিকা' : 'Route Sequence & Corridor'}</span>
                </Link>
              </li>
              <li>
                <Link href="/counters" className="text-slate-300 hover:text-white hover:underline transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>{language === 'bn' ? 'কাউন্টার ডিরেক্টরি ও পয়েন্ট' : 'Counter Directory & Points'}</span>
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-slate-300 hover:text-white hover:underline transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span>{language === 'bn' ? 'আমার প্রোফাইল ও ই-পাস' : 'My Profile & E-Pass'}</span>
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-red-400 hover:text-red-300 font-bold transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span>{language === 'bn' ? 'পোর্টাল লগইন / স্টাফ প্রবেশ' : 'Portal Sign In / Staff Access'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Helplines & Contact */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-500" />
              <span>{language === 'bn' ? 'হেল্পলাইন ও জরুরি সহায়তা' : 'Direct Support Hotline'}</span>
            </h4>
            <div className="space-y-3">
              <a
                href={`tel:${INITIAL_HELPLINE.primaryNumber}`}
                className="flex items-center gap-3 p-3 bg-slate-900 rounded-none hover:bg-slate-850 hover:border-red-500/50 transition border border-slate-800 block group"
              >
                <div className="p-2 bg-red-600 text-white rounded-none group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {language === 'bn' ? INITIAL_HELPLINE.primaryLabelBn : INITIAL_HELPLINE.primaryLabelEn}
                  </div>
                  <div className="text-sm font-black text-white font-mono tracking-wide">
                    {INITIAL_HELPLINE.primaryNumber}
                  </div>
                </div>
              </a>

              <a
                href={`tel:${INITIAL_HELPLINE.secondaryNumber}`}
                className="flex items-center gap-3 p-3 bg-slate-900 rounded-none hover:bg-slate-850 hover:border-red-500/50 transition border border-slate-800 block group"
              >
                <div className="p-2 bg-red-950 text-red-300 rounded-none border border-red-800 group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {language === 'bn' ? INITIAL_HELPLINE.secondaryLabelBn : INITIAL_HELPLINE.secondaryLabelEn}
                  </div>
                  <div className="text-sm font-black text-white font-mono tracking-wide">
                    {INITIAL_HELPLINE.secondaryNumber}
                  </div>
                </div>
              </a>

              <div className="pt-2 text-xs text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-red-400" />
                  <span>কাউন্টারে যোগাযোগ করে বর্তমান সেবার সময় নিশ্চিত করুন</span>
                </div>
                <div className="text-slate-500">চট্টগ্রাম মেট্রোপলিটন এলাকা, বাংলাদেশ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Official Ratification Disclaimer */}
        <div className="mt-8 border-l-2 border-amber-500 bg-white/[0.04] px-4 py-4 text-xs text-stone-400 flex items-start gap-3 sm:px-5">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {language === 'bn'
              ? 'ঘোষণা: ওয়েবসাইটে প্রদর্শিত সময়সূচি, স্টপ ও ভাড়ার তথ্য নির্দেশক খসড়া হিসেবে দেখানো হতে পারে। যাত্রার আগে কাউন্টারে বর্তমান সময়সূচি, চূড়ান্ত ভাড়া ও সেবার প্রাপ্যতা নিশ্চিত করুন।'
              : 'Notice: Schedules, stops and fare figures displayed on this website may be indicative draft information. Confirm current services, schedules and final fares at a counter before travelling.'}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} মেট্রো প্রভাতী (Metro Probati) Transit Platform. সর্বস্বত্ব সংরক্ষিত।
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
