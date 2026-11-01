'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { PhoneCall, Phone, MessageSquare, X, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_HELPLINE } from '@/data/mockData';

export const FloatingCallWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const pathname = usePathname();

  if (pathname === '/login' || pathname?.startsWith('/login')) {
    return null;
  }

  return (
    <div className="hidden sm:flex fixed bottom-6 right-6 z-50 flex-col items-end">
      {/* Expanded Modal Box */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-red-100 p-5 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-50 rounded-xl text-red-600">
                <PhoneCall className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {language === 'bn' ? 'মেট্রো প্রভাতী হেল্পলাইন' : 'Metro Probati Helpline'}
                </h4>
                <p className="text-xs text-slate-500">
                  {language === 'bn' ? 'সরাসরি কথা বলুন' : 'Direct Assistance'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {/* Primary Number */}
            <a
              href={`tel:${INITIAL_HELPLINE.primaryNumber}`}
              className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-red-50 rounded-xl border border-slate-200/80 hover:border-red-300 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600 text-white rounded-lg group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500">
                    {language === 'bn' ? INITIAL_HELPLINE.primaryLabelBn : INITIAL_HELPLINE.primaryLabelEn}
                  </div>
                  <div className="text-sm font-bold text-slate-900 tracking-wide font-mono">
                    {INITIAL_HELPLINE.primaryNumber}
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-800 rounded-md">
                {language === 'bn' ? 'কল করুন' : 'Call'}
              </span>
            </a>

            {/* Secondary Number */}
            <a
              href={`tel:${INITIAL_HELPLINE.secondaryNumber}`}
              className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/80 hover:border-slate-300 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 text-white rounded-lg group-hover:scale-105 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-500">
                    {language === 'bn' ? INITIAL_HELPLINE.secondaryLabelBn : INITIAL_HELPLINE.secondaryLabelEn}
                  </div>
                  <div className="text-sm font-bold text-slate-900 tracking-wide font-mono">
                    {INITIAL_HELPLINE.secondaryNumber}
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-slate-200 text-slate-800 rounded-md">
                {language === 'bn' ? 'কল করুন' : 'Call'}
              </span>
            </a>

            {/* WhatsApp option */}
            {INITIAL_HELPLINE.showWhatsapp && (
              <a
                href={`https://wa.me/88${INITIAL_HELPLINE.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl transition"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-bold">
                    {language === 'bn' ? 'হোয়াটসঅ্যাপে চ্যাট করুন' : 'Chat on WhatsApp'}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-red-600">
                  {INITIAL_HELPLINE.whatsappNumber}
                </span>
              </a>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
              {language === 'bn' ? 'অপারেটর ভেরিফাইড হেল্পলাইন' : 'Verified Operator Support'}
            </span>
            <span>06:00 AM — 11:30 PM</span>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Helpline Support"
        className="flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 border-2 border-white group"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
        <PhoneCall className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
        <span className="font-bold text-xs md:text-sm tracking-wide">
          {language === 'bn' ? 'জরুরি কল' : 'Helpline'}
        </span>
      </button>
    </div>
  );
};
