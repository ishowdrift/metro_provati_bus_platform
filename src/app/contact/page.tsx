'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Clock3, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_HELPLINE } from '@/data/mockData';

export default function ContactPage() {
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const rawNumber = (INITIAL_HELPLINE.whatsappNumber || INITIAL_HELPLINE.primaryNumber).replace(/\D/g, '');
    const whatsappNumber = rawNumber.startsWith('0') ? '88' + rawNumber : rawNumber;
    const text = [
      language === 'bn' ? 'মেট্রো প্রভাতী যোগাযোগ' : 'Metro Probati enquiry',
      (language === 'bn' ? 'নাম: ' : 'Name: ') + name.trim(),
      (language === 'bn' ? 'ফোন: ' : 'Phone: ') + phone.trim(),
      (language === 'bn' ? 'বার্তা: ' : 'Message: ') + message.trim(),
    ].join('\n');
    const url = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(text);
    window.location.assign(url);
  };

  const contactRows = [
    {
      label: language === 'bn' ? INITIAL_HELPLINE.primaryLabelBn : INITIAL_HELPLINE.primaryLabelEn,
      number: INITIAL_HELPLINE.primaryNumber,
    },
    {
      label: language === 'bn' ? INITIAL_HELPLINE.secondaryLabelBn : INITIAL_HELPLINE.secondaryLabelEn,
      number: INITIAL_HELPLINE.secondaryNumber,
    },
  ];

  return (
    <main className="min-h-[65vh] bg-[#FAF9F7] pb-20">
      {/* Swiss Transport Header */}
      <section className="relative isolate overflow-hidden bg-[#C92232] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-36 -top-36 h-[440px] w-[440px] rounded-full bg-[#E5384B]/25 blur-[100px] animate-ambient-drift"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 right-1/4 h-[380px] w-[380px] rounded-full bg-[#8B1621]/45 blur-[90px] animate-ambient-drift"
          style={{ animationDelay: '-12s' }}
        />

        <div className="relative mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-4 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white/80">
            <span className="h-px w-8 bg-white/75" />
            <span>COMMUTER ASSISTANCE · DIRECT DESK</span>
          </div>
          <h1 className="max-w-3xl text-3xl font-black leading-[1.06] tracking-[-0.045em] sm:text-5xl">
            {language === 'bn' ? 'কথা বলুন মেট্রো প্রভাতীর সঙ্গে।' : 'Speak with Metro Probati.'}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/85 sm:text-base">
            {language === 'bn'
              ? 'রুট, কাউন্টার, ভাড়া বা যাত্রীসেবা সম্পর্কে জানতে সরাসরি হেল্পলাইনে কল করুন অথবা WhatsApp-এ বার্তা তৈরি করুন।'
              : 'For route verification, tariffs or physical booth locations, call our direct hotline or prepare a message via WhatsApp.'}
          </p>
        </div>
      </section>

      {/* Main Layout */}
      <div className="mx-auto grid max-w-[1240px] gap-12 px-4 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <section className="space-y-6">
          <div>
            <div className="mb-2 font-mono text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C92232]">
              OPERATIONAL HOTLINES
            </div>
            <h2 className="text-2xl font-black tracking-tight text-stone-950 sm:text-3xl">
              {language === 'bn' ? 'সরাসরি হেল্পলাইন নম্বর' : 'Direct Helpline Contacts'}
            </h2>
          </div>

          <div className="divide-y divide-stone-200 border-y border-stone-300">
            {contactRows.map((item) => (
              <a
                key={item.number + item.label}
                href={'tel:' + item.number}
                className="group flex items-center justify-between gap-4 py-5 transition-colors hover:bg-white sm:px-3"
              >
                <div>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">{item.label}</div>
                  <div className="mt-1 font-mono text-xl font-black tracking-tight text-stone-900 group-hover:text-[#C92232] transition-colors">{item.number}</div>
                </div>
                <span className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#C92232]">
                  <Phone className="h-4 w-4" />
                  <span>{language === 'bn' ? 'কল করুন' : 'CALL'}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </a>
            ))}
          </div>

          {INITIAL_HELPLINE.showWhatsapp && INITIAL_HELPLINE.whatsappNumber && (
            <a
              href={'https://wa.me/88' + INITIAL_HELPLINE.whatsappNumber.replace(/\D/g, '')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 border border-[#C92232] bg-white p-5 text-[#C92232] transition-colors hover:bg-[#FFF7F6]"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5" />
                <div>
                  <div className="text-xs font-extrabold">{language === 'bn' ? 'WhatsApp সহায়তা ডেস্ক' : 'WhatsApp Support Desk'}</div>
                  <div className="mt-1 font-mono text-sm font-bold text-stone-800">{INITIAL_HELPLINE.whatsappNumber}</div>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}

          <div className="border-l-2 border-[#B7791F] bg-[#FEF7EC] px-4 py-4 text-xs leading-6 text-[#7C5010]">
            {language === 'bn'
              ? 'কাউন্টার, ফোন নম্বর ও সেবার সময় ট্রাফিক বা প্রাতিষ্ঠানিক কারণে পরিবর্তিত হতে পারে। যাত্রার পূর্বে সরাসরি যোগাযোগ করে নিশ্চিত করুন।'
              : 'Counter details, phone numbers and service hours may change. Contact the team directly before travelling.'}
          </div>

          <div className="grid gap-4 border-t border-stone-300 pt-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-[#C92232]" />
              <div className="text-xs leading-6 text-stone-600">
                <div className="font-extrabold text-stone-900">{language === 'bn' ? 'সেবা এলাকা' : 'Service area'}</div>
                Chattogram Metropolitan Area
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 h-4 w-4 text-[#C92232]" />
              <div className="text-xs leading-6 text-stone-600">
                <div className="font-extrabold text-stone-900">{language === 'bn' ? 'সেবার সময়' : 'Service hours'}</div>
                {language === 'bn' ? 'সকাল ০৬:০০ — রাত ১১:৩০' : '06:00 AM — 11:30 PM'}
              </div>
            </div>
          </div>
        </section>

        {/* WhatsApp Message Console */}
        <section className="border border-stone-300 bg-white p-6 sm:p-10">
          <div className="mb-6 border-b border-stone-200 pb-5">
            <div className="font-mono text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C92232]">
              DIRECT DISPATCH · WHATSAPP
            </div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-stone-950 sm:text-3xl">
              {language === 'bn' ? 'আপনার বার্তা লিখুন।' : 'Write Your Message.'}
            </h2>
            <p className="mt-2 text-xs leading-6 text-stone-500">
              {language === 'bn'
                ? 'ফর্ম জমা দিলে স্বয়ংক্রিয়ভাবে WhatsApp খুলবে। পাঠানোর আগে সেখানে বার্তাটি দেখে নেওয়ার সুযোগ থাকবে।'
                : 'Submitting prepares your message and hands off seamlessly to WhatsApp where you can review before sending.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-2 block font-mono text-[11px] font-bold text-stone-500">
                  {language === 'bn' ? 'আপনার নাম' : 'YOUR NAME'}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="h-12 w-full border border-stone-300 bg-[#FAF9F7] px-3 text-sm font-medium text-stone-900 outline-none transition focus:border-[#C92232] focus:ring-2 focus:ring-[#C92232]/15"
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className="mb-2 block font-mono text-[11px] font-bold text-stone-500">
                  {language === 'bn' ? 'মোবাইল নম্বর' : 'PHONE NUMBER'}
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="h-12 w-full border border-stone-300 bg-[#FAF9F7] px-3 text-sm font-medium text-stone-900 outline-none transition focus:border-[#C92232] focus:ring-2 focus:ring-[#C92232]/15"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="mb-2 block font-mono text-[11px] font-bold text-stone-500">
                {language === 'bn' ? 'বার্তা বা প্রশ্ন' : 'MESSAGE OR QUESTION'}
              </label>
              <textarea
                id="contact-message"
                required
                rows={6}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="w-full border border-stone-300 bg-[#FAF9F7] px-3 py-3 text-sm leading-6 text-stone-900 outline-none transition focus:border-[#C92232] focus:ring-2 focus:ring-[#C92232]/15"
              />
            </div>

            <button
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#C92232] px-5 py-3 text-sm font-extrabold text-white transition-all duration-200 hover:bg-[#A91D2A] active:scale-[0.99]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{language === 'bn' ? 'WhatsApp-এ বার্তা প্রস্তুত করুন' : 'Prepare WhatsApp Message'}</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-4 font-mono text-[10px] leading-5 text-stone-400">
            {language === 'bn'
              ? 'নিরাপত্তা তথ্য: এই ওয়েবসাইটে বার্তা সংরক্ষণ করা হয় না। WhatsApp-এ পাঠানোর পূর্বে আপনার বিবরণ যাচাই করুন।'
              : 'Data Disclosure: This website does not store messages. You can verify your message details in WhatsApp before sending.'}
          </p>
        </section>
      </div>

      <div className="mx-auto max-w-[1240px] px-4 pt-10 sm:px-6 lg:px-8">
        <Link
          href="/incidents/report"
          className="inline-flex items-center gap-2 text-xs font-extrabold text-[#C92232] hover:text-[#A91D2A] transition-colors"
        >
          <span>{language === 'bn' ? 'অভিযোগ বা হারানো মালামাল রিপোর্ট করুন' : 'Report an incident or lost item'}</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
