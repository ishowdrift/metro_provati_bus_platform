'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bus, Phone, ShieldCheck, MapPin, Mail, ExternalLink, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_HELPLINE } from '@/data/mockData';

export const Footer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-8 pb-10 sm:pt-16 sm:pb-12 border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 pb-8 sm:pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-red-500/30 bg-white flex items-center justify-center p-0.5">
                <Image
                  src="/logo.png"
                  alt="মেট্রো প্রভাতী লোগো"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain rounded-lg"
                  unoptimized
                />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">মেট্রো প্রভাতী</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {language === 'bn'
                ? 'চট্টগ্রাম নগরীর কাপ্তাই রাস্তার মাথা থেকে কাঠগড় করিডোরে পরিচালিত আধুনিক ডিজিটাল বাস ও কাউন্টার সেবা।'
                : 'Modern digital bus and counter transit service operating across Chattogram corridor from Kaptai Rastar Matha to Katgor.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-red-400">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span>
                {language === 'bn'
                  ? 'রিয়েল-টাইম জিপিএস ও ডিজিটাল কাউন্টার নেটওয়ার্ক'
                  : 'Real-time GPS & Digital Counter Network'}
              </span>
            </div>
          </div>

          {/* Corridor & Stops */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              {language === 'bn' ? 'প্রধান করিডোর স্টপ' : 'Corridor Key Stops'}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>কাপ্তাই রাস্তার মাথা (মাস্টার টার্মিনাল)</li>
              <li>বহদ্দারহাট • মুরাদপুর • জিইসি মোড়</li>
              <li>ওয়াসা মোড় • দেওয়ানহাট • আগ্রাবাদ বাদামতলী</li>
              <li>সল্টগোলা ক্রসিং • ইপিজেড (সিইপিজেড)</li>
              <li>কাঠগড় (মাস্টার টার্মিনাল)</li>
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              {language === 'bn'
                ? 'মোট দূরত্ব প্রায় ২৫ কিলোমিটার'
                : 'Approx distance: ~25 km'}
            </p>
          </div>

          {/* Quick Links & Dashboards */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              {language === 'bn' ? 'পোর্টাল ও সেবা' : 'Portals & Services'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tracking" className="hover:text-white transition">
                  {language === 'bn' ? 'লাইভ বাস ট্র্যাকিং' : 'Live Bus Tracking'}
                </Link>
              </li>
              <li>
                <Link href="/fares" className="hover:text-white transition">
                  {language === 'bn' ? 'ভাড়া তালিকা ও ক্যালকুলেটর' : 'Fare Calculator'}
                </Link>
              </li>
              <li>
                <Link href="/routes" className="hover:text-white transition">
                  {language === 'bn' ? 'করিডোর রুট ও স্টপ তালিকা' : 'Route & Stop Sequence'}
                </Link>
              </li>
              <li>
                <Link href="/tickets" className="hover:text-white transition">
                  {language === 'bn' ? 'আসন বুকিং ও টিকিট যাচাই' : 'Book Ticket / Verify'}
                </Link>
              </li>
              <li>
                <Link href="/fares" className="hover:text-white transition">
                  {language === 'bn' ? 'ভাড়ার তালিকা ও স্টেজ ম্যাট্রিক্স' : 'Fare Matrix & Schedule'}
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition">
                  {language === 'bn' ? 'আমার প্রোফাইল ও সংরক্ষিত টিকিট' : 'My Profile & Bookings'}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-red-400 transition font-bold text-white">
                  {language === 'bn' ? 'পোর্টাল লগইন / স্টাফ প্রবেশ' : 'Portal Login & Staff Access'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Helplines & Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              {language === 'bn' ? 'হেল্পলাইন ও জরুরি সহায়তা' : 'Direct Helpline & Support'}
            </h4>
            <div className="space-y-3">
              <a
                href={`tel:${INITIAL_HELPLINE.primaryNumber}`}
                className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl hover:bg-slate-800 transition border border-slate-800"
              >
                <div className="p-2 bg-red-500/20 text-red-400 rounded-lg">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">
                    {language === 'bn' ? INITIAL_HELPLINE.primaryLabelBn : INITIAL_HELPLINE.primaryLabelEn}
                  </div>
                  <div className="text-sm font-bold text-white font-mono">
                    {INITIAL_HELPLINE.primaryNumber}
                  </div>
                </div>
              </a>

              <a
                href={`tel:${INITIAL_HELPLINE.secondaryNumber}`}
                className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl hover:bg-slate-800 transition border border-slate-800"
              >
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">
                    {language === 'bn' ? INITIAL_HELPLINE.secondaryLabelBn : INITIAL_HELPLINE.secondaryLabelEn}
                  </div>
                  <div className="text-sm font-bold text-white font-mono">
                    {INITIAL_HELPLINE.secondaryNumber}
                  </div>
                </div>
              </a>

              <div className="pt-2 text-xs text-slate-500 space-y-1">
                <div>অপারেটিং সময়: সকাল ০৬:০০ — রাত ১১:৩০</div>
                <div>চট্টগ্রাম, বাংলাদেশ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="mt-8 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p>
            {language === 'bn'
              ? 'ঘোষণা: প্রদর্শিত সময়সূচি, কাউন্টার স্টপ তালিকা এবং ১০–৪৫ টাকা পরিধির ভাড়া নির্দেশক রূপরেখা হিসেবে সাজানো হয়েছে। মেট্রো প্রভাতী বাস মালিক সমিতি ও চট্টগ্রাম মেট্রোপলিটন পরিবহন কর্তৃপক্ষের চূড়ান্ত অনুমোদনের পর তথ্যাদি হালনাগাদ করা হবে।'
              : 'Notice: Displayed schedules, stops, and the ৳10–৳45 indicative fare range are pilot draft values pending official certification by Metro Probati operators and transit authorities.'}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} মেট্রো প্রভাতী (Metro Probati). সর্বস্বত্ব সংরক্ষিত।
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-300 transition">
              {language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-300 transition">
              {language === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}
            </Link>
            <span>•</span>
            <Link href="/incidents/report" className="hover:text-slate-300 transition">
              {language === 'bn' ? 'অভিযোগ / পরামর্শ' : 'Report Incident'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
