'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Phone, ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_STOPS } from '@/data/mockData';

export default function IncidentReportPage() {
  const { language } = useLanguage();
  const [category, setCategory] = useState<'overcrowding' | 'delay' | 'driver_behavior' | 'lost_item' | 'counter_issue' | 'other'>('overcrowding');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [stopName, setStopName] = useState(INITIAL_STOPS[0].nameBn);
  const [contactPhone, setContactPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          title,
          description,
          busNumber,
          stopName,
          contactPhone,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>হোমে ফিরে যান</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-red-100 shadow-xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              অভিযোগ বা অনুসন্ধান দাখিল করুন
            </h1>
            <p className="text-xs text-slate-500">
              যাত্রী সুরক্ষা, অতিরিক্ত ভাড়া, ফেলে যাওয়া মালামাল বা সেবার মানোন্নয়নে সহায়তা করুন
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-red-600 mx-auto" />
            <h3 className="font-bold text-lg">আপনার রিপোর্ট সফলভাবে নথিভুক্ত হয়েছে</h3>
            <p className="text-xs text-red-800">
              মেট্রো প্রভাতী ফিল্ড সুপারভাইজার ও অ্যাডমিন প্যানেল বিষয়টি তদন্ত করে প্রয়োজনীয় পদক্ষেপ গ্রহণ করবে।
            </p>
            <Link
              href="/"
              className="inline-block mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
            >
              মূল পাতায় যান
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                অভিযোগ / অনুসন্ধানের বিষয়শ্রেণী *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
              >
                <option value="overcrowding">অননুমোদিত অতিরিক্ত ভিড় / ১৫ জনের বেশি দাঁড়িয়ে থাকা</option>
                <option value="delay">অতিরিক্ত বিলম্ব বা সময়সূচি বিভ্রাট</option>
                <option value="lost_item">বাস বা কাউন্টারে ফেলে যাওয়া মালামাল উদ্ধার</option>
                <option value="driver_behavior">চালক বা সহকারীর আচরণ সম্পর্কিত</option>
                <option value="counter_issue">কাউন্টারে অতিরিক্ত ভাড়া দাবি বা টিকিট না দেওয়া</option>
                <option value="other">অন্যান্য সাধারণ অভিযোগ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                সংক্ষিপ্ত শিরোনাম *
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: বহদ্দারহাট কাউন্টারে বাড়তি ভাড়া দাবি"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  বাসের নম্বর (যদি জানা থাকে)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: চট্ট মেট্রো ব ১১-০১৮৩"
                  value={busNumber}
                  onChange={(e) => setBusNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  নিকটস্থ স্টপেজ
                </label>
                <select
                  value={stopName}
                  onChange={(e) => setStopName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                >
                  {INITIAL_STOPS.map((s) => (
                    <option key={s.id} value={s.nameBn}>
                      {s.nameBn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                বিস্তারিত বিবরণ *
              </label>
              <textarea
                required
                rows={4}
                placeholder="ঘটনাটির সুনির্দিষ্ট সময়, স্থান ও বিস্তারিত পরিস্থিতি লিখুন..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                আপনার যোগাযোগের নম্বর *
              </label>
              <input
                type="tel"
                required
                placeholder="018XXXXXXXX"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition shadow-md"
            >
              {loading ? 'জমা হচ্ছে...' : 'রিপোর্ট দাখিল করুন'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
