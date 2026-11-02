'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { SeatMapSelector } from '@/components/SeatMapSelector';
import { INITIAL_STOPS } from '@/data/mockData';
import { calculateFare, formatBDT, toBengaliDigits } from '@/lib/fareCalculator';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { StaffSeatMonitor } from '@/components/StaffSeatMonitor';
import { TicketBooking, RouteDirection } from '@/types';
import {
  Ticket,
  QrCode,
  CheckCircle2,
  Phone,
  Printer,
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowRightLeft,
  Compass,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

function TicketsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, t } = useLanguage();
  const { role, user } = useAuth();

  const refParam = searchParams.get('ref');
  const fromParam = searchParams.get('from') || 'stop-1';
  const toParam = searchParams.get('to') || 'stop-10';

  const [fromStopId, setFromStopId] = useState(fromParam);
  const [toStopId, setToStopId] = useState(toParam);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [standingCount, setStandingCount] = useState<number>(0);
  const [totalFare, setTotalFare] = useState<number>(0);
  const [passengerName, setPassengerName] = useState<string>('');
  const [passengerPhone, setPassengerPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'cash_at_counter'>('bkash');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [forcePassengerView, setForcePassengerView] = useState<boolean>(false);

  const isStaff =
    (role === 'bus_supervisor' ||
      role === 'counter_representative' ||
      role === 'counter_manager' ||
      role === 'operations_admin' ||
      role === 'super_admin') &&
    !refParam;

  // Ticket Lookup state if ?ref= is in URL
  const [confirmedTicket, setConfirmedTicket] = useState<TicketBooking | null>(null);
  const [lookupLoading, setLookupLoading] = useState<boolean>(!!refParam);

  useEffect(() => {
    if (refParam) {
      setLookupLoading(true);
      fetch(`/api/bookings?ref=${refParam}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.booking) {
            setConfirmedTicket(data.booking);
          }
        })
        .catch(() => {})
        .finally(() => setLookupLoading(false));
    }
  }, [refParam]);

  const fromStop = INITIAL_STOPS.find((s) => s.id === fromStopId) || INITIAL_STOPS[0];
  const toStop = INITIAL_STOPS.find((s) => s.id === toStopId) || INITIAL_STOPS[INITIAL_STOPS.length - 1];
  const fareResult = calculateFare(fromStopId, toStopId);
  const farePerPerson = fareResult ? fareResult.fareBDT : 40;

  const handleSwapStops = () => {
    const temp = fromStopId;
    setFromStopId(toStopId);
    setToStopId(temp);
  };

  const handleSeatSelection = (seats: string[], standing: number, calculatedTotal: number) => {
    setSelectedSeats(seats);
    setStandingCount(standing);
    setTotalFare(calculatedTotal);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (fromStopId === toStopId) {
      setBookingError(
        language === 'bn'
          ? 'যাত্রা শুরুর স্থান ও গন্তব্য আলাদা নির্বাচন করুন।'
          : 'Choose two different stops for your journey.'
      );
      return;
    }

    if (!passengerName.trim()) {
      setBookingError(language === 'bn' ? 'অনুগ্রহ করে যাত্রীর নাম লিখুন' : 'Please enter passenger name');
      return;
    }

    if (!passengerPhone.trim() || passengerPhone.length < 11) {
      setBookingError(
        language === 'bn'
          ? 'অনুগ্রহ করে ১১ ডিজিটের সঠিক মোবাইল নম্বর প্রদান করুন'
          : 'Please enter a valid 11-digit mobile number'
      );
      return;
    }

    if (selectedSeats.length === 0 && standingCount === 0) {
      setBookingError(
        language === 'bn'
          ? 'অন্তত একটি আসন বা স্ট্যান্ডিং স্থান নির্বাচন করুন'
          : 'Select at least one seat or standing spot'
      );
      return;
    }

    setSubmitting(true);

    try {
      const direction: RouteDirection =
        (fromStop?.sequence || 1) < (toStop?.sequence || 11)
          ? 'kaptai_to_patenga'
          : 'patenga_to_kaptai';

      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passengerName,
          passengerPhone,
          routeId: 'route-mp-1',
          direction,
          fromStopId,
          toStopId,
          fromStopNameBn: fromStop?.nameBn || '',
          toStopNameBn: toStop?.nameBn || '',
          selectedSeats,
          standingCount,
          farePerPersonBDT: farePerPerson,
          totalFareBDT: totalFare || farePerPerson,
          paymentMethod,
          busId: 'bus-mp-101',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.redirectUrl) {
          router.push(data.redirectUrl);
        } else {
          router.push(`/tickets?ref=${data.booking.reference}`);
        }
      } else {
        setBookingError(data.error || 'বুকিং সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।');
      }
    } catch {
      setBookingError('নেটওয়ার্ক সমস্যা; বুকিং অনুরোধ পাঠানো যায়নি।');
    } finally {
      setSubmitting(false);
    }
  };

  // If viewing a confirmed ticket
  if (lookupLoading) {
    return (
      <main className="min-h-screen bg-[#F1EEE8] flex items-center justify-center py-24">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <Loader2 className="w-9 h-9 animate-spin text-[#C92232] mx-auto" />
          <p className="text-sm text-slate-500 font-medium">
            {language === 'bn' ? 'টিকিট তথ্য লোড হচ্ছে...' : 'Loading ticket details...'}
          </p>
        </div>
      </main>
    );
  }

  if (confirmedTicket) {
    return (
      <main className="min-h-screen bg-[#F1EEE8] py-12">
        <div className="max-w-2xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-[#F2E4E2] text-[#C92232] border border-[#C92232]/20 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#272524] font-display">
              {language === 'bn' ? 'টিকিট সফলভাবে নিশ্চিত হয়েছে!' : 'Ticket Confirmed Successfully!'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              {language === 'bn'
                ? 'বাসে ওঠার সময় বা কাউন্টারে এই ডিজিটাল টিকিট অথবা কিউআর কোডটি প্রদর্শন করুন।'
                : 'Show this digital pass or QR token at the counter or while boarding.'}
            </p>
          </div>

          {/* Digital Ticket Pass Card */}
          <div className="bg-white rounded-3xl border border-[#E5E0D8] shadow-xl overflow-hidden print:border-black">
            {/* Top Pass Header */}
            <div className="bg-gradient-to-r from-[#C92232] via-[#C92232] to-[#A91D2A] text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 text-white flex items-center justify-center shadow-xs">
                  <Ticket className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-white font-display">মেট্রো প্রভাতী</h3>
                  <span className="text-[11px] text-red-100 font-mono tracking-wider">
                    ই-টিকিট বোর্ডিং পাস • LINE MP-01
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-red-200 uppercase font-mono tracking-wider">Reference</span>
                <div className="font-mono font-bold text-white text-sm tracking-wider">
                  {confirmedTicket.reference}
                </div>
              </div>
            </div>

            {/* Ticket Body Details */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                    {language === 'bn' ? 'যাত্রীর নাম' : 'Passenger Name'}
                  </div>
                  <div className="text-base font-extrabold text-[#272524] mt-1">
                    {confirmedTicket.passengerName}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                    {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Phone'}
                  </div>
                  <div className="text-base font-bold text-[#272524] font-mono mt-1">
                    {confirmedTicket.passengerPhone}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                    {language === 'bn' ? 'যাত্রা শুরু' : 'Origin Stop'}
                  </div>
                  <div className="text-sm font-extrabold text-[#272524] mt-1">
                    {confirmedTicket.fromStopNameBn}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                    {language === 'bn' ? 'গন্তব্য' : 'Destination'}
                  </div>
                  <div className="text-sm font-extrabold text-[#272524] mt-1">
                    {confirmedTicket.toStopNameBn}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                    {language === 'bn' ? 'আসন নম্বর' : 'Seats'}
                  </div>
                  <div className="text-sm font-extrabold text-[#C92232] mt-1 font-mono">
                    {confirmedTicket.selectedSeats.length > 0
                      ? confirmedTicket.selectedSeats.join(', ')
                      : 'স্ট্যান্ডিং'}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                    {language === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Payment'}
                  </div>
                  <div className="text-xs font-bold text-slate-700 uppercase mt-1">
                    {confirmedTicket.paymentMethod?.replace('_', ' ')}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                    {language === 'bn' ? 'মোট পরিশোধিত' : 'Total Fare'}
                  </div>
                  <div className="text-base font-black text-[#C92232] font-mono mt-0.5">
                    {formatBDT(confirmedTicket.totalFareBDT)}
                  </div>
                </div>
              </div>

              {/* QR Simulation Box */}
              <div className="p-4 bg-[#F1EEE8] rounded-2xl border border-[#E5E0D8] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-3 bg-white rounded-xl border border-[#E5E0D8] shadow-xs flex-shrink-0">
                    <QrCode className="w-9 h-9 text-[#272524]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#272524]">
                      {language === 'bn' ? 'ডিজিটাল কিউআর ভেরিফিকেশন' : 'Digital QR Verification'}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 truncate max-w-[200px] sm:max-w-xs">
                      {confirmedTicket.qrVerificationToken}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex-shrink-0">
                  {confirmedTicket.paymentStatus === 'paid' || confirmedTicket.paymentStatus === 'sandbox_paid'
                    ? 'VERIFIED'
                    : 'RECORDED'}
                </span>
              </div>
            </div>

            {/* Ticket Footer Actions */}
            <div className="bg-[#FAF8F5] p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#272524] hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>{language === 'bn' ? 'প্রিন্ট / সেভ করুন' : 'Print / Save'}</span>
              </button>

              <button
                type="button"
                onClick={() => router.push('/tickets')}
                className="text-xs font-extrabold text-[#C92232] hover:text-[#A91D2A] transition"
              >
                {language === 'bn' ? 'আরেকটি টিকিট কাটুন →' : 'Book Another Ticket →'}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // If Staff (Supervisor or Counter Representative/Manager) is logged in, show Live Seat Monitor instead of Checkout
  if (isStaff && !forcePassengerView) {
    return (
      <main className="min-h-screen bg-[#F1EEE8] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-bold text-[#C92232] uppercase tracking-wider">
              {language === 'bn' ? 'স্টাফ কন্ট্রোল প্যানেল' : 'Staff Control Panel'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-[#272524] mt-1 font-display">
              {language === 'bn'
                ? 'লাইভ সিট প্রাপ্যতা ও খালি আসন পর্যবেক্ষণ'
                : 'Live Seat Occupancy & Empty Seats Monitor'}
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-3xl">
              {language === 'bn'
                ? 'অন-ডিউটি বাসের আসন স্ট্যাটাস ও সরাসরি খালি সিটের তালিকা একনজরে দেখুন। সুপারভাইজার ও কাউন্টার কর্মীদের টিকিট কাটার প্রয়োজন নেই।'
                : 'Real-time bus seat availability and empty seats dashboard for on-duty transit staff.'}
            </p>
          </div>

          <StaffSeatMonitor onSwitchToPassengerMode={() => setForcePassengerView(true)} />
        </div>
      </main>
    );
  }

  // =========================================================================
  // PASSENGER BOOKING INTERFACE WITH CINEMATIC HERO OVERLAY
  // =========================================================================
  return (
    <main className="min-h-screen bg-[#F1EEE8] pb-24">
      {/* Return to Staff Monitor Banner if Staff in Preview Mode */}
      {isStaff && forcePassengerView && (
        <div className="bg-[#272524] text-white px-4 py-3 border-b border-amber-500/40 relative z-30">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>
                {language === 'bn'
                  ? 'আপনি বর্তমানে সাধারণ যাত্রী টিকিট বুকিং ভিউতে আছেন। স্টাফ হিসেবে আপনার টিকিট কাটার প্রয়োজন নেই।'
                  : 'You are viewing the passenger ticket reservation interface. Transit staff do not need to buy tickets.'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setForcePassengerView(false)}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-black rounded-lg text-xs font-bold transition shadow-2xs self-start sm:self-auto"
            >
              {language === 'bn' ? 'সিট মনিটরে ফিরে যান' : 'Return to Seat Monitor'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO SECTION WITH ART-DIRECTED CHARCOAL OVERLAY */}
      {/* ========================================================================= */}
      <section className="relative w-full h-[380px] sm:h-[450px] lg:h-[490px] overflow-hidden bg-[#1D1B1A]">
        {/* Authentic Metro Probati Bus Photograph */}
        <div className="absolute inset-0">
          <Image
            src="/images/bus-1.jpg"
            alt="মেট্রো প্রভাতী এক্সপ্রেস বাস — চট্টগ্রাম"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center sm:object-[center_32%] filter brightness-90 contrast-[1.08] transform scale-105"
          />
        </div>

        {/* Layer A: Deep Charcoal Tint Base (rgba(29, 27, 26, 0.65)) */}
        <div className="absolute inset-0 bg-[#1D1B1A]/65" />

        {/* Layer B: Directional Horizontal Gradient (Darker on Left for headline legibility) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, rgba(29,27,26,0.92) 0%, rgba(29,27,26,0.70) 50%, rgba(29,27,26,0.25) 100%)',
          }}
        />

        {/* Layer C: Subtle Restrained Red Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -bottom-24 w-[420px] h-[420px] rounded-full bg-[#C92232]/25 blur-[110px]"
        />

        {/* Layer D: Bottom Gradient into Page Canvas (#F1EEE8) for seamless overlap */}
        <div
          className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(29,27,26,0.5) 45%, rgba(241,238,232,0.92) 90%, #F1EEE8 100%)',
          }}
        />

        {/* Hero Editorial Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-start pt-10 sm:pt-14 lg:pt-16">
          <div className="max-w-3xl space-y-3.5">
            {/* Transit Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-mono font-bold border border-white/25 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>METRO PROBATI · JOURNEY PLANNER</span>
            </div>

            {/* Primary Editorial Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] font-display">
              {language === 'bn' ? (
                <>
                  আপনার যাত্রা শুরু হোক <br className="hidden sm:inline" />
                  <span className="text-red-100 font-extrabold">এখান থেকেই।</span>
                </>
              ) : (
                <>
                  Your journey starts <br className="hidden sm:inline" />
                  <span className="text-red-100 font-extrabold">here.</span>
                </>
              )}
            </h1>

            {/* Supporting Copy */}
            <p className="text-xs sm:text-base text-slate-200 max-w-xl font-medium leading-relaxed">
              {language === 'bn'
                ? 'রুট নির্বাচন করুন ও স্বাচ্ছন্দ্যে আসন বুকিং সম্পন্ন করুন। চট্টগ্রামের প্রধান আর্টেরিয়াল করিডোরে আধুনিক ও নিরাপদ গণপরিবহন।'
                : 'Choose your route. Plan your journey with real-time seat reservation across the 24.9 km Chattogram arterial transit corridor.'}
            </p>

            {/* Micro Corridor Metadata Strip */}
            <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-white/80 pt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-black/40 border border-white/15 text-white font-bold">
                LINE MP-01
              </span>
              <span>•</span>
              <span>{language === 'bn' ? 'কাপ্তাই রাস্তার মাথা ⇄ কাঠগড়' : 'Kaptai Matha ⇄ Katgor'}</span>
              <span>•</span>
              <span>{toBengaliDigits('24.9')} KM</span>
              <span>•</span>
              <span className="text-emerald-300 font-bold">{language === 'bn' ? '৫ মিনিট আসন হোল্ড' : '5-Min Lock'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. OVERLAPPING BOOKING INTERFACE */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-24 lg:-mt-28 relative z-20 space-y-6">
        {/* Error Alert */}
        {bookingError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2 shadow-md animate-fade-in-up">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{bookingError}</span>
          </div>
        )}

        {/* Route Wayfinding Summary Ribbon */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E5E0D8] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-[#F2E4E2] text-[#C92232] flex items-center justify-center flex-shrink-0 shadow-xs">
              <MapPin className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm sm:text-base font-black text-[#272524] truncate">
                <span>{language === 'bn' ? fromStop.nameBn : fromStop.nameEn}</span>
                <span className="text-[#C92232]">→</span>
                <span>{language === 'bn' ? toStop.nameBn : toStop.nameEn}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                <span>{fareResult ? toBengaliDigits(fareResult.stagesCount) : '—'}টি স্টেজ</span>
                <span>•</span>
                <span>~{fareResult ? toBengaliDigits(fareResult.estimatedDistanceKm) : '—'} কিমি</span>
                <span>•</span>
                <span className="text-[#C92232] font-bold">ভাড়া: ৳{toBengaliDigits(farePerPerson)}/আসন</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end md:self-auto">
            <button
              type="button"
              onClick={handleSwapStops}
              title={language === 'bn' ? 'স্টপ অদলবদল করুন' : 'Swap origin and destination'}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F1EEE8] hover:bg-[#E5E0D8] text-xs font-bold text-[#272524] transition shadow-xs active:scale-95"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'অদলবদল' : 'Swap'}</span>
            </button>
            <span className="text-xs font-mono font-bold px-3 py-2 bg-[#FAF4EB] text-[#A87936] rounded-xl border border-[#A87936]/30">
              {language === 'bn' ? 'খসড়া তালিকা' : 'Draft Scale'}
            </span>
          </div>
        </div>

        {/* Main Grid: Interactive Seat Map (7 cols) + Passenger Checkout Form (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Seat Layout Map */}
          <div className="lg:col-span-7">
            <SeatMapSelector
              busId="bus-mp-101"
              farePerPersonBDT={farePerPerson}
              onSelectionChange={handleSeatSelection}
            />
          </div>

          {/* Right Column: Passenger Details & Checkout Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E0D8] shadow-xl space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#C92232] mb-1">
                <Ticket className="w-3.5 h-3.5" />
                <span>STEP 02 / COMMUTER CHECKOUT</span>
              </div>
              <h3 className="font-black text-[#272524] text-lg sm:text-xl font-display">
                {language === 'bn' ? 'যাত্রার বিবরণ ও তথ্য' : 'Trip & Passenger Details'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'bn' ? 'আপনার টিকিট নিশ্চিত করতে তথ্য পূরণ করুন' : 'Fill details to confirm reservation'}
              </p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Origin & Destination Selectors */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono">
                    {t('search.from')}
                  </label>
                  <select
                    value={fromStopId}
                    onChange={(e) => setFromStopId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F1EEE8] border border-[#E5E0D8] rounded-xl text-xs font-bold text-[#272524] focus:outline-none focus:ring-2 focus:ring-[#C92232] transition"
                  >
                    {INITIAL_STOPS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.sequence}. {language === 'bn' ? s.nameBn : s.nameEn}
                        {s.isTerminal ? (language === 'bn' ? ' (টার্মিনাল)' : ' (Terminal)') : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono">
                    {t('search.to')}
                  </label>
                  <select
                    value={toStopId}
                    onChange={(e) => setToStopId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F1EEE8] border border-[#E5E0D8] rounded-xl text-xs font-bold text-[#272524] focus:outline-none focus:ring-2 focus:ring-[#C92232] transition"
                  >
                    {INITIAL_STOPS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.sequence}. {language === 'bn' ? s.nameBn : s.nameEn}
                        {s.isTerminal ? (language === 'bn' ? ' (টার্মিনাল)' : ' (Terminal)') : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Passenger Info */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono">
                    {language === 'bn' ? 'যাত্রীর পুরো নাম *' : 'Passenger Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={language === 'bn' ? 'যেমন: মোহাম্মদ রাসেল' : 'e.g. Md. Russel'}
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F1EEE8] border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#272524] focus:outline-none focus:ring-2 focus:ring-[#C92232] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono">
                    {language === 'bn' ? 'মোবাইল নম্বর (১১ ডিজিট) *' : 'Mobile Number (11 digits) *'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="018XXXXXXXX"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F1EEE8] border border-[#E5E0D8] rounded-xl text-xs font-medium font-mono text-[#272524] focus:outline-none focus:ring-2 focus:ring-[#C92232] transition"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
                  {language === 'bn' ? 'পেমেন্ট মাধ্যম নির্বাচন' : 'Payment Method'}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-3 rounded-2xl border text-left font-semibold transition ${
                      paymentMethod === 'bkash'
                        ? 'border-pink-500 bg-pink-50 text-pink-900 shadow-xs ring-2 ring-pink-500/20'
                        : 'border-[#E5E0D8] bg-[#F1EEE8]/60 text-slate-700 hover:bg-[#F1EEE8]'
                    }`}
                  >
                    <div className="font-extrabold">bKash (বিকাশ)</div>
                    <div className="text-[10px] text-slate-500">স্যান্ডবক্স গেটওয়ে</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nagad')}
                    className={`p-3 rounded-2xl border text-left font-semibold transition ${
                      paymentMethod === 'nagad'
                        ? 'border-orange-500 bg-orange-50 text-orange-900 shadow-xs ring-2 ring-orange-500/20'
                        : 'border-[#E5E0D8] bg-[#F1EEE8]/60 text-slate-700 hover:bg-[#F1EEE8]'
                    }`}
                  >
                    <div className="font-extrabold">Nagad (নগদ)</div>
                    <div className="text-[10px] text-slate-500">অনলাইন পেমেন্ট</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('rocket')}
                    className={`p-3 rounded-2xl border text-left font-semibold transition ${
                      paymentMethod === 'rocket'
                        ? 'border-purple-500 bg-purple-50 text-purple-900 shadow-xs ring-2 ring-purple-500/20'
                        : 'border-[#E5E0D8] bg-[#F1EEE8]/60 text-slate-700 hover:bg-[#F1EEE8]'
                    }`}
                  >
                    <div className="font-extrabold">Rocket (রকেট)</div>
                    <div className="text-[10px] text-slate-500">ডিবিবিএল পেমেন্ট</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_at_counter')}
                    className={`p-3 rounded-2xl border text-left font-semibold transition ${
                      paymentMethod === 'cash_at_counter'
                        ? 'border-[#C92232] bg-[#F2E4E2] text-[#C92232] font-black shadow-xs ring-2 ring-[#C92232]/20'
                        : 'border-[#E5E0D8] bg-[#F1EEE8]/60 text-slate-700 hover:bg-[#F1EEE8]'
                    }`}
                  >
                    <div className="font-extrabold">কাউন্টারে ক্যাশ</div>
                    <div className="text-[10px] text-slate-500">সরাসরি কাউন্টারে জমা</div>
                  </button>
                </div>
              </div>

              {/* Total Fare Confirmation Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#C92232] to-[#A91D2A] text-white shadow-md flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-red-100 font-mono uppercase tracking-wider block">
                    {language === 'bn' ? 'পরিশোধযোগ্য মোট ভাড়া' : 'Total Payable'}
                  </span>
                  <div className="text-xs text-white font-bold mt-0.5">
                    {toBengaliDigits(selectedSeats.length)} আসন + {toBengaliDigits(standingCount)} স্ট্যান্ডিং
                  </div>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {formatBDT(totalFare)}
                </div>
              </div>

              {/* Primary CTA Submit Button */}
              <button
                type="submit"
                disabled={submitting || (selectedSeats.length === 0 && standingCount === 0)}
                className="w-full py-4 bg-[#C92232] hover:bg-[#A91D2A] disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-[#C92232]/20 flex items-center justify-center gap-2 active:scale-95"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === 'bn' ? 'প্রক্রিয়াধীন...' : 'Processing...'}</span>
                  </>
                ) : selectedSeats.length === 0 && standingCount === 0 ? (
                  <>
                    <Ticket className="w-4 h-4" />
                    <span>{language === 'bn' ? 'প্রথমে আসন নির্বাচন করুন' : 'Select Seat(s) to Continue'}</span>
                  </>
                ) : (
                  <>
                    <Ticket className="w-4 h-4" />
                    <span>
                      {paymentMethod === 'cash_at_counter'
                        ? language === 'bn'
                          ? 'কাউন্টার টিকিট বুকিং নিশ্চিত করুন'
                          : 'Confirm Counter Booking'
                        : language === 'bn'
                        ? 'পেমেন্ট গেটওয়েতে এগিয়ে যান'
                        : 'Proceed to Payment Gateway'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function TicketsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F1EEE8] flex items-center justify-center py-24">
          <Loader2 className="w-9 h-9 animate-spin text-[#C92232] mx-auto" />
        </main>
      }
    >
      <TicketsContent />
    </Suspense>
  );
}
