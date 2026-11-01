'use client';

import React from 'react';
import Link from 'next/link';
import { INITIAL_BOOTHS } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  Building2,
  Phone,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  AlertCircle,
  Ticket,
  Lock,
  ArrowRight,
  ShieldAlert,
  LogIn,
} from 'lucide-react';

export default function CountersPage() {
  const { language } = useLanguage();
  const { user, role } = useAuth();

  // Access Control: ONLY Counter Representatives, Managers, Supervisors, and Admins can view
  const isAuthorizedStaff =
    role === 'counter_representative' ||
    role === 'counter_manager' ||
    role === 'bus_supervisor' ||
    role === 'operations_admin' ||
    role === 'super_admin';

  // If user is a passenger or guest (Restricted Access Screen)
  if (!isAuthorizedStaff) {
    return (
      <div className="min-h-[70vh] max-w-3xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
        <div className="w-20 h-20 rounded-3xl bg-red-50 text-red-600 border-2 border-red-200 flex items-center justify-center shadow-lg mb-6">
          <Lock className="w-10 h-10 text-red-600" />
        </div>

        <span className="text-xs font-extrabold text-red-700 uppercase tracking-widest bg-red-50 border border-red-200 px-3.5 py-1 rounded-full mb-3">
          অভ্যন্তরীণ স্টাফ ডিরেক্টরি — প্রবেশাধিকার সংরক্ষিত
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          কাউন্টার প্রতিনিধি ও সুপারভাইজার পোর্টাল
        </h1>

        <p className="text-sm text-slate-600 mt-3 max-w-xl leading-relaxed">
          এই কাউন্টার নেটওয়ার্ক ইন্টারফেসটি শুধুমাত্র অনুমোদিত <strong>কাউন্টার প্রতিনিধি (Counter Representative)</strong> এবং <strong>বাস সুপারভাইজার (Bus Supervisor)</strong>-দের দায়িত্ব বণ্টন ও অভ্যন্তরীণ যোগাযোগের জন্য নির্ধারিত। সাধারণ যাত্রী বা ইউজারদের জন্য এটি অ্যাক্সেসযোগ্য নয়।
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-md">
          <Link
            href="/login"
            className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>স্টাফ হিসেবে প্রবেশ করুন</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2"
          >
            <span>যাত্রী হোমপেজে যান</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-10 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 max-w-md text-left flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>
            সম্মানিত যাত্রীরা বাসের রুট ও স্টপেজ দেখতে <strong>রুট ও স্টপ</strong> পেজ এবং লাইভ অবস্থান দেখতে <strong>বাস ট্র্যাকিং</strong> ব্যবহার করুন।
          </span>
        </div>
      </div>
    );
  }

  // If Authorized Staff (Counter Representative or Supervisor)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-red-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>অনুমোদিত স্টাফ ভিউ: {role.replace('_', ' ')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-1">
            {language === 'bn' ? 'মেট্রো প্রভাতী কাউন্টার ডিরেক্টরি' : 'Metro Probati Counter Directory'}
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-3xl">
            {language === 'bn'
              ? 'চট্টগ্রাম করিডোরের প্রধান প্রধান পয়েন্টে স্থাপিত কাউন্টারের সঠিক অবস্থান, কার্যকাল এবং প্রতিনিধি তথ্য।'
              : 'Operational hours, designated staff, and location points of all official ticket counters across Chattogram.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {role === 'counter_representative' || role === 'counter_manager' ? (
            <Link
              href="/counter"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>কাউন্টার ড্যাশবোর্ড</span>
            </Link>
          ) : (
            <Link
              href="/supervisor"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>সুপারভাইজার কনসোল</span>
            </Link>
          )}
        </div>
      </div>

      {/* Counter Booths Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INITIAL_BOOTHS.map((booth) => (
          <div
            key={booth.id}
            className="bg-white rounded-3xl border border-red-100 shadow-sm hover:shadow-md hover:border-red-200 transition flex flex-col justify-between p-6"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold rounded-full">
                  {language === 'bn' ? 'সক্রিয় কাউন্টার' : 'Active Counter'}
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {language === 'bn' ? booth.nameBn : booth.nameEn}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{language === 'bn' ? booth.addressBn : booth.addressEn}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>
                    <strong>{language === 'bn' ? 'কার্যকাল:' : 'Hours:'}</strong> {booth.openingHours}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>
                    <strong>{language === 'bn' ? 'দায়িত্বপ্রাপ্ত:' : 'Staff:'}</strong>{' '}
                    {booth.assignedStaff.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact & Action Section */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <a
                href={`tel:${booth.phone}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-white" />
                <span className="font-mono">{booth.phone}</span>
              </a>

              <Link
                href={`/tickets?from=${booth.stopId}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'টিকিট বুক' : 'Book'}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Advisory banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300 text-xs text-amber-900 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p>
          {language === 'bn'
            ? 'পরামর্শ: অফিসিয়াল কাউন্টারে দায়িত্বপ্রাপ্ত প্রতিনিধির কাছ থেকে ছাপানো কিউআর-যুক্ত ডিজিটাল টিকিট গ্রহণ করুন। কোনো অপ্রমাণিত ব্যক্তির কাছে অতিরিক্ত ভাড়া পরিশোধ করবেন না।'
            : 'Advisory: Always collect a printed QR-verified ticket from the designated counter representative. Never pay beyond the published tariff.'}
        </p>
      </div>
    </div>
  );
}
