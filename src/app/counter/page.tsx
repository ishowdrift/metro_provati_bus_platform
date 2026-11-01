'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_STOPS, INITIAL_BOOTHS, INITIAL_BUSES } from '@/data/mockData';
import { calculateFare, formatBDT, toBengaliDigits, formatTimeAgoBn } from '@/lib/fareCalculator';
import {
  Building2,
  Ticket,
  Printer,
  DollarSign,
  Users,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  PlusCircle,
  GraduationCap,
  Navigation,
  Bus as BusIcon,
  Check,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  MapPin,
  Compass,
} from 'lucide-react';
import { TicketBooking, Bus } from '@/types';

export default function CounterDashboardPage() {
  const { user, role } = useAuth();
  const { language } = useLanguage();

  // Selected Counter Booth (default: booth-1 Kaptai Master Counter)
  const [counterId, setCounterId] = useState('booth-1');
  const [selectedBusId, setSelectedBusId] = useState('bus-mp-101');
  const [direction, setDirection] = useState<'kaptai_to_patenga' | 'patenga_to_kaptai'>(
    'kaptai_to_patenga'
  );

  // Student Discount 5% Concession Toggle
  const [isStudentFare, setIsStudentFare] = useState<boolean>(false);

  // Seat state & layout
  const [availableSeats, setAvailableSeats] = useState<string[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['L1']);
  const [totalSeatsCount, setTotalSeatsCount] = useState<number>(36);

  // Walk-in Passenger Form details
  const [destStopId, setDestStopId] = useState('stop-7'); // Default: Agrabad
  const [passengerName, setPassengerName] = useState('ওয়াক-ইন যাত্রী');
  const [passengerPhone, setPassengerPhone] = useState('01800000000');

  // Logs & Live Telemetry
  const [issuedTickets, setIssuedTickets] = useState<TicketBooking[]>([]);
  const [liveBuses, setLiveBuses] = useState<Bus[]>(INITIAL_BUSES);
  const [loading, setLoading] = useState(false);
  const [quickIssuingStopId, setQuickIssuingStopId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Printable Ticket Receipt Modal State
  const [activePrintTicket, setActivePrintTicket] = useState<TicketBooking | null>(null);
  const printSlipRef = useRef<HTMLDivElement>(null);

  // Fetch current booth & downstream stops
  const currentBooth = INITIAL_BOOTHS.find((b) => b.id === counterId) || INITIAL_BOOTHS[0];
  const currentStop =
    INITIAL_STOPS.find((s) => s.id === currentBooth.stopId) || INITIAL_STOPS[0];

  // Downstream stops list in direction of travel
  const downstreamStops = INITIAL_STOPS.filter((stop) => {
    if (direction === 'kaptai_to_patenga') {
      return stop.sequence > currentStop.sequence;
    } else {
      return stop.sequence < currentStop.sequence;
    }
  }).sort((a, b) =>
    direction === 'kaptai_to_patenga' ? a.sequence - b.sequence : b.sequence - a.sequence
  );

  // Calculate fare with 5% student discount support
  const getCalculatedFare = useCallback(
    (fromStopId: string, toStopId: string, studentConcession: boolean) => {
      const res = calculateFare(fromStopId, toStopId);
      const regularFare = res?.fareBDT || 30;
      if (!studentConcession) {
        return {
          regularFare,
          finalFare: regularFare,
          discountBDT: 0,
          stagesCount: res?.stagesCount || 1,
        };
      }
      // 5% Student Discount
      const discountBDT = Math.max(1, Math.round(regularFare * 0.05));
      const finalFare = Math.max(5, regularFare - discountBDT);
      return {
        regularFare,
        finalFare,
        discountBDT,
        stagesCount: res?.stagesCount || 1,
      };
    },
    []
  );

  // Active fare for manual form
  const activeFareInfo = getCalculatedFare(currentBooth.stopId, destStopId, isStudentFare);
  const totalAmount = activeFareInfo.finalFare * Math.max(1, selectedSeats.length);

  // Fetch seat status for the selected bus
  const fetchSeatStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/seats/status?busId=${selectedBusId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.seats)) {
        const avail: string[] = [];
        const booked: string[] = [];
        data.seats.forEach((s: any) => {
          if (s.status === 'available') avail.push(s.seatNumber);
          else booked.push(s.seatNumber);
        });
        setAvailableSeats(avail);
        setBookedSeats(booked);
        setTotalSeatsCount(data.totalSeats || 36);

        // If selected seat is no longer available, select first available seat
        if (selectedSeats.length > 0 && booked.includes(selectedSeats[0]) && avail.length > 0) {
          setSelectedSeats([avail[0]]);
        }
      }
    } catch {
      // Fallback local seat data
      const allSeatIds = [
        'W1',
        'W2',
        'L1',
        'L2',
        'L3',
        'L4',
        'L5',
        'L6',
        'L7',
        'L8',
        'L9',
        'L10',
        'L11',
        'L12',
        'L13',
        'L14',
        'L15',
        'L16',
        'R1',
        'R2',
        'R3',
        'R4',
        'R5',
        'R6',
        'R7',
        'R8',
        'R9',
        'R10',
        'R11',
        'R12',
        'R13',
        'R14',
        'R15',
        'R16',
        'L17',
        'L18',
      ];
      setAvailableSeats(allSeatIds.filter((s) => !['L1', 'R3', 'L7'].includes(s)));
      setBookedSeats(['L1', 'R3', 'L7']);
    }
  }, [selectedBusId, selectedSeats]);

  // Fetch issued tickets
  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.success && Array.isArray(data.bookings)) {
        setIssuedTickets(data.bookings);
      }
    } catch {
      // Ignore
    }
  }, []);

  // Fetch live bus telemetries (Live GPS location shared by supervisor)
  const fetchLiveBuses = useCallback(async () => {
    try {
      const res = await fetch('/api/tracking/buses');
      const data = await res.json();
      if (data.success && Array.isArray(data.buses)) {
        setLiveBuses(data.buses);
      }
    } catch {
      // Ignore
    }
  }, []);

  // Polling intervals for seats, buses and bookings
  useEffect(() => {
    fetchSeatStatus();
    fetchBookings();
    fetchLiveBuses();

    const interval = setInterval(() => {
      fetchSeatStatus();
      fetchLiveBuses();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchSeatStatus, fetchBookings, fetchLiveBuses]);

  // Trigger print modal
  const openPrintModal = (ticket: TicketBooking) => {
    setActivePrintTicket(ticket);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.print();
      }
    }, 200);
  };

  // Quick 1-Click Ticket Issue & Print for downstream destination
  const handleQuickIssueTicket = async (targetStopId: string) => {
    setQuickIssuingStopId(targetStopId);
    setMessage(null);

    // Pick chosen seat or auto-pick first available seat
    let seatToAssign = selectedSeats[0];
    if (!seatToAssign || bookedSeats.includes(seatToAssign)) {
      seatToAssign = availableSeats[0] || 'L1';
    }

    const fareData = getCalculatedFare(currentBooth.stopId, targetStopId, isStudentFare);
    const targetStop = INITIAL_STOPS.find((s) => s.id === targetStopId);

    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passengerName: isStudentFare ? 'শিক্ষার্থী যাত্রী' : 'কাউন্টার ওয়াক-ইন',
          passengerPhone: passengerPhone || '01800000000',
          routeId: 'route-mp-1',
          direction,
          fromStopId: currentBooth.stopId,
          toStopId: targetStopId,
          fromStopNameBn: currentBooth.stopNameBn,
          toStopNameBn: targetStop?.nameBn || '',
          selectedSeats: [seatToAssign],
          standingCount: 0,
          farePerPersonBDT: fareData.finalFare,
          totalFareBDT: fareData.finalFare,
          paymentMethod: 'cash_at_counter',
          busId: selectedBusId,
          counterId: currentBooth.id,
          isStudentDiscount: isStudentFare,
          discountAmountBDT: fareData.discountBDT,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.booking) {
        setMessage(`টিকেট ইস্যু সম্পন্ন! সিট: ${seatToAssign} (${formatBDT(fareData.finalFare)})`);
        fetchBookings();
        fetchSeatStatus();
        // Immediately open print preview modal & invoke browser print
        openPrintModal(data.booking);
      } else {
        setMessage(data.error || 'টিকেট ইস্যু করা সম্ভব হয়নি।');
      }
    } catch {
      setMessage('সার্ভার সংযোগ ত্রুটি।');
    } finally {
      setQuickIssuingStopId(null);
    }
  };

  // Standard Manual Ticket Form Submission
  const handleIssueCashTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const destStop = INITIAL_STOPS.find((s) => s.id === destStopId);
      const seatsToBook = selectedSeats.length > 0 ? selectedSeats : [availableSeats[0] || 'L1'];

      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passengerName,
          passengerPhone,
          routeId: 'route-mp-1',
          direction,
          fromStopId: currentBooth.stopId,
          toStopId: destStopId,
          fromStopNameBn: currentBooth.stopNameBn,
          toStopNameBn: destStop?.nameBn || '',
          selectedSeats: seatsToBook,
          standingCount: 0,
          farePerPersonBDT: activeFareInfo.finalFare,
          totalFareBDT: activeFareInfo.finalFare * seatsToBook.length,
          paymentMethod: 'cash_at_counter',
          busId: selectedBusId,
          counterId: currentBooth.id,
          isStudentDiscount: isStudentFare,
          discountAmountBDT: activeFareInfo.discountBDT * seatsToBook.length,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.booking) {
        setMessage(`টিকেট ইস্যু সফল! রেফারেন্স: ${data.booking.reference}`);
        fetchBookings();
        fetchSeatStatus();
        openPrintModal(data.booking);
      } else {
        setMessage(data.error || 'টিকেট ইস্যু করা সম্ভব হয়নি।');
      }
    } catch {
      setMessage('সার্ভার সংযোগ ত্রুটি।');
    } finally {
      setLoading(false);
    }
  };

  // Auto-Select next available empty seat
  const autoSelectNextEmptySeat = () => {
    if (availableSeats.length > 0) {
      setSelectedSeats([availableSeats[0]]);
      setMessage(`খালি আসন ${availableSeats[0]} স্বয়ংক্রিয়ভাবে নির্বাচন করা হয়েছে।`);
    } else {
      setMessage('দুঃখিত, এই বাসে কোনো খালি আসন নেই!');
    }
  };

  // Route Guard Check
  if (role !== 'counter_representative' && role !== 'counter_manager' && role !== 'super_admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-red-100 p-6 sm:p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {language === 'bn' ? 'সংরক্ষিত কাউন্টার ড্যাশবোর্ড' : 'Restricted Counter Portal'}
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {language === 'bn'
                ? 'এই কাউন্টার ড্যাশবোর্ডটি শুধুমাত্র অনুমোদিত কাউন্টার প্রতিনিধিদের জন্য। সাধারণ যাত্রী অ্যাকাউন্টের মাধ্যমে টিকিট ইস্যু বা ক্যাশ ট্রানজ্যাকশন অনুমোদিত নয়।'
                : 'This portal is restricted to authorized counter representatives. Special Counter Code and Password required.'}
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <Link
              href="/login"
              className="block w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition"
            >
              {language === 'bn' ? 'কাউন্টার প্রতিনিধি হিসেবে লগইন করুন' : 'Login as Counter Representative'}
            </Link>
            <Link
              href="/"
              className="block w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition"
            >
              {language === 'bn' ? 'যাত্রী হোমে ফিরে যান' : 'Return to Home'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalSalesToday = issuedTickets
    .filter((t) => t.paymentStatus === 'paid' || t.paymentStatus === 'sandbox_paid')
    .reduce((sum, t) => sum + t.totalFareBDT, 0);

  const selectedBusObj = liveBuses.find((b) => b.id === selectedBusId) || liveBuses[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8">
      {/* 1. Header Banner & Counter Identity */}
      <div className="bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center shadow-lg border border-white/30 backdrop-blur-sm">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>কাউন্টার মাস্টার কন্ট্রোল</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              {currentBooth.nameBn}
            </h1>
            <p className="text-xs text-red-100">
              কাউন্টার প্রতিনিধি: <strong>{user?.name || 'আহমেদ কবির'}</strong> • কোড:{' '}
              <span className="font-mono font-bold bg-red-800/80 px-1.5 py-0.5 rounded">
                MP-CTR-101
              </span>
            </p>
          </div>
        </div>

        {/* Counter selector, bus selection & direction */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold text-red-100 uppercase tracking-wider mb-0.5">
              কাউন্টার লোকেশন
            </label>
            <select
              value={counterId}
              onChange={(e) => setCounterId(e.target.value)}
              className="px-3 py-2 bg-red-800/90 border border-red-400 rounded-xl text-xs font-bold text-white focus:outline-none"
            >
              {INITIAL_BOOTHS.map((b) => (
                <option key={b.id} value={b.id} className="text-slate-900 bg-white">
                  {b.nameBn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-red-100 uppercase tracking-wider mb-0.5">
              রুটের বাস
            </label>
            <select
              value={selectedBusId}
              onChange={(e) => setSelectedBusId(e.target.value)}
              className="px-3 py-2 bg-red-800/90 border border-red-400 rounded-xl text-xs font-bold text-white focus:outline-none"
            >
              {liveBuses.map((b) => (
                <option key={b.id} value={b.id} className="text-slate-900 bg-white">
                  {b.registrationNumberBn} ({b.modelBn})
                </option>
              ))}
            </select>
          </div>

          <a
            href="tel:01712000001"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-red-50 text-red-700 rounded-xl text-xs font-bold transition shadow-sm self-end"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>সুপারভাইজার হটলাইন</span>
          </a>
        </div>
      </div>

      {/* 2. LIVE BUS FLEET RADAR & ARRIVAL TIMING (Location shared by Supervisor) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-red-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="flex h-3.5 w-3.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600" />
            </span>
            <h3 className="font-extrabold text-slate-900 text-base">
              বাসের লাইভ জিপিএস অবস্থান ও কাউন্টারে পৌঁছানোর সময়সূচি
            </h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              সুপারভাইজার লাইভ সিঙ্ক
            </span>
          </div>
          <button
            onClick={() => {
              fetchLiveBuses();
              fetchSeatStatus();
            }}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-red-600"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>রিফ্রেশ</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {liveBuses.map((b) => {
            const isAssigned = b.id === selectedBusId;
            const isLive =
              b.isLiveSharing !== false &&
              b.freshness === 'active' &&
              b.status === 'on_duty';

            return (
              <div
                key={b.id}
                onClick={() => setSelectedBusId(b.id)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                  isAssigned
                    ? 'border-red-600 bg-red-50/50 ring-2 ring-red-500/20'
                    : isLive
                    ? 'border-slate-200 bg-white hover:border-red-200'
                    : 'border-amber-200 bg-amber-50/30 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-xs text-slate-900">
                    {b.registrationNumberBn}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isLive
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {isLive ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        <span>🟢 লাইভ জিপিএস</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 text-amber-700" />
                        <span>⏱️ সর্বশেষ অবস্থান</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="text-xs text-slate-600 flex items-center gap-1 mb-1">
                  <MapPin className="w-3 h-3 text-red-600 shrink-0" />
                  <span className="truncate">
                    {isLive ? (
                      <>
                        {b.direction === 'kaptai_to_patenga' ? 'কাঠগড় অভিমুখী' : 'কাপ্তাই অভিমুখী'} •{' '}
                        <strong className="text-slate-800">{toBengaliDigits(b.speedKmh)} কিমি/ঘ</strong>
                      </>
                    ) : (
                      <span className="text-amber-800 font-medium">
                        সর্বশেষ: {b.lastKnownStopNameBn || b.nearestStopNameBn || 'কাছাকাছি'} ({formatTimeAgoBn(b.lastUpdated)})
                      </span>
                    )}
                  </span>
                </div>

                {!isLive && (
                  <div className="text-[10px] text-amber-700 font-semibold mb-1 flex items-center gap-1">
                    <span>🛡️ জিপিএস বন্ধ (আস্থার তথ্য সংরক্ষিত)</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                  <span className="text-slate-500">
                    খালি আসন:{' '}
                    <strong className="text-emerald-600 font-mono">
                      {isAssigned ? toBengaliDigits(availableSeats.length) : '২২'}টি
                    </strong>
                  </span>
                  <span className="text-red-600 font-bold">
                    {isAssigned ? '✓ নির্বাচিত' : 'সিলেক্ট করুন'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SEAT AVAILABILITY OVERVIEW & FAST SEAT PICKER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <BusIcon className="w-5 h-5 text-red-600" />
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                আসন প্রাপ্যতা ও সিট বুকিং ড্যাশবোর্ড ({selectedBusObj.registrationNumberBn})
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              লগইন অবস্থায় এক ক্লিকেই খালি আসন দেখে সরাসরি টিকিট বুকিং নিশ্চিত করা যাবে।
            </p>
          </div>

          {/* Quick Seat Metrics Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>খালি আসন: {toBengaliDigits(availableSeats.length)} টি</span>
            </span>

            <span className="px-3 py-1.5 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <span>বুকড আসন: {toBengaliDigits(bookedSeats.length)} টি</span>
            </span>

            <button
              onClick={autoSelectNextEmptySeat}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>পরের খালি সিট দ্রুত নিন</span>
            </button>
          </div>
        </div>

        {/* Visual Interactive Bus Seat Grid (2x2 layout) */}
        <div>
          <div className="flex items-center justify-between mb-3 text-xs text-slate-600">
            <span className="font-semibold">
              নির্বাচিত আসন:{' '}
              <strong className="text-red-600 font-mono">
                {selectedSeats.join(', ') || 'কোনো আসন নির্বাচিত নেই'}
              </strong>
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-white border border-slate-300" /> খালি
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-red-600" /> নির্বাচিত
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-slate-300" /> বুকড
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-purple-100 border border-purple-300" /> মহিলা
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl overflow-x-auto">
            {/* Front of Bus Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>দরজা / প্রবেশপথ</span>
              <span>ইঞ্জিন ও চালকের আসন (Driver)</span>
            </div>

            {/* Seat Rows Matrix */}
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                'W1',
                'W2',
                'L1',
                'L2',
                'R1',
                'R2',
                'L3',
                'L4',
                'R3',
                'R4',
                'L5',
                'L6',
                'R5',
                'R6',
                'L7',
                'L8',
                'R7',
                'R8',
                'L9',
                'L10',
                'R9',
                'R10',
                'L11',
                'L12',
                'R11',
                'R12',
                'L13',
                'L14',
                'R13',
                'R14',
                'L15',
                'L16',
                'R15',
                'R16',
                'L17',
                'L18',
              ].map((sNum) => {
                const isBooked = bookedSeats.includes(sNum);
                const isSelected = selectedSeats.includes(sNum);
                const isWomen = sNum.startsWith('W');

                return (
                  <button
                    key={sNum}
                    type="button"
                    disabled={isBooked}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedSeats(selectedSeats.filter((s) => s !== sNum));
                      } else {
                        setSelectedSeats([...selectedSeats, sNum]);
                      }
                    }}
                    className={`w-11 h-10 sm:w-12 sm:h-11 rounded-xl text-xs font-bold font-mono transition flex items-center justify-center relative active:scale-95 ${
                      isBooked
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed line-through'
                        : isSelected
                        ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400 font-extrabold'
                        : isWomen
                        ? 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                        : 'bg-white text-slate-800 border border-slate-200 hover:border-red-400 hover:bg-red-50'
                    }`}
                  >
                    <span>{sNum}</span>
                    {isWomen && !isBooked && !isSelected && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 4. ⚡ FAST 1-CLICK DOWNSTREAM DESTINATION CARDS & STUDENT CONCESSION (5% OFF) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-red-500 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[11px] font-bold mb-1">
              <Sparkles className="w-3 h-3 text-red-600" />
              <span>কাউন্টার থেকে যাওয়ার দিকের সব স্টপ ও ভাড়া</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              ওয়ান-ক্লিক এক্সপ্রেস টিকিট ও তাৎক্ষণিক প্রিন্ট
            </h2>
            <p className="text-xs text-slate-500">
              বর্তমান কাউন্টার (<strong>{currentBooth.nameBn}</strong>) থেকে যে কোনো গন্তব্যে ১-ক্লিকেই
              স্বয়ংক্রিয় টিকিট ইস্যু ও প্রিন্টার চালু হবে।
            </p>
          </div>

          {/* Student 5% Concession Toggle Button */}
          <div className="flex items-center gap-3 bg-red-50 p-2 sm:p-2.5 rounded-2xl border border-red-200">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-xl transition ${
                  isStudentFare ? 'bg-red-600 text-white' : 'bg-white text-slate-600'
                }`}
              >
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  শিক্ষার্থী হাফ/ছাড় ভাড়া
                </span>
                <span className="text-[10px] text-red-700 font-semibold block">
                  ৫% বিশেষ মূল্যছাড়
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsStudentFare(!isStudentFare)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                isStudentFare ? 'bg-red-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="bg-white w-4 h-4 rounded-full shadow-md" />
            </button>
          </div>
        </div>

        {/* Direction Switcher Pill */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-500">যাত্রার দিক:</span>
          <button
            onClick={() => setDirection('kaptai_to_patenga')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              direction === 'kaptai_to_patenga'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ➔ কাঠগড় অভিমুখে
          </button>
          <button
            onClick={() => setDirection('patenga_to_kaptai')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              direction === 'patenga_to_kaptai'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ➔ কাপ্তাই রাস্তার মাথা অভিমুখে
          </button>
        </div>

        {/* Downstream Stops One-Click Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
          {downstreamStops.map((stop) => {
            const fareData = getCalculatedFare(currentBooth.stopId, stop.id, isStudentFare);
            const isProcessing = quickIssuingStopId === stop.id;

            return (
              <div
                key={stop.id}
                className="p-4 rounded-2xl border-2 border-slate-200 hover:border-red-500 bg-white hover:bg-red-50/20 transition-all shadow-xs flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      স্টপ #{stop.sequence}
                    </span>
                    {isStudentFare && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                        ৫% ছাড়
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-red-700 transition">
                    {stop.nameBn}
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-0.5">
                    দূরত্ব: ~{fareData.stagesCount * 3} কিমি • {fareData.stagesCount} স্টেজ
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    {isStudentFare ? (
                      <div>
                        <span className="text-xs text-slate-400 line-through mr-1 font-mono">
                          {formatBDT(fareData.regularFare)}
                        </span>
                        <span className="text-xl font-black text-red-600 font-mono">
                          {formatBDT(fareData.finalFare)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl font-black text-red-600 font-mono">
                        {formatBDT(fareData.finalFare)}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleQuickIssueTicket(stop.id)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 active:scale-95"
                  >
                    <Printer className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                    <span>{isProcessing ? 'ইস্যু হচ্ছে...' : '১-ক্লিকে প্রিন্ট'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Custom Manual Walk-in Ticket Form & Recent Tickets Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Custom Manual POS Ticket Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                ম্যানুয়াল ক্যাশ টিকিট ইস্যু (Custom POS)
              </h3>
            </div>
            <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
              ক্যাশ
            </span>
          </div>

          {message && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleIssueCashTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                যাত্রীর গন্তব্য স্টপ *
              </label>
              <select
                value={destStopId}
                onChange={(e) => setDestStopId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {INITIAL_STOPS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.sequence}. {s.nameBn}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  যাত্রীর নাম
                </label>
                <input
                  type="text"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  মোবাইল নম্বর
                </label>
                <input
                  type="tel"
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                />
              </div>
            </div>

            {/* Student Concession Switch in manual form */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-red-600" />
                <span className="text-xs font-bold text-slate-800">শিক্ষার্থী ভাড়া (৫% ছাড়)</span>
              </div>
              <input
                type="checkbox"
                checked={isStudentFare}
                onChange={(e) => setIsStudentFare(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-semibold">আদায়যোগ্য নগদ ভাড়া</div>
                <div className="text-xs font-bold text-slate-800">
                  {selectedSeats.length} টি আসন (সিট: {selectedSeats.join(', ') || 'Auto'})
                </div>
              </div>
              <div className="text-xl font-black text-red-600 font-mono">
                {formatBDT(totalAmount)}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>নগদ গ্রহণ ও টিকিট প্রিন্ট করুন</span>
            </button>
          </form>
        </div>

        {/* Right: Issued Tickets Log */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                আজকের ইস্যুকৃত টিকিটসমূহ (কাউন্টার রেজিস্ট্রি)
              </h3>
              <p className="text-xs text-slate-500">
                মোট আদায়: <strong className="font-mono text-red-600">{formatBDT(totalSalesToday)}</strong> •{' '}
                {toBengaliDigits(issuedTickets.length)} টি টিকিট
              </p>
            </div>
            <button
              onClick={fetchBookings}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto">
            {issuedTickets.map((tkt) => (
              <div key={tkt.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded">
                      {tkt.reference}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{tkt.passengerName}</span>
                    {tkt.isStudentDiscount && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                        শিক্ষার্থী ৫%
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {tkt.fromStopNameBn} ➔ {tkt.toStopNameBn} • সিট:{' '}
                    <strong className="font-mono text-slate-800">
                      {tkt.selectedSeats.join(', ') || 'স্ট্যান্ডিং'}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-slate-900">
                      {formatBDT(tkt.totalFareBDT)}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                      নগদ আদায়
                    </span>
                  </div>

                  <button
                    onClick={() => openPrintModal(tkt)}
                    title="পুনরায় টিকিট প্রিন্ট করুন"
                    className="p-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-lg transition"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. 🖨️ 80mm POS Thermal Bus Ticket Print Preview Modal */}
      {activePrintTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-red-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">কাউন্টার থার্মাল টিকিট স্লিপ</h3>
              </div>
              <button
                onClick={() => setActivePrintTicket(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Authentic 80mm POS Bus Counter Printable Receipt */}
            <div
              ref={printSlipRef}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-300 font-mono text-xs text-slate-900 space-y-3"
            >
              <div className="text-center space-y-0.5 border-b border-dashed border-slate-300 pb-2">
                <div className="font-extrabold text-sm text-slate-900">মেট্রো প্রভাতী পরিবহন</div>
                <div className="text-[10px] text-slate-500">ডিজিটাল ট্রান্সপোর্ট প্ল্যাটফর্ম, চট্টগ্রাম</div>
                <div className="text-[10px] font-bold text-red-700">{currentBooth.nameBn}</div>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">টিকিট নং:</span>
                  <span className="font-bold">{activePrintTicket.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">তারিখ ও সময়:</span>
                  <span>{new Date().toLocaleString('bn-BD')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">বাস নম্বর:</span>
                  <span className="font-bold">চট্টমেট্রো-ব ১১-০১০১</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">যাত্রী:</span>
                  <span>{activePrintTicket.passengerName}</span>
                </div>
              </div>

              <div className="p-2 bg-white rounded-lg border border-slate-200 space-y-1">
                <div className="text-[11px] font-bold">
                  {activePrintTicket.fromStopNameBn} ➔ {activePrintTicket.toStopNameBn}
                </div>
                <div className="flex justify-between text-xs font-bold text-red-600">
                  <span>আসন নম্বর:</span>
                  <span>{activePrintTicket.selectedSeats.join(', ') || 'স্ট্যান্ডিং'}</span>
                </div>
                {activePrintTicket.isStudentDiscount && (
                  <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded text-center">
                    ★ শিক্ষার্থী ছাড় (৫% ডিসকাউন্ট সমন্বিত)
                  </div>
                )}
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1 text-xs">
                <div className="flex justify-between font-extrabold text-base text-slate-900">
                  <span>নগদ গ্রহণ:</span>
                  <span className="text-red-700">{formatBDT(activePrintTicket.totalFareBDT)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>পেমেন্ট স্ট্যাটাস:</span>
                  <span className="font-bold text-emerald-600">পরিশোধিত (PAID - Cash)</span>
                </div>
              </div>

              <div className="text-center pt-2 border-t border-dashed border-slate-300 text-[10px] text-slate-500 space-y-0.5">
                <div>যাত্রায় মেট্রো প্রভাতী সাথে থাকার জন্য ধন্যবাদ!</div>
                <div>হেল্পলাইন: 01798542469, 01918695599</div>
                <div className="text-[9px] font-mono tracking-widest text-slate-400 mt-1">
                  * MP-POS-SECURE-TOKEN-OK *
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2 print:hidden pt-2">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') window.print();
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট করুন</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePrintTicket(null)}
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
