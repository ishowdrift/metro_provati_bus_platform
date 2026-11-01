'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_HELPLINE } from '@/data/mockData';

export default function ContactPage() {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div>
        <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
          {language === 'bn' ? 'সরাসরি সহায়তা' : 'Customer Support'}
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-1">
          {language === 'bn' ? 'মেট্রো প্রভাতী যোগাযোগ কেন্দ্র' : 'Metro Probati Contact Center'}
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          {language === 'bn'
            ? 'যে কোনো তথ্য, পরামর্শ, হারানো মালামাল অনুসন্ধান বা অভিযোগ জানাতে আমাদের হেল্পলাইনে কল করুন।'
            : 'For inquiries, complaints, lost item recovery, or guidance, reach out to our dedicated helplines.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Phone Numbers */}
        <div className="lg:col-span-5 space-y-4">
          <a
            href={`tel:${INITIAL_HELPLINE.primaryNumber}`}
            className="p-6 rounded-3xl bg-white border border-red-100 shadow-sm hover:border-red-300 hover:shadow-md transition flex items-center justify-between group block"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">
                  {INITIAL_HELPLINE.primaryLabelBn}
                </span>
                <div className="text-lg font-bold text-slate-900 font-mono tracking-wide">
                  {INITIAL_HELPLINE.primaryNumber}
                </div>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-xl">
              কল করুন
            </span>
          </a>

          <a
            href={`tel:${INITIAL_HELPLINE.secondaryNumber}`}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-red-200 hover:shadow-md transition flex items-center justify-between group block"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">
                  {INITIAL_HELPLINE.secondaryLabelBn}
                </span>
                <div className="text-lg font-bold text-slate-900 font-mono tracking-wide">
                  {INITIAL_HELPLINE.secondaryNumber}
                </div>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-800 rounded-xl">
              কল করুন
            </span>
          </a>

          {INITIAL_HELPLINE.showWhatsapp && (
            <a
              href={`https://wa.me/88${INITIAL_HELPLINE.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded-3xl bg-white hover:bg-red-50 text-red-600 border border-red-200 shadow-md transition flex items-center justify-between block"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-red-700 uppercase font-semibold">
                    হোয়াটসঅ্যাপ সহায়তা
                  </span>
                  <div className="text-lg font-bold font-mono text-slate-900">
                    {INITIAL_HELPLINE.whatsappNumber}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-red-600 text-white rounded-xl shadow-xs">
                চ্যাট
              </span>
            </a>
          )}

          <div className="p-6 rounded-3xl bg-white border border-red-100 space-y-3 text-xs text-slate-600 shadow-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-600" />
              <span>
                <strong>সেবা সময়:</strong> প্রতিদিন সকাল ০৬:০০ — রাত ১১:৩০
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600" />
              <span>
                <strong>কেন্দ্রীয় মাস্টার টার্মিনাল:</strong> কাপ্তাই রাস্তার মাথা, চট্টগ্রাম
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Feedback Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-sm space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-lg">
              আমাদের সরাসরি বার্তা পাঠান
            </h3>
            <p className="text-xs text-slate-500">
              আপনার মতামত, প্রশ্ন বা অভিজ্ঞতার কথা লিখে পাঠান
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-red-600 mx-auto" />
              <h4 className="font-bold text-base">আপনার বার্তা গৃহীত হয়েছে!</h4>
              <p className="text-xs text-red-800">
                মেট্রো প্রভাতী কাস্টমার কেয়ার টিম দ্রুত আপনার সাথে যোগাযোগ করবে।
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    আপনার নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    মোবাইল নম্বর *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  বার্তা বা অভিযোগের বিবরণ *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm rounded-xl transition shadow-md"
              >
                বার্তা পাঠান
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
