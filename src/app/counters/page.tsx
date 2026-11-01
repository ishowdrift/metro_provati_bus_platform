'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_BOOTHS, INITIAL_STOPS } from '@/data/mockData';
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
  Search,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export default function CountersPage() {
  const { language } = useLanguage();
  const { user, role } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Access Control: Helper matching Test 9 specification
  const isStaffAuthorized = (userRole?: string) =>
    userRole === 'counter_representative' ||
    userRole === 'counter_manager' ||
    userRole === 'bus_supervisor' ||
    userRole === 'operations_admin' ||
    userRole === 'super_admin';

  const isStaff = isStaffAuthorized(role);

  const filteredBooths = INITIAL_BOOTHS.filter((booth) => {
    const q = searchQuery.toLowerCase();
    return (
      booth.nameBn.toLowerCase().includes(q) ||
      booth.nameEn.toLowerCase().includes(q) ||
      booth.stopNameBn.toLowerCase().includes(q) ||
      booth.addressBn.toLowerCase().includes(q) ||
      booth.addressEn.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-red-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5 text-red-600" />
            <span>{language === 'bn' ? 'চট্টগ্রাম করিডোর কাউন্টার নেটওয়ার্ক' : 'Chattogram Counter Network'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {language === 'bn' ? 'মেট্রো প্রভাতী কাউন্টার ডিরেক্টরি' : 'Metro Probati Counter Directory'}
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-3xl leading-relaxed">
            {language === 'bn'
              ? 'চট্টগ্রাম নগরীর কাপ্তাই রাস্তার মাথা থেকে কাঠগড় করিডোরের প্রতিটি অনুমোদিত প্যাসেঞ্জার টিকিট কাউন্টারের সঠিক অবস্থান, খোলার সময়সূচি ও সরাসরি যোগাযোগ নম্বর।'
              : 'Verified physical counter locations, operating hours, and direct helplines across the Kaptai Rastar Matha ↔ Katgor corridor.'}
          </p>
        </div>

        {/* Staff Console Access Pill */}
        <div className="flex items-center gap-2">
          {isStaff ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>স্টাফ মোড: {role.replace('_', ' ')}</span>
              </span>
              <Link
                href="/counter"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>কাউন্টার পিওএস ড্যাশবোর্ড</span>
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>স্টাফ লগইন</span>
            </Link>
          )}
        </div>
      </div>

      {/* Search Input Filter */}
      <div className="bg-white rounded-2xl p-4 border border-red-100 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-red-600 flex-shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            language === 'bn'
              ? 'কাউন্টারের নাম বা এলাকা দিয়ে খুঁজুন (যেমন: বহদ্দারহাট, জিইসি, কাঠগড়...)'
              : 'Search counters by location name (e.g. Bahaddarhat, GEC, Katgor)...'
          }
          className="w-full text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1"
          >
            মুছুন
          </button>
        )}
      </div>

      {/* Counter Booths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooths.map((booth) => {
          const mapDirectionUrl = `https://www.google.com/maps/search/?api=1&query=${booth.lat},${booth.lng}`;

          return (
            <div
              key={booth.id}
              className="bg-white rounded-3xl border border-red-100 shadow-sm hover:shadow-lg hover:border-red-300 transition-all flex flex-col justify-between p-6 group"
            >
              <div className="space-y-4">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="p-3 bg-red-50 text-red-600 rounded-2xl group-hover:scale-105 group-hover:bg-red-600 group-hover:text-white transition-all shadow-xs">
                    <Building2 className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold rounded-full">
                    {language === 'bn' ? 'সক্রিয় টিকিট কাউন্টার' : 'Active Counter'}
                  </span>
                </div>

                {/* Counter Name & Location */}
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-red-600 transition-colors">
                    {language === 'bn' ? booth.nameBn : booth.nameEn}
                  </h3>
                  <div className="flex items-start gap-1.5 mt-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>{language === 'bn' ? booth.addressBn : booth.addressEn}</span>
                  </div>
                </div>

                {/* Operating Hours & Phone */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                    <span>
                      <strong>কার্যকাল:</strong> {booth.openingHours}
                    </span>
                  </div>

                  {booth.phone && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <div className="flex items-center gap-2 text-slate-700 font-mono font-bold">
                        <Phone className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                        <span>{booth.phone}</span>
                      </div>
                      <a
                        href={`tel:${booth.phone}`}
                        className="text-[11px] font-bold text-red-600 hover:text-red-700 underline"
                      >
                        কল করুন
                      </a>
                    </div>
                  )}

                  {/* Staff view only */}
                  {isStaff && booth.assignedStaff && booth.assignedStaff.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60 text-[11px] text-emerald-800 flex items-center gap-1.5 font-medium">
                      <User className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      <span>দায়িত্বরত: {booth.assignedStaff.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: Directions on Google Maps + Book Seats */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={mapDirectionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
                >
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  <span>{language === 'bn' ? 'ম্যাপ লোকেশন' : 'Map Location'}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <Link
                  href={`/tickets?from=${booth.stopId}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'আসন বুকিং' : 'Book Seats'}</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBooths.length === 0 && (
        <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-red-100">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">
            {language === 'bn' ? 'কোনো কাউন্টার পাওয়া যায়নি' : 'No counters found'}
          </h4>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'অনুগ্রহ করে অনুসন্ধানের শব্দ পরিবর্তন করে চেষ্টা করুন।'
              : 'Please check your search terms and try again.'}
          </p>
        </div>
      )}
    </div>
  );
}
