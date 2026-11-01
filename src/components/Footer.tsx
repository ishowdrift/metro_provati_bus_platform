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
    <footer className="bg-slate-950 text-slate-300 pt-10 pb-12 sm:pt-16 sm:pb-14 border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Info & Transit Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden ring-2 ring-red-500/30 bg-white flex items-center justify-center p-0.5">
                <Image
                  src="/logo.png"
                  alt="মেট্রো প্রভাতী লোগো"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain rounded-lg"
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
                ? 'চট্টগ্রাম নগরীর কাপ্তাই রাস্তার মাথা থেকে কাঠগড় করিডোরে পরিচালিত আধুনিক ডিজিটাল গণপরিবহন ব্যবস্থা। লাইভ জিপিএস স্যাটেলাইট ট্র্যাকিং, স্বচ্ছ ভাড়া ও কাউন্টার সেবা।'
                : 'Pioneering digital bus transit across Chattogram corridor from Kaptai Rastar Matha to Katgor with live satellite telemetry and transparent fares.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-red-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>
                {language === 'bn'
                  ? '১০০% বাস্তব উপগ্রহ জিপিএস ও ডিজিটাল কাউন্টার'
                  : '100% Genuine Satellite GPS & Counter Network'}
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
              <span className="font-mono text-red-400 font-bold">২৪.৯ কিমি করিডোর</span>
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
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{language === 'bn' ? 'লাইভ স্যাটেলাইট ট্র্যাকিং' : 'Live Satellite Tracking'}</span>
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
                className="flex items-center gap-3 p-3 bg-slate-900 rounded-2xl hover:bg-slate-850 hover:border-red-500/50 transition border border-slate-800 block group"
              >
                <div className="p-2 bg-red-600 text-white rounded-xl group-hover:scale-105 transition-transform">
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
                className="flex items-center gap-3 p-3 bg-slate-900 rounded-2xl hover:bg-slate-850 hover:border-red-500/50 transition border border-slate-800 block group"
              >
                <div className="p-2 bg-red-950 text-red-300 rounded-xl border border-red-800 group-hover:scale-105 transition-transform">
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
                  <span>অপারেটিং সময়: প্রতিদিন ভোর ০৫:৪৫ — রাত ১১:৩০</span>
                </div>
                <div className="text-slate-500">চট্টগ্রাম মেট্রোপলিটন এলাকা, বাংলাদেশ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Official Ratification Disclaimer */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {language === 'bn'
              ? 'ঘোষণা: প্রদর্শিত সময়সূচি, কাউন্টার স্টপ তালিকা এবং ১৫–৬৫ টাকা পরিধির ভাড়া নির্দেশক অনুমোদিত রূপরেখা হিসেবে সাজানো হয়েছে (যেমন: বহদ্দারহাট থেকে কেইপিজেড ৫৫ টাকা, আগ্রাবাদ থেকে কেইপিজেড ৩৫ টাকা)। মেট্রো প্রভাতী বাস মালিক সমিতি ও চট্টগ্রাম মেট্রোপলিটন পরিবহন কর্তৃপক্ষের চূড়ান্ত সমন্বয় অনুসারে তথ্যাদি নিয়মিত হালনাগাদ করা হয়।'
              : 'Notice: Displayed schedules, stops, and the ৳15–৳65 indicative draft fare range (e.g. Bahaddarhat to KEPZ ৳55, Agrabad to KEPZ ৳35) are updated based on approved corridor guidelines. Fares and stop sequences are regularly audited with operator records.'}
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
