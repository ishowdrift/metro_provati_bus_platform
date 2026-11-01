'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { INITIAL_BOOTHS } from '@/data/mockData';
import { toBengaliDigits } from '@/lib/fareCalculator';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock3,
  LogIn,
  MapPin,
  Phone,
  Search,
  Ticket,
} from 'lucide-react';

export default function CountersPage() {
  const { language } = useLanguage();
  const { role } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const isStaff = [
    'counter_representative',
    'counter_manager',
    'bus_supervisor',
    'operations_admin',
    'super_admin',
  ].includes(role);

  const filteredBooths = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    if (!query) return INITIAL_BOOTHS;

    return INITIAL_BOOTHS.filter((booth) =>
      [
        booth.nameBn,
        booth.nameEn,
        booth.stopNameBn,
        booth.addressBn,
        booth.addressEn,
      ].some((value) => value.toLocaleLowerCase().includes(query))
    );
  }, [searchQuery]);

  return (
    <main className="min-h-[65vh] bg-[#FAF9F7] pb-20">
      <div className="relative isolate overflow-hidden bg-[#C92232] text-white">
        {/* Subtle Ambient Light Drifts */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-36 -top-36 h-[440px] w-[440px] rounded-full bg-[#E5384B]/25 blur-[100px] animate-ambient-drift"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 right-1/4 h-[380px] w-[380px] rounded-full bg-[#8B1621]/45 blur-[90px] animate-ambient-drift"
          style={{ animationDelay: '-12s' }}
        />

        <div className="relative mx-auto flex max-w-[1240px] flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.24em] text-white/75">
              <span className="h-px w-7 bg-white/75" />
              <span>{language === 'bn' ? 'যাত্রী সহায়তা' : 'Passenger assistance'}</span>
            </div>
            <h1 className="text-3xl font-black tracking-[-0.045em] sm:text-5xl">
              {language === 'bn' ? 'কাউন্টার খুঁজুন।' : 'Find a counter.'}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/85">
              {language === 'bn'
                ? 'কাপ্তাই রাস্তার মাথা থেকে কাঠগড় করিডোরে তালিকাভুক্ত কাউন্টার পয়েন্ট, ঠিকানা ও যোগাযোগের তথ্য দেখুন। ফোন নম্বরের পাশে যাচাইয়ের অবস্থা উল্লেখ করা হয়েছে।'
                : 'Browse the listed counter points, addresses and contact details along the Kaptai Rastar Matha to Katgor corridor. Phone verification status is shown beside each number.'}
            </p>
          </div>

          {isStaff ? (
            <Link
              href="/counter"
              className="inline-flex min-h-11 w-fit items-center gap-2 bg-white px-5 py-3 text-xs font-extrabold text-[#A91D2A] transition-all duration-200 hover:bg-[#FFF4F4] active:scale-[0.99]"
            >
              <Building2 className="h-4 w-4" />
              <span>{language === 'bn' ? 'কাউন্টার পিওএস খুলুন' : 'Open counter POS'}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex min-h-11 w-fit items-center gap-2 border border-white/55 px-5 py-3 text-xs font-extrabold text-white transition-all duration-200 hover:bg-white/10 active:scale-[0.99]"
            >
              <LogIn className="h-4 w-4" />
              <span>{language === 'bn' ? 'স্টাফ লগইন' : 'Staff sign in'}</span>
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] space-y-8 px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <div className="flex flex-col justify-between gap-4 border-b border-stone-300 pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C92232]">
              {language === 'bn' ? 'কাউন্টার ডিরেক্টরি' : 'Counter directory'}
            </div>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-stone-950">
              {language === 'bn' ? 'তালিকাভুক্ত পয়েন্ট' : 'Listed points'}
            </h2>
          </div>
          <div className="text-xs font-semibold text-stone-400">
            {language === 'bn'
              ? toBengaliDigits(filteredBooths.length) + 'টি ফলাফল'
              : filteredBooths.length + ' results'}
          </div>
        </div>

        <div className="flex h-12 items-center gap-3 border border-stone-200 bg-white px-4 shadow-xs">
          <Search className="h-4 w-4 shrink-0 text-[#C92232]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={
              language === 'bn'
                ? 'কাউন্টার বা এলাকার নাম দিয়ে খুঁজুন'
                : 'Search by counter or area name'
            }
            aria-label={language === 'bn' ? 'কাউন্টার খুঁজুন' : 'Search counters'}
            className="h-full w-full bg-transparent text-sm font-medium text-stone-900 outline-none placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="shrink-0 text-xs font-bold text-[#C92232] hover:text-[#A91D2A]"
            >
              {language === 'bn' ? 'মুছুন' : 'Clear'}
            </button>
          )}
        </div>

        {filteredBooths.length > 0 ? (
          <div className="divide-y divide-stone-200 border-y border-stone-300 bg-white shadow-xs">
            {filteredBooths.map((booth, index) => {
              const mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + booth.lat + ',' + booth.lng;
              return (
                <article key={booth.id} className="grid gap-5 px-5 py-6 sm:grid-cols-[1fr_auto] sm:items-center sm:px-7 transition-colors hover:bg-[#FFF7F6]">
                  <div className="flex min-w-0 gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#FCEBEC] bg-[#FFF7F6] text-xs font-black text-[#A91D2A]">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="text-base font-extrabold tracking-tight text-stone-950">
                          {language === 'bn' ? booth.nameBn : booth.nameEn}
                        </h3>
                        {booth.isPhoneVerified ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#24775F]">
                            <CheckCircle2 className="h-3 w-3" />
                            {language === 'bn' ? 'ফোন যাচাইকৃত' : 'Phone verified'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#B7791F]">
                            <AlertCircle className="h-3 w-3" />
                            {language === 'bn' ? 'ফোন যাচাই হয়নি' : 'Phone not verified'}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-start gap-2 text-xs leading-6 text-stone-500">
                        <MapPin className="mt-1 h-3.5 w-3.5 shrink-0 text-[#C92232]" />
                        <span>{language === 'bn' ? booth.addressBn : booth.addressEn}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-stone-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5 text-stone-400" />
                          {booth.openingHours}
                          <span className="text-stone-400">
                            ({language === 'bn' ? 'তালিকাভুক্ত সময়' : 'listed hours'})
                          </span>
                        </span>
                        {booth.phone && (
                          <a
                            href={'tel:' + booth.phone}
                            className="inline-flex items-center gap-1.5 font-bold text-stone-800 transition-colors hover:text-[#C92232]"
                          >
                            <Phone className="h-3.5 w-3.5 text-[#C92232]" />
                            {booth.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pl-[52px] sm:pl-0">
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 items-center gap-2 border border-stone-300 px-3.5 py-2 text-[11px] font-extrabold text-stone-700 transition-colors hover:border-[#C92232] hover:text-[#C92232]"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{language === 'bn' ? 'ম্যাপ' : 'Map'}</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                    <Link
                      href={'/tickets?from=' + encodeURIComponent(booth.stopId)}
                      className="inline-flex min-h-10 items-center gap-2 bg-[#C92232] px-3.5 py-2 text-[11px] font-extrabold text-white transition-colors hover:bg-[#A91D2A]"
                    >
                      <Ticket className="h-3.5 w-3.5" />
                      <span>{language === 'bn' ? 'টিকিট' : 'Ticket'}</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="border-y border-stone-300 bg-white px-5 py-14 text-center">
            <Building2 className="mx-auto h-8 w-8 text-stone-300" />
            <h3 className="mt-3 text-sm font-extrabold text-stone-900">
              {language === 'bn' ? 'কোনো কাউন্টার পাওয়া যায়নি' : 'No counters found'}
            </h3>
            <p className="mt-1 text-xs text-stone-500">
              {language === 'bn' ? 'অন্য নাম বা এলাকার তথ্য দিয়ে খুঁজুন।' : 'Try another counter or area name.'}
            </p>
          </div>
        )}

        <p className="border-l-2 border-[#B7791F] bg-[#FEF7EC] px-4 py-3 text-xs leading-6 text-[#7C5010]">
          {language === 'bn'
            ? 'নোট: কাউন্টারের ঠিকানা, ফোন নম্বর ও তালিকাভুক্ত সময় পরিবর্তিত হতে পারে। ফোন যাচাই করা না থাকলে যাওয়ার আগে হেল্পলাইনে নিশ্চিত করুন।'
            : 'Note: Counter addresses, phone numbers and listed hours may change. Where a phone number is unverified, confirm details with the main helpline before visiting.'}
        </p>
      </div>
    </main>
  );
}
