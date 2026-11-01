'use client';

import React, { useState, useEffect, Suspense } from 'react';
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

  const fareResult = calculateFare(fromStopId, toStopId);
  const farePerPerson = fareResult ? fareResult.fareBDT : 40;

  const handleSeatSelection = (seats: string[], standing: number, calculatedTotal: number) => {
    setSelectedSeats(seats);
    setStandingCount(standing);
    setTotalFare(calculatedTotal);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

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
      const fromStop = INITIAL_STOPS.find((s) => s.id === fromStopId);
      const toStop = INITIAL_STOPS.find((s) => s.id === toStopId);

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
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto" />
        <p className="text-sm text-slate-500 font-medium">
          {language === 'bn' ? 'টিকিট তথ্য লোড হচ্ছে...' : 'Loading ticket details...'}
        </p>
      </div>
    );
  }

  if (confirmedTicket) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {language === 'bn' ? 'টিকিট সফলভাবে নিশ্চিত হয়েছে!' : 'Ticket Confirmed Successfully!'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'bn'
              ? 'বাসে ওঠার সময় বা কাউন্টারে এই ডিজিটাল টিকিট অথবা কিউআর কোডটি প্রদর্শন করুন।'
              : 'Show this digital pass or QR token at the counter or while boarding.'}
          </p>
        </div>

        {/* Digital Ticket Pass Card */}
        <div className="bg-white rounded-3xl border-2 border-red-100 shadow-xl overflow-hidden print:border-black">
          {/* Top Pass Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-white">মেট্রো প্রভাতী</h3>
                <span className="text-[11px] text-red-100 font-mono tracking-wider">
                  ই-টিকিট পাস • চট্টগ্রাম
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-red-200 uppercase font-mono">Reference</span>
              <div className="font-mono font-bold text-white text-sm tracking-wider">
                {confirmedTicket.reference}
              </div>
            </div>
          </div>

          {/* Ticket Body Details */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">
                  {language === 'bn' ? 'যাত্রীর নাম' : 'Passenger Name'}
                </div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {confirmedTicket.passengerName}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">
                  {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Phone'}
                </div>
                <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                  {confirmedTicket.passengerPhone}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">
                  {language === 'bn' ? 'যাত্রা শুরু' : 'Origin Stop'}
                </div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {confirmedTicket.fromStopNameBn}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">
                  {language === 'bn' ? 'গন্তব্য' : 'Destination'}
                </div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {confirmedTicket.toStopNameBn}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">
                  {language === 'bn' ? 'আসন নম্বর' : 'Seats'}
                </div>
                <div className="text-sm font-extrabold text-red-600 mt-0.5 font-mono">
                  {confirmedTicket.selectedSeats.length > 0
                    ? confirmedTicket.selectedSeats.join(', ')
                    : 'স্ট্যান্ডিং'}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">
                  {language === 'bn' ? 'পেমেন্ট মাধ্যম' : 'Payment'}
                </div>
                <div className="text-xs font-bold text-slate-800 uppercase mt-1">
                  {confirmedTicket.paymentMethod?.replace('_', ' ')}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">
                  {language === 'bn' ? 'মোট পরিশোধিত' : 'Total Fare'}
                </div>
                <div className="text-base font-extrabold text-red-600 font-mono mt-0.5">
                  {formatBDT(confirmedTicket.totalFareBDT)}
                </div>
              </div>
            </div>

            {/* QR Simulation Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <QrCode className="w-10 h-10 text-slate-900" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    {language === 'bn' ? 'ডিজিটাল কিউআর ভেরিফিকেশন' : 'Digital QR Verification'}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 break-all">
                    {confirmedTicket.qrVerificationToken}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                {confirmedTicket.paymentStatus === 'paid' || confirmedTicket.paymentStatus === 'sandbox_paid'
                  ? 'PAID'
                  : 'PENDING'}
              </span>
            </div>
          </div>

          {/* Ticket Footer Actions */}
          <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'bn' ? 'প্রিন্ট / সেভ করুন' : 'Print / Save'}</span>
            </button>

            <button
              onClick={() => router.push('/tickets')}
              className="text-xs font-semibold text-red-600 hover:text-red-700"
            >
              {language === 'bn' ? 'আরেকটি টিকিট কাটুন' : 'Book Another Ticket'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If Staff (Supervisor or Counter Representative/Manager) is logged in, show Live Seat Monitor instead of Checkout
  if (isStaff && !forcePassengerView) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
            {language === 'bn' ? 'স্টাফ কন্ট্রোল প্যানেল' : 'Staff Control Panel'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-1">
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
    );
  }

  // Booking Form View (for Passengers / Guests or staff preview)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Return to Staff Monitor Banner if Staff in Preview Mode */}
      {isStaff && forcePassengerView && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">ℹ️</span>
            <span className="text-xs font-semibold">
              {language === 'bn'
                ? 'আপনি বর্তমানে সাধারণ যাত্রী টিকিট বুকিং ভিউতে আছেন। স্টাফ হিসেবে আপনার টিকিট কাটার প্রয়োজন নেই।'
                : 'You are viewing the passenger ticket reservation interface. Transit staff do not need to buy tickets.'}
            </span>
          </div>
          <button
            onClick={() => setForcePassengerView(false)}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-2xs self-start sm:self-auto"
          >
            {language === 'bn' ? 'সিট মনিটরে ফিরে যান' : 'Return to Seat Monitor'}
          </button>
        </div>
      )}

      <div>
        <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
          {language === 'bn' ? 'অনলাইন আসন বুকিং' : 'Online Seat Reservation'}
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-1">
          {language === 'bn' ? 'আসন নির্বাচন ও টিকিট বুকিং' : 'Select Seats & Book Tickets'}
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          {language === 'bn'
            ? 'পছন্দের আসন বেছে নিন। আসন নির্বাচনের পর ৫ মিনিটের জন্য অস্থায়ীভাবে সংরক্ষিত থাকবে।'
            : 'Choose your desired seats. Seats are held atomically for 5 minutes during checkout.'}
        </p>
      </div>

      {bookingError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{bookingError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Interactive Seat Layout Map */}
        <div className="lg:col-span-7">
          <SeatMapSelector
            busId="bus-mp-101"
            farePerPersonBDT={farePerPerson}
            onSelectionChange={handleSeatSelection}
          />
        </div>

        {/* Right Col: Passenger Details & Checkout Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-lg">
              {language === 'bn' ? 'যাত্রার বিবরণ ও তথ্য' : 'Trip & Passenger Details'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'আপনার টিকিট নিশ্চিত করতে তথ্য পূরণ করুন' : 'Fill details to confirm reservation'}
            </p>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            {/* Origin & Destination Selectors */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('search.from')}
                </label>
                <select
                  value={fromStopId}
                  onChange={(e) => setFromStopId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {INITIAL_STOPS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.sequence}. {language === 'bn' ? s.nameBn : s.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t('search.to')}
                </label>
                <select
                  value={toStopId}
                  onChange={(e) => setToStopId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {INITIAL_STOPS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.sequence}. {language === 'bn' ? s.nameBn : s.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Passenger Info */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {language === 'bn' ? 'যাত্রীর পুরো নাম *' : 'Passenger Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'bn' ? 'যেমন: মোহাম্মদ রাসেল' : 'e.g. Md. Russel'}
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর (১১ ডিজিট) *' : 'Mobile Number (11 digits) *'}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="018XXXXXXXX"
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {language === 'bn' ? 'পেমেন্ট মাধ্যম নির্বাচন' : 'Payment Method'}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-3 rounded-xl border text-left font-semibold transition ${
                    paymentMethod === 'bkash'
                      ? 'border-pink-500 bg-pink-50/50 text-pink-900'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold">bKash (বিকাশ)</div>
                  <div className="text-[10px] text-slate-500">স্যান্ডবক্স গেটওয়ে</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-3 rounded-xl border text-left font-semibold transition ${
                    paymentMethod === 'nagad'
                      ? 'border-orange-500 bg-orange-50/50 text-orange-900'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold">Nagad (নগদ)</div>
                  <div className="text-[10px] text-slate-500">অনলাইন পেমেন্ট</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('rocket')}
                  className={`p-3 rounded-xl border text-left font-semibold transition ${
                    paymentMethod === 'rocket'
                      ? 'border-purple-500 bg-purple-50/50 text-purple-900'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold">Rocket (রকেট)</div>
                  <div className="text-[10px] text-slate-500">ডিবিবিএল পেমেন্ট</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_at_counter')}
                  className={`p-3 rounded-xl border text-left font-semibold transition ${
                    paymentMethod === 'cash_at_counter'
                      ? 'border-red-600 bg-red-50/50 text-red-900 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold">কাউন্টারে ক্যাশ</div>
                  <div className="text-[10px] text-slate-500">সরাসরি কাউন্টারে জমা</div>
                </button>
              </div>
            </div>

            {/* Total Fare Confirmation Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md flex items-center justify-between">
              <div>
                <span className="text-[11px] text-red-100">
                  {language === 'bn' ? 'পরিশোধযোগ্য মোট ভাড়া' : 'Total Payable'}
                </span>
                <div className="text-xs text-white font-semibold">
                  {selectedSeats.length} আসন + {standingCount} স্ট্যান্ডিং
                </div>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">
                {formatBDT(totalFare)}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || (selectedSeats.length === 0 && standingCount === 0)}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 active:scale-95"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{language === 'bn' ? 'প্রক্রিয়াধীন...' : 'Processing...'}</span>
                </>
              ) : (
                <>
                  <Ticket className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'cash_at_counter'
                      ? language === 'bn'
                        ? 'কাউন্টার টিকিট বুকিং সম্পন্ন করুন'
                        : 'Confirm Counter Booking'
                      : language === 'bn'
                      ? 'পেমেন্ট গেটওয়েতে এগিয়ে যান'
                      : 'Proceed to Payment Gateway'}
                  </span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function TicketsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-xl mx-auto py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto" />
        </div>
      }
    >
      <TicketsContent />
    </Suspense>
  );
}
