'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Bus, UserPlus, Phone, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { loginAs } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      setError('অনুগ্রহ করে মোবাইল নম্বর এবং পাসওয়ার্ড উভয়ই প্রদান করুন।');
      return;
    }
    if (phone.length < 10) {
      setError('সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন (যেমন: 018XXXXXXXX)');
      return;
    }
    if (password.length < 4) {
      setError('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
      return;
    }

    // Creates user profile using ONLY number and password
    loginAs('passenger', {
      name: `সম্মানিত যাত্রী (${phone.slice(-4)})`,
      phone,
    });
    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto shadow-md">
          <Bus className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          মেট্রো প্রভাতী যাত্রী অ্যাকাউন্ট
        </h1>
        <p className="text-xs text-slate-500">
          সহজ প্রক্রিয়া: শুধুমাত্র মোবাইল নম্বর এবং পাসওয়ার্ড দিয়ে প্রোফাইল তৈরি করুন
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-xl space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              মোবাইল নম্বর *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                placeholder="018XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              পাসওয়ার্ড *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="কমপক্ষে ৪ অক্ষর"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="p-3 bg-red-50 rounded-xl text-[11px] text-red-800 border border-red-100 leading-snug">
            ✓ কোনো বাড়তি তথ্য বা দীর্ঘ ফর্মের প্রয়োজন নেই। শুধুমাত্র মোবাইল নম্বর ও পাসওয়ার্ড দিয়ে স্থায়ী যাত্রী প্রোফাইল তৈরি সম্পন্ন হবে।
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-xl transition shadow-md shadow-red-600/30 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>প্রোফাইল তৈরি ও প্রবেশ করুন</span>
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
          <Link href="/login" className="font-bold text-red-600 hover:underline">
            লগইন করুন
          </Link>
        </div>
      </div>
    </div>
  );
}
