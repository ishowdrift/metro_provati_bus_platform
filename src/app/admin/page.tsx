'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_BUSES, INITIAL_BOOTHS, INITIAL_STOPS, INITIAL_INCIDENTS, INITIAL_HELPLINE } from '@/data/mockData';
import { Bus, CounterBooth, RouteStop, IncidentReport, TicketBooking } from '@/types';
import { formatBDT, toBengaliDigits } from '@/lib/fareCalculator';
import {
  ShieldCheck,
  Bus as BusIcon,
  Building2,
  MapPin,
  DollarSign,
  Ticket,
  AlertTriangle,
  Phone,
  Settings,
  Users,
  Search,
  CheckCircle2,
  RefreshCw,
  Plus,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, role } = useAuth();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'buses' | 'booths' | 'fares' | 'bookings' | 'incidents'>('buses');
  const [buses, setBuses] = useState<Bus[]>(INITIAL_BUSES);
  const [booths, setBooths] = useState<CounterBooth[]>(INITIAL_BOOTHS);
  const [stops, setStops] = useState<RouteStop[]>(INITIAL_STOPS);
  const [bookings, setBookings] = useState<TicketBooking[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>(INITIAL_INCIDENTS);
  const [metrics, setMetrics] = useState<any>({
    totalFleetCount: 4,
    onDutyCount: 3,
    activeGpsCount: 2,
    totalBookingsCount: 1,
    totalRevenueBDT: 80,
  });

  const [helplinePrimary, setHelplinePrimary] = useState(INITIAL_HELPLINE.primaryNumber);
  const [helplineSecondary, setHelplineSecondary] = useState(INITIAL_HELPLINE.secondaryNumber);
  const [saveAlert, setSaveAlert] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      const [metricsRes, bookingsRes, busesRes, incidentsRes] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch('/api/bookings'),
        fetch('/api/tracking/buses'),
        fetch('/api/incidents'),
      ]);

      const metricsData = await metricsRes.json();
      if (metricsData.success) setMetrics(metricsData.metrics);

      const bookingsData = await bookingsRes.json();
      if (bookingsData.success) setBookings(bookingsData.bookings);

      const busesData = await busesRes.json();
      if (busesData.success) setBuses(busesData.buses);

      const incidentsData = await incidentsRes.json();
      if (incidentsData.success) setIncidents(incidentsData.incidents);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleBusDuty = (busId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'on_duty' ? 'idle' : 'on_duty';
    setBuses((prev) =>
      prev.map((b) => (b.id === busId ? { ...b, status: nextStatus as any } : b))
    );
    setSaveAlert(`বাস ${busId} এর স্ট্যাটাস '${nextStatus}' এ পরিবর্তিত হয়েছে`);
    setTimeout(() => setSaveAlert(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-red-600/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 text-white border border-white/30 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>সুপার অ্যাডমিন ও অপারেশনস কনসোল</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white mt-1">
              মেট্রো প্রভাতী ম্যানেজমেন্ট
            </h1>
            <p className="text-xs text-red-100">
              লগইনকৃত অ্যাডমিন: <strong>{user?.name || 'মো. তারেক মাহমুদ'}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={fetchAdminData}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-white transition shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>ডাটা সিঙ্ক করুন</span>
        </button>
      </div>

      {saveAlert && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{saveAlert}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-red-100 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">মোট বহর ও ডিউটি</span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">
            {toBengaliDigits(metrics.onDutyCount)} / {toBengaliDigits(metrics.totalFleetCount)}
          </div>
          <div className="text-[11px] text-red-600 font-medium mt-1">কর্মরত বাস</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-red-100 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">সক্রিয় জিপিএস সিগন্যাল</span>
          <div className="text-2xl font-black text-red-600 font-mono mt-1 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            {toBengaliDigits(metrics.activeGpsCount)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">&lt; ৩ মিনিট ট্র্যাকিং</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-red-100 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">মোট টিকিট বুকিং</span>
          <div className="text-2xl font-black text-red-600 font-mono mt-1">
            {toBengaliDigits(bookings.length || metrics.totalBookingsCount)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">অনলাইন ও কাউন্টার</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-red-100 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">সংগৃহীত সর্বমোট রাজস্ব</span>
          <div className="text-2xl font-black text-red-600 font-mono mt-1">
            {formatBDT(metrics.totalRevenueBDT)}
          </div>
          <div className="text-[11px] text-red-700 font-medium mt-1">স্বচ্ছ হিসাবরক্ষণ</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-red-100 space-x-2 sm:space-x-4 overflow-x-auto pb-2">
        {[
          { key: 'buses', label: 'বহর ও বাস পরিচালনা', icon: BusIcon },
          { key: 'booths', label: 'কাউন্টার ও স্টপ', icon: Building2 },
          { key: 'fares', label: 'ভাড়া নীতি কনফিগ', icon: DollarSign },
          { key: 'bookings', label: 'টিকিট ও অডিট লগ', icon: Ticket },
          { key: 'incidents', label: 'রিপোর্ট ও হেল্পলাইন', icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-red-600 text-white shadow-sm shadow-red-600/20'
                  : 'text-slate-600 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Buses Management */}
      {activeTab === 'buses' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-red-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">
                ফ্লীট বাস ও ডিউটি স্ট্যাটাস কনফিগারেশন
              </h3>
              <p className="text-xs text-slate-500">
                বাসের রেজিস্ট্রেশন, চালক সংযুক্তি এবং জিপিএস স্ট্যাটাস পরিবর্তন
              </p>
            </div>
          </div>

          <div className="divide-y divide-red-50">
            {buses.map((bus) => (
              <div
                key={bus.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {bus.registrationNumberBn}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-semibold">
                      {bus.modelBn}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        bus.status === 'on_duty'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {bus.status === 'on_duty' ? 'অন-ডিউটি' : 'আইডল / অফলাইন'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                    <span>চালক: {bus.driverNameBn}</span>
                    <span>•</span>
                    <span>সুপারভাইজার: {bus.supervisorNameBn}</span>
                    <span>•</span>
                    <span>
                      স্থানাঙ্ক: {bus.currentLat.toFixed(4)}, {bus.currentLng.toFixed(4)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleBusDuty(bus.id, bus.status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      bus.status === 'on_duty'
                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                    }`}
                  >
                    {bus.status === 'on_duty' ? 'ডিউটি বন্ধ করুন' : 'ডিউটিতে যুক্ত করুন'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Booths & Stops */}
      {activeTab === 'booths' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-sm space-y-6">
          <div className="pb-4 border-b border-red-100">
            <h3 className="font-extrabold text-slate-900 text-lg">
              কাউন্টার বুথ ও স্টপেজ ডিরেক্টরি
            </h3>
            <p className="text-xs text-slate-500">
              ১২টি অনুমোদিত স্টপ ও কাউন্টারের ব্যবস্থাপনা
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {booths.map((booth) => (
              <div key={booth.id} className="p-4 rounded-2xl bg-white border border-red-100 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{booth.nameBn}</h4>
                  <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded">
                    সক্রিয়
                  </span>
                </div>
                <p className="text-xs text-slate-500">{booth.addressBn}</p>
                <div className="text-xs text-slate-600 pt-1 flex items-center justify-between">
                  <span>সময়: {booth.openingHours}</span>
                  <span className="font-mono font-bold text-slate-800">{booth.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Fare Matrix Configuration */}
      {activeTab === 'fares' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-sm space-y-6">
          <div className="pb-4 border-b border-red-100">
            <h3 className="font-extrabold text-slate-900 text-lg">
              ভাড়া পরিধি ও পর্যায় সমন্বয়
            </h3>
            <p className="text-xs text-slate-500">
              ন্যূনতম ভাড়া এবং টার্মিনাল সর্বোচ্চ সীমা নিয়ন্ত্রণ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100">
              <label className="block text-xs font-bold text-slate-500 uppercase">
                ন্যূনতম প্রারম্ভিক ভাড়া (১ স্টেজ)
              </label>
              <div className="text-2xl font-black text-red-600 font-mono mt-1">৳১০</div>
            </div>

            <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100">
              <label className="block text-xs font-bold text-slate-500 uppercase">
                টার্মিনাল সর্বোচ্চ ভাড়া (১০ স্টেজ)
              </label>
              <div className="text-2xl font-black text-red-600 font-mono mt-1">৳৪৫</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>
              ভাড়া তালিকায় যে কোনো পরিবর্তন প্রয়োগ করার আগে চট্টগ্রাম মেট্রোপলিটন বাস মালিক সমিতির রেজুলেশন অডিট সম্পন্ন হতে হবে।
            </span>
          </div>
        </div>
      )}

      {/* Tab 4: Bookings & Audit Log */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-red-100">
            <h3 className="font-extrabold text-slate-900 text-base">
              টিকেট বুকিং ও লেনদেন অডিট লগ
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              মোট: {toBengaliDigits(bookings.length)} টি
            </span>
          </div>

          <div className="divide-y divide-red-50 max-h-[500px] overflow-y-auto">
            {bookings.map((b) => (
              <div key={b.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded">
                      {b.reference}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{b.passengerName}</span>
                    <span className="text-[11px] font-mono text-slate-500">({b.passengerPhone})</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {b.fromStopNameBn} ➔ {b.toStopNameBn} • সিট: {b.selectedSeats.join(', ') || 'স্ট্যান্ডিং'}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-red-600">
                    {formatBDT(b.totalFareBDT)}
                  </div>
                  <span className="text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-full uppercase">
                    {b.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Incidents & Helpline Management */}
      {activeTab === 'incidents' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-sm space-y-6">
          <div className="pb-4 border-b border-red-100">
            <h3 className="font-extrabold text-slate-900 text-lg">
              হেল্পলাইন কনফিগারেশন ও অভিযোগ তালিকা
            </h3>
            <p className="text-xs text-slate-500">
              প্যাসেঞ্জার সাপোর্ট নম্বর ও ফিল্ড সুপারভাইজারদের প্রেরিত রিপোর্ট
            </p>
          </div>

          {/* Hotline Editor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-red-50/40 border border-red-100">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                প্রধান হেল্পলাইন নম্বর
              </label>
              <input
                type="text"
                value={helplinePrimary}
                onChange={(e) => setHelplinePrimary(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-red-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                পরামর্শ ও সহায়তা নম্বর
              </label>
              <input
                type="text"
                value={helplineSecondary}
                onChange={(e) => setHelplineSecondary(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-red-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Incidents List */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900">সাম্প্রতিক রিপোর্ট ও অনুসন্ধান</h4>
            <div className="space-y-3">
              {incidents.map((inc) => (
                <div key={inc.id} className="p-4 rounded-2xl border border-red-100 bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{inc.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
                      {inc.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{inc.description}</p>
                  <div className="text-[11px] text-slate-400 pt-1">
                    বাস: {inc.busNumber || 'সাধারণ'} • স্টপ: {inc.stopName || 'করিডোর'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
