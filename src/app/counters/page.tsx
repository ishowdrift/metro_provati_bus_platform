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
    <main className="min-h-[65vh] bg-[#F1EEE8] pb-20">
      {/* Transit Header */}
      <section className="relative isolate overflow-hidden bg-[#C92232] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-36 -top-36 h-[440px] w-[440px] rounded-full bg-white/10 blur-[100px] animate-ambient-drift"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 right-1/4 h-[380px] w-[380px] rounded-full bg-black/25 blur-[90px] animate-ambient-drift"
          style={{ animationDelay: '-12s' }}
        />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-white/80">
              <span className="h-px w-8 bg-white/75" />
              <span>STATION OPERATIONS · NETWORK COUNTERS</span>
            </div>
            <h1 className="text-3xl font-black leading-[1.06] tracking-tight sm:text-5xl font-display">
              {language === 'bn' ? 'কাউন্টার ডিরেক্টরি' : 'Station Counter Points'}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/90 font-medium">
              {language === 'bn'
                ? 'কাপ্তাই রাস্তার মাথা থেকে কাঠগড় করিডোরে তালিকাভুক্ত শারীরিক কাউন্টার পয়েন্ট, ঠিকানা ও ফোন নম্বর। যাচাইকৃত নম্বরের পাশে সবুজ ব্যাজ প্রদর্শিত।'
                : 'Physical booth locations, operational hours and contact points along the 24.9 km Chattogram arterial transit route.'}
            </p>
          </div>

          {isStaff ? (
            <Link
              href="/counter"
              className="inline-flex min-h-11 w-fit items-center gap-2 bg-white px-5 py-3 rounded-xl text-xs font-extrabold text-[#A91D2A] transition-all duration-200 hover:bg-[#FFF4F4] active:scale-95 shadow-md"
            >
              <Building2 className="h-4 w-4" />
              <span>{language === 'bn' ? 'কাউন্টার পিওএস খুলুন' : 'Open counter POS'}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex min-h-11 w-fit items-center gap-2 border border-white/40 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-xl text-xs font-extrabold text-white transition-all duration-200 hover:bg-white/20 active:scale-95"
            >
              <LogIn className="h-4 w-4" />
              <span>{language === 'bn' ? 'স্টাফ লগইন' : 'Staff sign in'}</span>
            </Link>
          )}
        </div>
      </section>

      {/* Directory Content */}
      <div className="mx-auto max-w-7xl space-y-8 px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <div className="flex flex-col justify-between gap-4 border-b border-[#E5E0D8] pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#C92232]">
              CORRIDOR DIRECTORY · 12 KEY POINTS
            </div>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-[#272524] sm:text-3xl">
              {language === 'bn' ? 'তালিকাভুক্ত কাউন্টার পয়েন্ট' : 'Approved Station Booths'}
            </h2>
          </div>
          <div className="font-mono text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-full border border-[#E5E0D8]">
            {language === 'bn'
              ? toBengaliDigits(filteredBooths.length) + 'টি কাউন্টার পয়েন্ট'
              : filteredBooths.length + ' BOOTHS LISTED'}
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="flex h-12 items-center gap-3 rounded-2xl border border-[#E5E0D8] bg-white px-4 shadow-sm">
          <Search className="h-4 w-4 shrink-0 text-[#C92232]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={
              language === 'bn'
                ? 'কাউন্টার বা এলাকার নাম দিয়ে খুঁজুন (যেমন: বহদ্দারহাট, জিইসি, ইপিজেড)...'
                : 'Search by station or landmark name (e.g., Bahaddarhat, GEC, Katgor)...'
            }
            aria-label={language === 'bn' ? 'কাউন্টার খুঁজুন' : 'Search counters'}
            className="h-full w-full bg-transparent text-sm font-medium text-[#272524] outline-none placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="shrink-0 font-mono text-xs font-bold text-[#C92232] hover:text-[#A91D2A]"
            >
              {language === 'bn' ? 'মুছুন' : 'Clear'}
            </button>
          )}
        </div>

        {/* Counter Cards Grid */}
        {filteredBooths.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBooths.map((booth, index) => {
              const mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + booth.lat + ',' + booth.lng;
              return (
                <article
                  key={booth.id}
                  className="bg-white rounded-3xl p-6 border border-[#E5E0D8] shadow-sm hover:shadow-md hover:border-[#C92232]/50 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center font-mono text-xs font-black rounded-2xl bg-[#F2E4E2] text-[#C92232]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-base font-extrabold tracking-tight text-[#272524] sm:text-lg">
                          {language === 'bn' ? booth.nameBn : booth.nameEn}
                        </h3>
                        {booth.isPhoneVerified ? (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#49665A] bg-[#EAF1EE] px-2.5 py-0.5 rounded-full border border-[#49665A]/20">
                            <CheckCircle2 className="h-3 w-3" />
                            {language === 'bn' ? 'যাচাইকৃত' : 'VERIFIED'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#A87936] bg-[#FAF4EB] px-2.5 py-0.5 rounded-full border border-[#A87936]/20">
                            <AlertCircle className="h-3 w-3" />
                            {language === 'bn' ? 'যাচাইাধীন' : 'PENDING'}
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex items-start gap-1.5 text-xs leading-relaxed text-slate-500">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C92232]" />
                        <span>{language === 'bn' ? booth.addressBn : booth.addressEn}</span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                          <span>{booth.openingHours}</span>
                        </span>
                        {booth.phone && (
                          <a
                            href={'tel:' + booth.phone}
                            className="inline-flex items-center gap-1.5 font-bold text-[#272524] transition-colors hover:text-[#C92232]"
                          >
                            <Phone className="h-3.5 w-3.5 text-[#C92232]" />
                            <span>{booth.phone}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 border border-[#E5E0D8] bg-white hover:border-[#C92232] px-3.5 py-2 rounded-xl text-xs font-bold text-[#272524] transition-colors"
                    >
                      <MapPin className="h-3.5 w-3.5 text-[#C92232]" />
                      <span>{language === 'bn' ? 'ম্যাপ' : 'Map'}</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                    <Link
                      href={'/tickets?from=' + encodeURIComponent(booth.stopId)}
                      className="inline-flex items-center gap-1.5 bg-[#C92232] hover:bg-[#A91D2A] px-4 py-2 rounded-xl text-xs font-extrabold text-white transition-colors shadow-xs"
                    >
                      <Ticket className="h-3.5 w-3.5" />
                      <span>{language === 'bn' ? 'এখান থেকে বুকিং' : 'Book'}</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E5E0D8]">
            <Building2 className="mx-auto h-8 w-8 text-slate-300" />
            <h3 className="mt-3 text-base font-extrabold text-[#272524]">
              {language === 'bn' ? 'কোনো কাউন্টার পাওয়া যায়নি' : 'No matching stations found'}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {language === 'bn' ? 'অন্য নাম বা এলাকার তথ্য দিয়ে খুঁজুন।' : 'Try searching another landmark or station name.'}
            </p>
          </div>
        )}

        <div className="flex items-start gap-3 rounded-2xl border-l-4 border-[#A87936] bg-white p-5 text-xs leading-relaxed text-slate-600 shadow-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#A87936]" />
          <p>
            {language === 'bn'
              ? 'যাত্রী ঘোষণা: কাউন্টারের প্রকাশিত ঠিকানা, ফোন নম্বর ও সেবার সময় ট্রাফিক বা প্রাতিষ্ঠানিক কারণে পরিবর্তিত হতে পারে। যাওয়ার পূর্বে প্রকাশিত হেল্পলাইনে নিশ্চিত করুন।'
              : 'Commuter Advisory: Listed booth hours and telephone contacts may adjust based on operational shifts. Contact the central helpline to verify unconfirmed points.'}
          </p>
        </div>
      </div>
    </main>
  );
}
