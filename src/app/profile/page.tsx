'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { User, Phone, Ticket, Shield, LogOut, CheckCircle2, ArrowRight } from 'lucide-react';
import { TicketBooking } from '@/types';
import { formatBDT } from '@/lib/fareCalculator';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const [userBookings, setUserBookings] = useState<TicketBooking[]>([]);

  useEffect(() => {
    fetch('/api/bookings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUserBookings(data.bookings);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
            {user?.name?.slice(0, 1) || 'য'}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full uppercase">
              <span>{user?.role?.replace('_', ' ')}</span>
              {user?.authProvider === 'google' && (
                <span className="text-[10px] bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded font-bold lowercase">
                  google
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              {user?.name || 'সম্মানিত যাত্রী'}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
              {user?.email && (
                <span className="text-slate-700 font-medium">{user.email}</span>
              )}
              {user?.phone && (
                <span>{user.phone}</span>
              )}
              {!user?.email && !user?.phone && (
                <span>018XXXXXXXX</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            ভাষা: {language === 'bn' ? 'বাংলা' : 'English'}
          </button>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>
      </div>

      {/* Bookings History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-red-600" />
            <h3 className="font-extrabold text-slate-900 text-base">
              আপনার সংরক্ষিত টিকিটসমূহ
            </h3>
          </div>
          <Link
            href="/tickets"
            className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
          >
            <span>নতুন টিকিট বুক করুন</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {userBookings.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            কোনো পূর্ববর্তী টিকিট পাওয়া যায়নি।
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {userBookings.map((tkt) => (
              <div key={tkt.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                      {tkt.reference}
                    </span>
                    <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full uppercase">
                      {tkt.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {tkt.fromStopNameBn} ➔ {tkt.toStopNameBn} • সিট: {tkt.selectedSeats.join(', ') || 'স্ট্যান্ডিং'}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-slate-900">
                    {formatBDT(tkt.totalFareBDT)}
                  </div>
                  <Link
                    href={`/tickets?ref=${tkt.reference}`}
                    className="text-xs font-semibold text-red-600 hover:underline mt-1 block"
                  >
                    ই-পাস দেখুন ➔
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
