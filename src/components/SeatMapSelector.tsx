'use client';

import React, { useState, useEffect } from 'react';
import { BusSeat, StandingCapacity } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { toBengaliDigits, formatBDT } from '@/lib/fareCalculator';
import { Clock, Users, AlertCircle, RefreshCw, Disc } from 'lucide-react';

interface SeatMapSelectorProps {
  busId?: string;
  farePerPersonBDT: number;
  onSelectionChange: (selectedSeats: string[], standingCount: number, totalFare: number) => void;
}

export const SeatMapSelector: React.FC<SeatMapSelectorProps> = ({
  busId = 'bus-mp-101',
  farePerPersonBDT,
  onSelectionChange,
}) => {
  const { language } = useLanguage();
  const [seats, setSeats] = useState<BusSeat[]>([]);
  const [standing, setStanding] = useState<StandingCapacity>({
    approvedCapacity: 15,
    reservedCount: 0,
    isEnabled: true,
  });
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<string[]>([]);
  const [selectedStandingCount, setSelectedStandingCount] = useState<number>(0);
  const [sessionId, setSessionId] = useState<string>('');
  const [holdExpiresAt, setHoldExpiresAt] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(300);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize or restore session ID
  useEffect(() => {
    let sid = sessionStorage.getItem('mp_booking_session');
    if (!sid) {
      sid = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('mp_booking_session', sid);
    }
    setSessionId(sid);
  }, []);

  // Fetch current seat layout
  const fetchSeatStatus = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/seats/status?busId=${busId}`);
      const data = await res.json();
      if (data.success) {
        setSeats(data.seats);
        setStanding(data.standingCapacity);
      } else {
        setErrorMessage(data.error || 'আসন তথ্য লোড করা যায়নি');
      }
    } catch {
      setErrorMessage('নেটওয়ার্ক ত্রুটি; আসন স্ট্যাটাস রিফ্রেশ করুন।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeatStatus();
    const interval = setInterval(fetchSeatStatus, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busId]);

  // Countdown timer for held seats
  useEffect(() => {
    if (!holdExpiresAt) return;

    const timer = setInterval(() => {
      const diff = Math.floor((new Date(holdExpiresAt).getTime() - Date.now()) / 1000);
      if (diff <= 0) {
        setRemainingSeconds(0);
        setHoldExpiresAt(null);
        setSelectedSeatNumbers([]);
        fetchSeatStatus();
        clearInterval(timer);
      } else {
        setRemainingSeconds(diff);
      }
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holdExpiresAt]);

  // Notify parent on selection update
  useEffect(() => {
    const totalCount = selectedSeatNumbers.length + selectedStandingCount;
    const totalFare = totalCount * farePerPersonBDT;
    onSelectionChange(selectedSeatNumbers, selectedStandingCount, totalFare);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeatNumbers, selectedStandingCount, farePerPersonBDT]);

  const handleSeatClick = async (seat: BusSeat) => {
    if (seat.status === 'booked') return;
    if (seat.status === 'held' && seat.heldBySessionId !== sessionId) return;

    setErrorMessage(null);
    const seatNumber = seat.seatNumber;

    if (selectedSeatNumbers.includes(seatNumber)) {
      // Deselect and release hold
      const updated = selectedSeatNumbers.filter((s) => s !== seatNumber);
      setSelectedSeatNumbers(updated);
      try {
        await fetch('/api/seats/release', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ busId, seatNumbers: [seatNumber], sessionId }),
        });
        fetchSeatStatus();
      } catch {
        // Continue
      }
    } else {
      // Limit to 5 seats
      if (selectedSeatNumbers.length >= 5) {
        setErrorMessage(
          language === 'bn'
            ? 'একবারে সর্বোচ্চ ৫টি আসন নির্বাচন করা সম্ভব।'
            : 'You can reserve a maximum of 5 seats at a time.'
        );
        return;
      }

      // Try holding seat on server
      const updated = [...selectedSeatNumbers, seatNumber];
      try {
        const res = await fetch('/api/seats/hold', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ busId, seatNumbers: updated, sessionId }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setSelectedSeatNumbers(updated);
          setHoldExpiresAt(data.expiresAt);
          fetchSeatStatus();
        } else {
          setErrorMessage(data.error || 'আসনটি ইতিমধ্যে অন্য কেউ নির্বাচন করেছেন।');
          fetchSeatStatus();
        }
      } catch {
        setErrorMessage('আসন হোল্ড করা সম্ভব হয়নি। আবার চেষ্টা করুন।');
      }
    }
  };

  const handleStandingIncrement = () => {
    const maxAvailableStanding = Math.max(0, standing.approvedCapacity - standing.reservedCount);
    if (selectedStandingCount < maxAvailableStanding && selectedStandingCount < 5) {
      setSelectedStandingCount((prev) => prev + 1);
    }
  };

  const handleStandingDecrement = () => {
    if (selectedStandingCount > 0) {
      setSelectedStandingCount((prev) => prev - 1);
    }
  };

  const renderSeatButton = (seat?: BusSeat, extraClass: string = '') => {
    if (!seat) return <div className="w-12 h-10" />;

    const isSelected = selectedSeatNumbers.includes(seat.seatNumber);
    const isBooked = seat.status === 'booked';
    const isHeld = seat.status === 'held' && seat.heldBySessionId !== sessionId;
    const isWomen = seat.isWomenReserved;

    return (
      <button
        key={seat.id}
        type="button"
        onClick={() => handleSeatClick(seat)}
        disabled={isBooked || isHeld}
        title={`Seat ${seat.seatNumber}${isWomen ? ' (Women Reserved)' : ''}`}
        className={`w-12 h-11 sm:w-13 sm:h-12 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center transition-all duration-150 relative ${
          isSelected
            ? 'bg-red-600 text-white shadow-lg scale-105 ring-2 ring-red-400 border-b-4 border-red-800'
            : isBooked
            ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed border-b-2'
            : isHeld
            ? 'bg-amber-100 border border-amber-300 text-amber-800 cursor-not-allowed border-b-2'
            : isWomen
            ? 'bg-red-50 hover:bg-red-100 border-2 border-red-300 text-red-900 border-b-4 border-b-red-400 hover:scale-105 active:scale-95'
            : 'bg-white hover:bg-red-50 border-2 border-slate-300 hover:border-red-400 text-slate-800 border-b-4 border-b-slate-400 hover:scale-105 active:scale-95'
        } ${extraClass}`}
      >
        <span className="tracking-tight">{seat.seatNumber}</span>
        {isWomen && !isSelected && !isBooked && (
          <span className="text-[8px] leading-none text-red-700 font-semibold">নারী</span>
        )}
        {isSelected && (
          <span className="text-[9px] leading-none text-white font-bold">✓</span>
        )}
      </button>
    );
  };

  // Filter seats by zones matching diagram
  const womenSeats = seats.filter((s) => s.side === 'front_women' || s.isWomenReserved);
  const rearSeats = seats.filter((s) => s.side === 'rear' || s.row === 9);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-red-100 p-6 md:p-8">
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg md:text-xl">
            {language === 'bn' ? 'আসন ও স্ট্যান্ডিং স্পেস নির্বাচন' : 'Seat & Standing Space Selection'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? '৩৮ আসন বিন্যাস (L1-L20, R1-R16, W1-W2) + ১৫ নিয়ন্ত্রিত স্ট্যান্ডিং'
              : '38 Seat Configuration (L1-L20, R1-R16, W1-W2) + 15 Regulated Standing'}
          </p>
        </div>

        <button
          onClick={fetchSeatStatus}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg self-start sm:self-auto transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}</span>
        </button>
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 5-minute Hold Countdown Banner */}
      {holdExpiresAt && selectedSeatNumbers.length > 0 && (
        <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-300 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 animate-spin" />
            <span className="font-medium">
              {language === 'bn'
                ? 'আসনসমূহ সাময়িকভাবে সংরক্ষিত আছে (পেমেন্ট সম্পন্ন করুন):'
                : 'Seats temporarily held in your session (complete booking):'}
            </span>
          </div>
          <span className="font-mono font-bold text-amber-800 text-sm bg-white px-2 py-0.5 rounded border border-amber-200">
            {Math.floor(remainingSeconds / 60)}:
            {String(remainingSeconds % 60).padStart(2, '0')}
          </span>
        </div>
      )}

      {/* Seat Status Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md border-2 border-slate-300 border-b-4 border-b-slate-400 bg-white" />
          <span>উপলব্ধ</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md border-2 border-red-300 border-b-4 border-b-red-400 bg-red-50" />
          <span>নারী সংরক্ষিত</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-red-600 text-white flex items-center justify-center text-[10px] font-bold">
            ✓
          </div>
          <span>নির্বাচিত</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-amber-200 border border-amber-300" />
          <span>হোল্ডকৃত (৫ মি.)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-slate-300 border border-slate-400 cursor-not-allowed" />
          <span>বুক করা</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AUTHENTIC BUS SCHEMATIC (Matches User Uploaded Architecture) */}
      {/* ========================================================================= */}
      <div className="mt-8 max-w-[340px] sm:max-w-[370px] mx-auto select-none">
        {/* Exterior Bus Frame with Window Slits */}
        <div className="relative bg-slate-50 border-4 border-slate-900 rounded-[52px] p-5 pt-4 pb-6 shadow-2xl">
          {/* Side Windows (Exterior Edge Tabs) */}
          <div className="absolute -left-2 top-24 bottom-24 w-1.5 flex flex-col justify-around">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <span key={i} className="w-1.5 h-10 bg-sky-400/80 rounded-r shadow-xs" />
            ))}
          </div>
          <div className="absolute -right-2 top-24 bottom-24 w-1.5 flex flex-col justify-around">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <span key={i} className="w-1.5 h-10 bg-sky-400/80 rounded-l shadow-xs" />
            ))}
          </div>

          {/* Top Front Badge */}
          <div className="flex justify-center -mt-6 mb-3">
            <span className="px-5 py-1 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-md">
              ▲ FRONT ▲
            </span>
          </div>

          {/* Windshield Wiper Arcs */}
          <div className="flex justify-around px-8 mb-3 opacity-30">
            <div className="w-16 h-1 border-t-2 border-slate-700 rounded-full rotate-6" />
            <div className="w-16 h-1 border-t-2 border-slate-700 rounded-full -rotate-6" />
          </div>

          {/* Top Cabin Area (Women Reserved & Driver) */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Left: Women-Reserved Card */}
            <div className="p-2.5 rounded-2xl bg-red-50 border-2 border-red-200 flex flex-col justify-between shadow-xs">
              <span className="text-[10px] font-black text-red-900 uppercase tracking-wider text-center block mb-1.5">
                WOMEN-RESERVED
              </span>
              <div className="flex justify-center gap-1.5">
                {womenSeats.length > 0 ? (
                  womenSeats.map((s) => renderSeatButton(s))
                ) : (
                  <>
                    {renderSeatButton(seats.find((s) => s.seatNumber === 'W1'))}
                    {renderSeatButton(seats.find((s) => s.seatNumber === 'W2'))}
                  </>
                )}
              </div>
            </div>

            {/* Right: Driver Seat Box */}
            <div className="p-2.5 rounded-2xl bg-white border-2 border-slate-200 flex flex-col items-center justify-center shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center mb-1 text-slate-800">
                <Disc className="w-7 h-7 text-slate-700 animate-spin-slow" />
              </div>
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
                DRIVER
              </span>
            </div>
          </div>

          {/* Entrance / Gate Graphic */}
          <div className="mb-4 pl-1 flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-200 rounded-tl-xl border border-slate-300 flex items-center justify-center shadow-inner">
              <div className="w-4 h-0.5 bg-slate-400 rotate-45" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
              ENTRANCE / GATE
            </span>
          </div>

          {/* Main 8 Seating Rows (L1-L16 vs R1-R16) */}
          <div className="relative space-y-2.5">
            {/* Center Aisle Indicator */}
            <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-8 flex items-center justify-center pointer-events-none">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest rotate-90 select-none">
                AISLE
              </span>
            </div>

            {[1, 2, 3, 4, 5, 6, 7, 8].map((rowNum) => {
              const lSeat1Num = (rowNum - 1) * 2 + 1;
              const lSeat2Num = lSeat1Num + 1;
              const rSeat1Num = (rowNum - 1) * 2 + 1;
              const rSeat2Num = rSeat1Num + 1;

              const seatL1 = seats.find((s) => s.seatNumber === `L${lSeat1Num}`);
              const seatL2 = seats.find((s) => s.seatNumber === `L${lSeat2Num}`);
              const seatR1 = seats.find((s) => s.seatNumber === `R${rSeat1Num}`);
              const seatR2 = seats.find((s) => s.seatNumber === `R${rSeat2Num}`);

              return (
                <div key={rowNum} className="flex items-center justify-between">
                  {/* Left Pair */}
                  <div className="flex gap-1.5">
                    {renderSeatButton(seatL1)}
                    {renderSeatButton(seatL2)}
                  </div>

                  {/* Right Pair */}
                  <div className="flex gap-1.5">
                    {renderSeatButton(seatR1)}
                    {renderSeatButton(seatR2)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rear Back Row (L17, L18, L19, L20 across) */}
          <div className="mt-4 pt-3 border-t-2 border-dashed border-slate-200">
            <div className="grid grid-cols-4 gap-1.5">
              {['L17', 'L18', 'L19', 'L20'].map((sNum) => {
                const s = seats.find((seat) => seat.seatNumber === sNum);
                return renderSeatButton(s);
              })}
            </div>
          </div>

          {/* Bottom Rear Badge */}
          <div className="flex justify-center -mb-8 mt-5">
            <span className="px-5 py-1 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-md">
              ▼ REAR ▼
            </span>
          </div>
        </div>

        {/* Footnote matching user uploaded diagram */}
        <p className="mt-5 text-[11px] text-center text-slate-400 font-medium">
          Illustrative layout — verify actual bus configuration before publishing.
        </p>
      </div>

      {standing.isEnabled && (
        <div className="mt-8 p-5 rounded-2xl bg-white border border-red-100 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-red-600" />
                <h4 className="font-bold text-slate-900 text-sm">
                  {language === 'bn' ? 'অনুমোদিত স্ট্যান্ডিং স্পেস' : 'Regulated Standing Capacity'}
                </h4>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'bn'
                  ? `মোট সীমা ১৫ জন (বর্তমানে অবশিষ্ট: ${toBengaliDigits(
                      Math.max(0, standing.approvedCapacity - standing.reservedCount)
                    )} জন)`
                  : `Capacity: 15 (Remaining: ${Math.max(
                      0,
                      standing.approvedCapacity - standing.reservedCount
                    )})`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleStandingDecrement}
                disabled={selectedStandingCount === 0}
                className="w-9 h-9 rounded-lg bg-white border border-slate-200 font-bold text-slate-800 disabled:opacity-40 hover:bg-red-50 hover:text-red-600"
              >
                -
              </button>
              <span className="font-mono font-bold text-slate-900 text-base min-w-[20px] text-center">
                {toBengaliDigits(selectedStandingCount)}
              </span>
              <button
                type="button"
                onClick={handleStandingIncrement}
                disabled={
                  selectedStandingCount >= Math.max(0, standing.approvedCapacity - standing.reservedCount) ||
                  selectedStandingCount >= 5
                }
                className="w-9 h-9 rounded-lg bg-white border border-slate-200 font-bold text-slate-800 disabled:opacity-40 hover:bg-red-50 hover:text-red-600"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary of Selected Items */}
      <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-red-100">
            {language === 'bn' ? 'নির্বাচিত আসন ও স্থান' : 'Selected Seats & Capacity'}
          </div>
          <div className="font-bold text-sm">
            {selectedSeatNumbers.length > 0
              ? selectedSeatNumbers.join(', ')
              : language === 'bn'
              ? 'কোনো আসন নির্বাচিত নেই'
              : 'None'}
            {selectedStandingCount > 0 && (
              <span className="ml-2 text-red-200 font-bold">
                + {toBengaliDigits(selectedStandingCount)}{' '}
                {language === 'bn' ? 'জন স্ট্যান্ডিং' : 'standing'}
              </span>
            )}
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-xs text-red-100">
            {language === 'bn' ? 'মোট ভাড়া' : 'Total Fare'}
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {formatBDT(
              (selectedSeatNumbers.length + selectedStandingCount) * farePerPersonBDT
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
