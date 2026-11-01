'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { BusSeat, StandingCapacity, Bus } from '@/types';
import { INITIAL_BUSES } from '@/data/mockData';
import { toBengaliDigits } from '@/lib/fareCalculator';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  Bus as BusIcon,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Compass,
  ArrowRight,
  ShieldCheck,
  Building2,
  Armchair,
  Sparkles,
  Phone,
  Eye,
} from 'lucide-react';

interface StaffSeatMonitorProps {
  onSwitchToPassengerMode?: () => void;
}

export const StaffSeatMonitor: React.FC<StaffSeatMonitorProps> = ({
  onSwitchToPassengerMode,
}) => {
  const { language } = useLanguage();
  const { role, user } = useAuth();

  const [selectedBusId, setSelectedBusId] = useState<string>('bus-mp-101');
  const [seats, setSeats] = useState<BusSeat[]>([]);
  const [standing, setStanding] = useState<StandingCapacity>({
    approvedCapacity: 15,
    reservedCount: 0,
    isEnabled: true,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'left' | 'right' | 'women'>('all');
  const [selectedSeatDetail, setSelectedSeatDetail] = useState<BusSeat | null>(null);

  const selectedBus = useMemo(
    () => INITIAL_BUSES.find((b) => b.id === selectedBusId) || INITIAL_BUSES[0],
    [selectedBusId]
  );

  const fetchSeatStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/seats/status?busId=${selectedBusId}`);
      const data = await res.json();
      if (data.success) {
        setSeats(data.seats || []);
        if (data.standingCapacity) {
          setStanding(data.standingCapacity);
        }
        setLastRefreshed(new Date().toLocaleTimeString('bn-BD'));
      }
    } catch {
      // Ignore network hiccup
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeatStatus();
    const interval = setInterval(fetchSeatStatus, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusId]);

  // Derived counts
  const totalSeats = seats.length || 38;
  const availableSeats = useMemo(() => seats.filter((s) => s.status === 'available'), [seats]);
  const bookedSeats = useMemo(() => seats.filter((s) => s.status === 'booked'), [seats]);
  const heldSeats = useMemo(() => seats.filter((s) => s.status === 'held'), [seats]);

  const womenSeats = useMemo(
    () => seats.filter((s) => s.side === 'front_women' || s.isWomenReserved),
    [seats]
  );
  const availableWomenSeats = useMemo(
    () => womenSeats.filter((s) => s.status === 'available'),
    [womenSeats]
  );

  const availableStanding = standing.isEnabled
    ? Math.max(0, standing.approvedCapacity - standing.reservedCount)
    : 0;

  // Filtered empty seats list
  const filteredEmptySeats = useMemo(() => {
    return availableSeats.filter((s) => {
      if (activeFilter === 'women') return s.isWomenReserved || s.side === 'front_women';
      if (activeFilter === 'left') return s.seatNumber.startsWith('L');
      if (activeFilter === 'right') return s.seatNumber.startsWith('R') || s.seatNumber.startsWith('W');
      return true;
    });
  }, [availableSeats, activeFilter]);

  const handleCopyEmptySeats = () => {
    const list = availableSeats.map((s) => s.seatNumber).join(', ');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(list);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Notice for Staff */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-600/30 text-red-400 border border-red-500/40 flex-shrink-0">
            <ShieldCheck className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white">
                {role === 'bus_supervisor'
                  ? '🪪 সুপারভাইজার লাইভ সিট মনিটর'
                  : '🏢 কাউন্টার প্রতিনিধি সিট মনিটর'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                স্টাফ মোড সক্রিয়
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              সুপারভাইজার ও কাউন্টার কর্মীদের টিকিট কাটার প্রয়োজন নেই। এই স্ক্রিন থেকে অন-ডিউটি বাসের খালি আসন মনিটর করুন।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {role === 'bus_supervisor' ? (
            <Link
              href="/supervisor"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>সুপারভাইজার কনসোল</span>
            </Link>
          ) : (
            <Link
              href="/counter"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>কাউন্টার টিকিট পিওএস</span>
            </Link>
          )}

          {onSwitchToPassengerMode && (
            <button
              onClick={onSwitchToPassengerMode}
              title="যাত্রীদের অনলাইন টিকিট বুকিং ফর্ম দেখুন"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold border border-white/15 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">যাত্রী বুকিং ভিউ</span>
            </button>
          )}
        </div>
      </div>

      {/* Bus Selector Tabs */}
      <div className="bg-white rounded-3xl p-5 border border-red-100 shadow-md space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BusIcon className="w-4 h-4 text-red-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              অন-ডিউটি বাস নির্বাচন করুন ({toBengaliDigits(INITIAL_BUSES.length)} টি বাস সক্রিয়)
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {lastRefreshed && (
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                হালনাগাদ: {lastRefreshed}
              </span>
            )}
            <button
              onClick={fetchSeatStatus}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200 rounded-lg transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-red-600' : ''}`} />
              <span>রিফ্রেশ</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {INITIAL_BUSES.map((bus) => {
            const isSelected = bus.id === selectedBusId;
            return (
              <button
                key={bus.id}
                type="button"
                onClick={() => setSelectedBusId(bus.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-150 relative ${
                  isSelected
                    ? 'border-red-600 bg-red-50/70 shadow-sm ring-2 ring-red-500/20'
                    : 'border-slate-200 hover:border-red-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black font-mono text-slate-900">
                    {bus.registrationNumberBn}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? 'bg-red-600 animate-pulse' : 'bg-emerald-500'
                    }`}
                  />
                </div>
                <div className="text-[11px] font-semibold text-slate-600 mt-1">
                  {bus.direction === 'kaptai_to_patenga' ? 'কাপ্তাই ➔ কাঠগড়' : 'কাঠগড় ➔ কাপ্তাই'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                  চালক: {bus.driverNameBn}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Seat Metric Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Available Seats Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">
              খালি আসন (Available)
            </span>
            <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full text-white">
              {Math.round((availableSeats.length / totalSeats) * 100)}% ফাঁকা
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight">
            {toBengaliDigits(availableSeats.length)} <span className="text-base font-semibold">টি</span>
          </div>
          <p className="text-[11px] text-emerald-100 mt-1">
            তাত্ক্ষণিকভাবে যাত্রী বসানোর জন্য প্রস্তুত
          </p>
        </div>

        {/* Booked Seats Card */}
        <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-md relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
              বুকড আসন (Booked)
            </span>
            <span className="text-xs font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
              {Math.round((bookedSeats.length / totalSeats) * 100)}% পূর্ণ
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
            {toBengaliDigits(bookedSeats.length)} <span className="text-base font-semibold text-slate-500">টি</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            কাউন্টার বা অনলাইনে নিশ্চিতকৃত আসন
          </p>
        </div>

        {/* Women Reserved Card */}
        <div className="bg-white p-5 rounded-3xl border border-pink-100 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pink-700 uppercase tracking-wider">
              নারী সংরক্ষিত
            </span>
            <span className="text-xs font-bold bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full border border-pink-200">
              {toBengaliDigits(availableWomenSeats.length)} টি খালি
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-pink-700 mt-2 tracking-tight">
            {toBengaliDigits(availableWomenSeats.length)}
            <span className="text-base font-semibold text-slate-400">/{toBengaliDigits(womenSeats.length)}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            মহিলা ও শিশু যাত্রীদের অগ্রাধিকার আসন
          </p>
        </div>

        {/* Regulated Standing Card */}
        <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              স্ট্যান্ডিং স্পেস
            </span>
            <span className="text-xs font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
              অনুমোদিত
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-amber-700 mt-2 tracking-tight">
            {toBengaliDigits(availableStanding)}
            <span className="text-base font-semibold text-slate-400">/{toBengaliDigits(standing.approvedCapacity)}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            সরকারি নিয়ম অনুযায়ী দাঁড়িয়ে ভ্রমণযোগ্য
          </p>
        </div>
      </div>

      {/* Empty Seats Quick Chips Section */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                সরাসরি খালি আসন নম্বরসমূহ ({toBengaliDigits(filteredEmptySeats.length)} টি)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              যাত্রীদের তাৎক্ষণিক জানাতে নিচের যেকোনো খালি সিট নম্বর উল্লেখ করুন
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Tabs */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  activeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                সকল ({toBengaliDigits(availableSeats.length)})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('left')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  activeFilter === 'left' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                বাম পাশ
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('right')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  activeFilter === 'right' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                ডান পাশ
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('women')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  activeFilter === 'women' ? 'bg-white text-pink-700 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                নারী ({toBengaliDigits(availableWomenSeats.length)})
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopyEmptySeats}
              title="খালি সিটের তালিকা কপি করুন"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
            </button>
          </div>
        </div>

        {/* Empty Seat Badges */}
        {filteredEmptySeats.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            এই ফিল্টারে কোনো খালি আসন নেই।
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {filteredEmptySeats.map((seat) => {
              const isWomen = seat.isWomenReserved || seat.side === 'front_women';
              return (
                <button
                  key={seat.id}
                  type="button"
                  onClick={() => setSelectedSeatDetail(seat)}
                  className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition hover:scale-105 active:scale-95 shadow-2xs ${
                    isWomen
                      ? 'bg-pink-50 border-2 border-pink-300 text-pink-900 hover:bg-pink-100'
                      : 'bg-emerald-50 border-2 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-mono">{seat.seatNumber}</span>
                  {isWomen && <span className="text-[10px] text-pink-700">🌸</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Bus Seat Layout Visual Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Bus Blueprint Layout */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                বাসের ইন্টারেক্টিভ আসন বিন্যাস ({selectedBus.registrationNumberBn})
              </h3>
              <p className="text-xs text-slate-500">
                সবুজ = খালি আসন, লাল = বুকড, হলুদ = প্রক্রিয়াধীন
              </p>
            </div>

            {/* Color Legend */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> খালি ({toBengaliDigits(availableSeats.length)})
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-300 text-rose-800">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> বুকড ({toBengaliDigits(bookedSeats.length)})
              </span>
              {heldSeats.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-300 text-amber-800">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> হোল্ড ({toBengaliDigits(heldSeats.length)})
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-50 border border-pink-300 text-pink-800">
                🌸 নারী সংরক্ষিত
              </span>
            </div>
          </div>

          {/* Bus Physical Shell Container */}
          <div className="max-w-md mx-auto bg-slate-50 rounded-3xl border-2 border-slate-300 p-4 sm:p-6 shadow-inner relative">
            {/* Front Cabin Indicator */}
            <div className="pb-4 mb-4 border-b-2 border-dashed border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <span>🚪</span>
                <span>যাত্রী প্রবেশ দরজা</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-white shadow-2xs">
                <span>🚌</span>
                <span>চালক / স্টিয়ারিং</span>
              </div>
            </div>

            {/* Seat Grid Rows */}
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((rowNum) => {
                const l1 = seats.find((s) => s.seatNumber === `L${(rowNum - 1) * 2 + 1}`);
                const l2 = seats.find((s) => s.seatNumber === `L${(rowNum - 1) * 2 + 2}`);
                const r1 = seats.find((s) => s.seatNumber === `R${(rowNum - 1) * 2 + 1}`);
                const r2 = seats.find((s) => s.seatNumber === `R${(rowNum - 1) * 2 + 2}`);

                const renderStaffSeat = (seat?: BusSeat) => {
                  if (!seat) return <div className="w-11 h-10" />;
                  const isAvailable = seat.status === 'available';
                  const isBooked = seat.status === 'booked';
                  const isHeld = seat.status === 'held';
                  const isWomen = seat.isWomenReserved || seat.side === 'front_women';

                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => setSelectedSeatDetail(seat)}
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl text-xs font-black flex flex-col items-center justify-center transition hover:scale-105 relative ${
                        isAvailable
                          ? isWomen
                            ? 'bg-pink-100 hover:bg-pink-200 border-2 border-pink-400 text-pink-900 border-b-4 border-b-pink-500'
                            : 'bg-emerald-100 hover:bg-emerald-200 border-2 border-emerald-400 text-emerald-900 border-b-4 border-b-emerald-600'
                          : isBooked
                          ? 'bg-rose-50 border border-rose-300 text-rose-700/80 border-b-2'
                          : 'bg-amber-100 border border-amber-300 text-amber-900'
                      }`}
                      title={`সিট ${seat.seatNumber}: ${
                        isAvailable ? 'খালি' : isBooked ? 'বুকড' : 'হোল্ড'
                      }`}
                    >
                      <span className="font-mono">{seat.seatNumber}</span>
                      {isWomen && isAvailable && (
                        <span className="text-[8px] leading-none text-pink-700 font-bold">নারী</span>
                      )}
                      {isBooked && (
                        <span className="text-[8px] leading-none text-rose-600 font-semibold">বুকড</span>
                      )}
                    </button>
                  );
                };

                return (
                  <div key={rowNum} className="flex items-center justify-between">
                    {/* Left Pair */}
                    <div className="flex items-center gap-1.5">
                      {renderStaffSeat(l1)}
                      {renderStaffSeat(l2)}
                    </div>

                    {/* Gangway / Aisle */}
                    <div className="w-8 sm:w-10 text-center">
                      <span className="text-[10px] font-mono text-slate-300">
                        {rowNum}
                      </span>
                    </div>

                    {/* Right Pair */}
                    <div className="flex items-center gap-1.5">
                      {renderStaffSeat(r1)}
                      {renderStaffSeat(r2)}
                    </div>
                  </div>
                );
              })}

              {/* Rear Row (Last Row: 5 seats across) */}
              <div className="pt-3 mt-3 border-t-2 border-dashed border-slate-200">
                <div className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-wider mb-2">
                  শেষ সারি (Rear Row)
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  {seats
                    .filter((s) => s.side === 'rear' || s.row === 9)
                    .map((seat) => {
                      const isAvailable = seat.status === 'available';
                      const isBooked = seat.status === 'booked';
                      return (
                        <button
                          key={seat.id}
                          type="button"
                          onClick={() => setSelectedSeatDetail(seat)}
                          className={`w-11 h-11 rounded-xl text-xs font-black flex flex-col items-center justify-center transition hover:scale-105 ${
                            isAvailable
                              ? 'bg-emerald-100 hover:bg-emerald-200 border-2 border-emerald-400 text-emerald-900 border-b-4 border-b-emerald-600'
                              : isBooked
                              ? 'bg-rose-50 border border-rose-300 text-rose-700/80 border-b-2'
                              : 'bg-amber-100 border border-amber-300 text-amber-900'
                          }`}
                        >
                          <span className="font-mono">{seat.seatNumber}</span>
                          <span className="text-[8px] leading-none">
                            {isAvailable ? 'খালি' : 'বুকড'}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Staff Operational Info & Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Selected Seat Inspector Modal / Card */}
          {selectedSeatDetail ? (
            <div className="bg-white rounded-3xl p-6 border-2 border-red-200 shadow-xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Armchair className="w-5 h-5 text-red-600" />
                  <span className="font-black text-slate-900 text-base">
                    সিট নম্বর: {selectedSeatDetail.seatNumber}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedSeatDetail(null)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕ বন্ধ করুন
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">বর্তমান স্ট্যাটাস</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full ${
                      selectedSeatDetail.status === 'available'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : selectedSeatDetail.status === 'booked'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {selectedSeatDetail.status === 'available'
                      ? '🟢 আসন সম্পূর্ণ খালি'
                      : selectedSeatDetail.status === 'booked'
                      ? '🔴 আসন বুকড'
                      : '🟡 প্রক্রিয়াধীন'}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">আসন ক্যাটাগরি</span>
                  <span className="font-semibold text-slate-800">
                    {selectedSeatDetail.isWomenReserved || selectedSeatDetail.side === 'front_women'
                      ? '🌸 নারী সংরক্ষিত আসন'
                      : selectedSeatDetail.side === 'rear'
                      ? 'শেষ সারি (Rear Seat)'
                      : 'সাধারণ আসন'}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">বাস নম্বর</span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedBus.registrationNumberBn}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-400">রুট ও গন্তব্য</span>
                  <span className="font-semibold text-slate-800">
                    {selectedBus.direction === 'kaptai_to_patenga' ? 'কাপ্তাই ➔ কাঠগড়' : 'কাঠগড় ➔ কাপ্তাই'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md text-center space-y-2">
              <Armchair className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-700">সিটের তথ্য জানতে ক্লিক করুন</div>
              <p className="text-[11px] text-slate-400">
                ম্যাপের যেকোনো আসনে ক্লিক করলে তার বিস্তারিত স্ট্যাটাস এখানে দেখতে পাবেন।
              </p>
            </div>
          )}

          {/* Staff Quick Guidelines Card */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
            <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span>অন-ডিউটি স্টাফ সহায়িকা</span>
            </h4>

            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>
                  <strong>সুপারভাইজার:</strong> বাস চলাকালীন নতুন যাত্রী উঠলে খালি আসনের তালিকা দেখে দ্রুত সিট বুঝিয়ে দিন।
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>
                  <strong>কাউন্টার প্রতিনিধি:</strong> ওয়াক-ইন যাত্রী এলে কাউন্টার পিওএস থেকে সরাসরি এই খালি সিটে টিকিট ইস্যু করুন।
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>
                  মহিলা ও বিশেষ চাহিদাসম্পন্ন যাত্রীদের জন্য সামনের সংরক্ষিত আসনগুলো নিশ্চিত করুন।
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Helpline Hotline */}
          <div className="bg-red-50 rounded-3xl p-5 border border-red-200 space-y-2">
            <div className="text-xs font-bold text-red-900 uppercase tracking-wider">
              ফ্লিট কন্ট্রোল হটলাইন
            </div>
            <a
              href="tel:01798542469"
              className="flex items-center gap-2 text-red-700 font-mono font-extrabold text-base hover:text-red-800 transition"
            >
              <Phone className="w-4 h-4 text-red-600" />
              <span>01798542469</span>
            </a>
            <p className="text-[10px] text-red-600">
              জরুরি ফ্লিট সহায়তা বা আসন অমিল সংক্রান্ত যে কোনো সমস্যায় সেন্ট্রাল কন্ট্রোলে কল করুন।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};