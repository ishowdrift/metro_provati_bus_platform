'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowRightLeft,
  BusFront,
  MapPin,
  Search,
  ShieldCheck,
  Ticket,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_STOPS } from '@/data/mockData';
import { calculateFare, formatBDT, toBengaliDigits } from '@/lib/fareCalculator';

export const Hero: React.FC = () => {
  const { language } = useLanguage();
  const router = useRouter();

  const [fromStopId, setFromStopId] = useState('stop-1');
  const [toStopId, setToStopId] = useState('stop-10');
  const [routeError, setRouteError] = useState('');

  const fareResult = calculateFare(fromStopId, toStopId);

  const handleSwapStops = () => {
    setFromStopId(toStopId);
    setToStopId(fromStopId);
    setRouteError('');
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (fromStopId === toStopId) {
      setRouteError(
        language === 'bn'
          ? 'যাত্রা শুরুর স্থান ও গন্তব্য আলাদা নির্বাচন করুন।'
          : 'Choose two different stops for your journey.'
      );
      return;
    }

    setRouteError('');
    router.push('/tickets?from=' + encodeURIComponent(fromStopId) + '&to=' + encodeURIComponent(toStopId));
  };

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[#C92232] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(115deg, transparent 0 49.8%, rgba(255,255,255,.8) 50%, transparent 50.2%), linear-gradient(25deg, transparent 0 79.8%, rgba(255,255,255,.7) 80%, transparent 80.2%)',
            backgroundSize: '100% 100%, 100% 100%',
          }}
        />

        <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 items-stretch lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex flex-col justify-center px-5 pb-12 pt-14 sm:px-10 sm:pb-16 sm:pt-20 lg:px-16 xl:px-24 lg:py-24">
            <div className="mb-7 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-white/80 sm:text-xs">
              <span className="h-px w-8 bg-white/70" />
              <span>{language === 'bn' ? 'চট্টগ্রামের নগর পরিবহন' : 'Chattogram urban transit'}</span>
            </div>

            <h1 className="max-w-[720px] text-[clamp(2.55rem,6vw,5.6rem)] font-black leading-[1.06] tracking-[-0.045em] text-white">
              {language === 'bn' ? (
                <>
                  চট্টগ্রামের পথে,
                  <br />
                  <span className="text-white/75">যাত্রা হোক নিশ্চিন্ত।</span>
                </>
              ) : (
                <>
                  Move through
                  <br />
                  <span className="text-white/75">Chattogram.</span>
                </>
              )}
            </h1>

            <p className="mt-7 max-w-[470px] text-sm font-medium leading-7 text-white/85 sm:text-base sm:leading-8">
              {language === 'bn'
                ? 'কাপ্তাই রাস্তার মাথা থেকে কাঠগড়—আপনার প্রতিদিনের যাত্রার জন্য রুট, ভাড়া ও প্রয়োজনীয় তথ্য এক জায়গায়।'
                : 'From Kaptai Rastar Matha to Katgor. Find route information, indicative fares and the services you need for your everyday journey.'}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/tickets"
                className="group inline-flex min-h-12 items-center justify-center gap-3 bg-white px-6 py-3 text-sm font-extrabold text-[#B91F2D] transition-colors duration-200 hover:bg-[#FFF4F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <Ticket className="h-4 w-4" />
                <span>{language === 'bn' ? 'টিকিট বুক করুন' : 'Book a ticket'}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/tracking"
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/45 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <MapPin className="h-4 w-4" />
                <span>{language === 'bn' ? 'বাসের অবস্থান' : 'Bus location'}</span>
              </Link>
            </div>

            <div className="mt-12 grid max-w-[520px] grid-cols-3 border-t border-white/25 pt-5">
              <div className="pr-3">
                <div className="text-2xl font-black tracking-tight sm:text-3xl">{toBengaliDigits(12)}</div>
                <div className="mt-1 text-[10px] font-semibold leading-4 text-white/70 sm:text-xs">
                  {language === 'bn' ? 'তালিকাভুক্ত স্টপ' : 'Listed stops'}
                </div>
              </div>
              <div className="border-l border-white/25 px-4">
                <div className="text-2xl font-black tracking-tight sm:text-3xl">01</div>
                <div className="mt-1 text-[10px] font-semibold leading-4 text-white/70 sm:text-xs">
                  {language === 'bn' ? 'প্রধান করিডোর' : 'Main corridor'}
                </div>
              </div>
              <div className="border-l border-white/25 pl-4">
                <div className="text-2xl font-black tracking-tight sm:text-3xl">৳</div>
                <div className="mt-1 text-[10px] font-semibold leading-4 text-white/70 sm:text-xs">
                  {language === 'bn' ? 'ভাড়া আগে জানুন' : 'Know the fare first'}
                </div>
              </div>
            </div>
          </div>

          <div className="relative min-h-[300px] overflow-hidden sm:min-h-[440px] lg:min-h-[650px]">
            <Image
              src="/images/bus-1.jpg"
              alt={language === 'bn' ? 'মেট্রো প্রভাতীর বাস' : 'Metro Probati bus'}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 54vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/10" />
            <div className="absolute left-5 top-5 flex items-center gap-2 border border-white/50 bg-black/20 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm sm:left-8 sm:top-8">
              <BusFront className="h-4 w-4" />
              <span>{language === 'bn' ? 'মেট্রো প্রভাতী' : 'Metro Probati'}</span>
            </div>
            <div className="absolute bottom-7 left-5 right-5 text-white sm:bottom-10 sm:left-8 sm:right-8">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/75">
                {language === 'bn' ? 'আমাদের করিডোর' : 'The corridor'}
              </div>
              <div className="flex flex-wrap items-end justify-between gap-3 border-t border-white/40 pt-4">
                <div>
                  <div className="text-xl font-extrabold tracking-tight sm:text-3xl">
                    {language === 'bn' ? 'কাপ্তাই রাস্তার মাথা — কাঠগড়' : 'Kaptai Rastar Matha — Katgor'}
                  </div>
                  <p className="mt-1 text-xs font-medium text-white/75">
                    {language === 'bn' ? 'চট্টগ্রাম, বাংলাদেশ' : 'Chattogram, Bangladesh'}
                  </p>
                </div>
                <Link
                  href="/routes"
                  className="inline-flex items-center gap-2 border-b border-white/75 pb-1 text-xs font-bold text-white transition-colors hover:border-white"
                >
                  <span>{language === 'bn' ? 'রুট দেখুন' : 'Explore route'}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/20 bg-[#B91F2D]">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-3 text-[10px] font-semibold text-white/75 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16 xl:px-24 sm:text-xs">
            <span>{language === 'bn' ? 'আপনার যাত্রা, আরও সহজভাবে।' : 'A clearer way to plan your everyday journey.'}</span>
            <span>{language === 'bn' ? 'রুট ও ভাড়ার তথ্য নির্দেশক; চূড়ান্ত তথ্য কাউন্টারে নিশ্চিত করুন।' : 'Route and fare details are indicative; confirm final information at the counter.'}</span>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-1 max-w-7xl px-4 pt-7 sm:px-6 sm:pt-10 lg:px-8">
        <div className="border border-stone-200 bg-white shadow-[0_18px_55px_-38px_rgba(27,27,27,0.38)]">
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="border-b border-stone-200 px-5 py-5 sm:px-7 lg:border-b-0 lg:border-r">
              <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#C92232]">
                <span className="h-px w-5 bg-[#C92232]" />
                <span>{language === 'bn' ? 'যাত্রা পরিকল্পনা' : 'Journey planner'}</span>
              </div>
              <h2 className="mt-2 text-xl font-black tracking-tight text-stone-900 sm:text-2xl">
                {language === 'bn' ? 'আপনি কোথায় যাবেন?' : 'Where are you going?'}
              </h2>
              <p className="mt-1 text-xs leading-5 text-stone-500">
                {language === 'bn' ? 'শুরু ও গন্তব্য নির্বাচন করে ভাড়া দেখুন।' : 'Choose your stops to preview the indicative fare.'}
              </p>
            </div>

            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 gap-3 p-5 sm:p-6 md:grid-cols-[1fr_auto_1fr_auto] md:items-end">
              <div className="min-w-0">
                <label htmlFor="journey-origin" className="mb-2 block text-[11px] font-bold text-stone-500">
                  {language === 'bn' ? 'যাত্রা শুরু' : 'From'}
                </label>
                <select
                  id="journey-origin"
                  value={fromStopId}
                  onChange={(event) => {
                    setFromStopId(event.target.value);
                    setRouteError('');
                  }}
                  className="h-12 w-full min-w-0 border border-stone-200 bg-[#FAF9F7] px-3 text-sm font-bold text-stone-900 outline-none transition focus:border-[#C92232] focus:ring-2 focus:ring-[#C92232]/15"
                >
                  {INITIAL_STOPS.map((stop) => (
                    <option key={stop.id} value={stop.id}>
                      {stop.sequence}. {language === 'bn' ? stop.nameBn : stop.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleSwapStops}
                aria-label={language === 'bn' ? 'শুরু ও গন্তব্য অদলবদল করুন' : 'Swap origin and destination'}
                title={language === 'bn' ? 'শুরু ও গন্তব্য অদলবদল করুন' : 'Swap stops'}
                className="mx-auto flex h-10 w-10 items-center justify-center border border-stone-200 text-stone-500 transition hover:border-[#C92232] hover:text-[#C92232] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C92232] md:mb-1"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>

              <div className="min-w-0">
                <label htmlFor="journey-destination" className="mb-2 block text-[11px] font-bold text-stone-500">
                  {language === 'bn' ? 'গন্তব্য' : 'To'}
                </label>
                <select
                  id="journey-destination"
                  value={toStopId}
                  onChange={(event) => {
                    setToStopId(event.target.value);
                    setRouteError('');
                  }}
                  className="h-12 w-full min-w-0 border border-stone-200 bg-[#FAF9F7] px-3 text-sm font-bold text-stone-900 outline-none transition focus:border-[#C92232] focus:ring-2 focus:ring-[#C92232]/15"
                >
                  {INITIAL_STOPS.map((stop) => (
                    <option key={stop.id} value={stop.id}>
                      {stop.sequence}. {language === 'bn' ? stop.nameBn : stop.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 bg-[#C92232] px-6 text-sm font-extrabold text-white transition-colors hover:bg-[#A91D2A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C92232] md:mb-0.5"
              >
                <Search className="h-4 w-4" />
                <span>{language === 'bn' ? 'যাত্রা খুঁজুন' : 'Find journey'}</span>
              </button>

              {routeError && (
                <p role="alert" className="text-xs font-semibold text-[#B91F2D] md:col-span-4">
                  {routeError}
                </p>
              )}

              {fareResult && fromStopId !== toStopId && (
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3 md:col-span-4">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <ShieldCheck className="h-4 w-4 text-[#C92232]" />
                    <span>
                      {language === 'bn'
                        ? toBengaliDigits(fareResult.stagesCount) + 'টি স্টেজ · নির্দেশক ভাড়া'
                        : fareResult.stagesCount + ' stages · indicative fare'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="mr-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                      {language === 'bn' ? 'জনপ্রতি' : 'Per passenger'}
                    </span>
                    <strong className="text-lg font-black tracking-tight text-[#C92232]">
                      {formatBDT(fareResult.fareBDT)}
                    </strong>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
