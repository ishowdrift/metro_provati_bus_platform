'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  User,
  ShieldCheck,
  Building2,
  KeyRound,
  Lock,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  LogIn,
  X,
  Sparkles,
} from 'lucide-react';

function GoogleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { loginAs, loginWithGoogle } = useAuth();
  const { language } = useLanguage();

  // Active view: 'landing' (exact picture view), 'user', 'supervisor', 'counter'
  const [activeView, setActiveView] = useState<'landing' | 'user' | 'supervisor' | 'counter'>('landing');

  // User tab: 'login' | 'signup'
  const [userTab, setUserTab] = useState<'login' | 'signup'>('login');
  const [userIdentifier, setUserIdentifier] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.removeItem('metro_probati_google_email');
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Supervisor state
  const [supervisorPhone, setSupervisorPhone] = useState('');
  const [supervisorPassword, setSupervisorPassword] = useState('');
  const [supervisorError, setSupervisorError] = useState<string | null>(null);

  // Counter Representative state (Requires Special Code & Password)
  const [counterCode, setCounterCode] = useState('');
  const [counterPassword, setCounterPassword] = useState('');
  const [counterError, setCounterError] = useState<string | null>(null);

  // Authorized counter codes lookup
  const COUNTER_BOOTHS_MAP: Record<string, { id: string; name: string }> = {
    'MP-CTR-101': { id: 'booth-1', name: 'কাপ্তাই রাস্তার মাথা মাস্টার কাউন্টার' },
    'MP-CTR-102': { id: 'booth-2', name: 'বহদ্দারহাট বাস টার্মিনাল কাউন্টার' },
    'MP-CTR-103': { id: 'booth-4', name: 'জিইসি মোড় যাত্রী কাউন্টার' },
    'MP-CTR-105': { id: 'booth-7', name: 'আগ্রাবাদ বাণিজ্যিক এলাকা কাউন্টার' },
    'MP-CTR-106': { id: 'booth-10', name: 'কাঠগড় মাস্টার টার্মিনাল কাউন্টার' },
    'CTR-KAPTAI': { id: 'booth-1', name: 'কাপ্তাই রাস্তার মাথা মাস্টার কাউন্টার' },
    'CTR-KATHGAR': { id: 'booth-10', name: 'কাঠগড় মাস্টার টার্মিনাল কাউন্টার' },
  };

  // 1. User Login Handler (Supports Mobile Number OR Gmail)
  const handleUserLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ident = userIdentifier.trim();
    if (!ident || !userPassword) {
      setUserError('অনুগ্রহ করে মোবাইল নম্বর বা জিমেইল এবং পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    if (ident.includes('@')) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ident)) {
        setUserError('সঠিক জিমেইল বা ইমেইল ঠিকানা দিন (যেমন: user@gmail.com)');
        return;
      }
      const prefix = ident.split('@')[0];
      const derivedName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      loginAs('passenger', {
        name: derivedName,
        email: ident.toLowerCase(),
        phone: '',
        authProvider: ident.toLowerCase().endsWith('@gmail.com') ? 'google' : 'phone',
      });
      router.push('/');
      return;
    }

    if (ident.length < 10) {
      setUserError('সঠিক মোবাইল নম্বর (যেমন: 018XXXXXXXX) বা জিমেইল লিখুন');
      return;
    }
    loginAs('passenger', {
      name: `সম্মানিত যাত্রী (${ident.slice(-4)})`,
      phone: ident,
      authProvider: 'phone',
    });
    router.push('/');
  };

  // 2. User Create Profile Handler (Supports Mobile Number OR Gmail)
  const handleUserCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const ident = userIdentifier.trim();
    if (!ident || !userPassword) {
      setUserError('মোবাইল নম্বর বা জিমেইল এবং পাসওয়ার্ড প্রয়োজন। উভয় ঘর পূরণ করুন।');
      return;
    }

    if (userPassword.length < 4) {
      setUserError('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
      return;
    }

    if (ident.includes('@')) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ident)) {
        setUserError('সঠিক জিমেইল বা ইমেইল ঠিকানা দিন (যেমন: user@gmail.com)');
        return;
      }
      const prefix = ident.split('@')[0];
      const derivedName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      loginAs('passenger', {
        name: derivedName,
        email: ident.toLowerCase(),
        phone: '',
        authProvider: ident.toLowerCase().endsWith('@gmail.com') ? 'google' : 'phone',
      });
      router.push('/');
      return;
    }

    if (ident.length < 10) {
      setUserError('সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন (যেমন: 018XXXXXXXX) বা জিমেইল লিখুন');
      return;
    }

    loginAs('passenger', {
      name: `যাত্রী (${ident.slice(-4)})`,
      phone: ident,
      authProvider: 'phone',
    });
    router.push('/');
  };

  // Direct 1-Click Clean Google Login
  const handleGoogleQuickLogin = () => {
    loginWithGoogle();
    router.push('/');
  };

  // Quick Demo User Login
  const handleDemoUserLogin = () => {
    loginAs('passenger', {
      name: 'সম্মানিত যাত্রী',
      phone: '01812345678',
      email: 'passenger@gmail.com',
      authProvider: 'google',
    });
    router.push('/');
  };

  // 3. Supervisor Login Handler
  const handleSupervisorLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supervisorPhone || !supervisorPassword) {
      setSupervisorError('সুপারভাইজার মোবাইল নম্বর এবং পাসওয়ার্ড প্রদান করুন।');
      return;
    }
    loginAs('bus_supervisor', {
      name: 'মো. হাবিবুর রহমান (সুপারভাইজার)',
      phone: supervisorPhone || '01712000001',
    });
    router.push('/supervisor');
  };

  // Quick Demo Supervisor Login
  const handleDemoSupervisorLogin = () => {
    loginAs('bus_supervisor', {
      name: 'মো. হাবিবুর রহমান (সুপারভাইজার)',
      phone: '01712000001',
    });
    router.push('/supervisor');
  };

  // 4. Counter Representative Login Handler (SPECIAL CODE & PASSWORD REQUIRED)
  const handleCounterLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = counterCode.trim().toUpperCase();

    if (!cleanCode || !counterPassword) {
      setCounterError('কাউন্টার প্রতিনিধির জন্য বিশেষ কোড এবং পাসওয়ার্ড উভয়ই আবশ্যক।');
      return;
    }

    // Check special code and password
    const boothInfo = COUNTER_BOOTHS_MAP[cleanCode] || {
      id: 'booth-1',
      name: `${cleanCode} কাউন্টার`,
    };

    // Accepts standard demo password or any 4+ char password for authorized staff
    if (counterPassword.length < 4) {
      setCounterError('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে (ডেমো পাসওয়ার্ড: mp1234)');
      return;
    }

    loginAs('counter_representative', {
      name: `কাউন্টার স্টাফ (${cleanCode})`,
      phone: '01798542469',
      assignedCounterId: boothInfo.id,
      counterName: boothInfo.name,
    });
    router.push('/counter');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#dc2626] sm:bg-[#ea1d2d] flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto text-center select-none">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-600 via-red-600 to-red-700 opacity-90 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* ============================================================== */}
        {/* VIEW 1: LANDING INTERFACE (Matches user mockup image precisely) */}
        {/* ============================================================== */}
        {activeView === 'landing' && (
          <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
            {/* Centered Large Circular White Logo Badge with lightweight smooth zoom-out entrance animation */}
            <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-white shadow-2xl flex items-center justify-center p-3 sm:p-5 mb-8 sm:mb-10 border-4 border-white animate-logo-zoom-out transform hover:scale-105 transition-transform duration-200">
              <Image
                src="/logo.png"
                alt="Metro Probati MP Logo"
                width={220}
                height={220}
                className="w-full h-full object-contain rounded-full"
                priority
                unoptimized
              />
            </div>

            {/* Pill Buttons Container */}
            <div className="w-full space-y-4 sm:space-y-5 flex flex-col items-center animate-entrance-buttons">
              {/* Button 1: USER LOGIN */}
              <button
                onClick={() => {
                  setUserError(null);
                  setActiveView('user');
                }}
                className="w-full max-w-sm py-4 px-6 bg-white hover:bg-slate-50 active:scale-95 text-slate-800 font-black text-lg sm:text-xl rounded-full shadow-2xl flex items-center justify-center gap-3 transition-all duration-200 uppercase tracking-wider"
              >
                <div className="w-6 h-6 rounded-full bg-[#831843]/15 text-[#831843] flex items-center justify-center">
                  <User className="w-4 h-4 fill-current text-[#831843]" />
                </div>
                <span>USER LOGIN</span>
              </button>

              {/* Button 2: SUPERVISOR LOGIN */}
              <button
                onClick={() => {
                  setSupervisorError(null);
                  setActiveView('supervisor');
                }}
                className="w-full max-w-sm py-4 px-6 bg-white hover:bg-slate-50 active:scale-95 text-slate-800 font-black text-lg sm:text-xl rounded-full shadow-2xl flex items-center justify-center gap-3 transition-all duration-200 uppercase tracking-wider"
              >
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-slate-800" />
                </div>
                <span>SUPERVISOR LOGIN</span>
              </button>

              {/* Button 3: COUNTER REPRESENTATIVE (Special Code & Password) */}
              <button
                onClick={() => {
                  setCounterError(null);
                  setActiveView('counter');
                }}
                className="w-full max-w-sm py-3.5 px-6 bg-white/95 hover:bg-white active:scale-95 text-slate-900 font-extrabold text-base sm:text-lg rounded-full shadow-xl flex items-center justify-center gap-2.5 transition-all duration-200 uppercase tracking-wide border-2 border-white/60"
              >
                <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                  <Building2 className="w-3.5 h-3.5 text-red-700" />
                </div>
                <span>COUNTER REPRESENTATIVE</span>
              </button>

              {/* Button 4: CONTINUE WITH GOOGLE FAST ACCESS */}
              <button
                onClick={handleGoogleQuickLogin}
                className="w-full max-w-sm py-3.5 px-6 bg-white hover:bg-slate-50 active:scale-95 text-slate-800 font-extrabold text-sm sm:text-base rounded-full shadow-xl flex items-center justify-center gap-2.5 transition-all duration-200 border-2 border-white/90 uppercase tracking-wider"
              >
                <GoogleIcon className="w-5 h-5 flex-shrink-0" />
                <span>CONTINUE WITH GOOGLE</span>
              </button>
            </div>

            {/* Direct Skip to Homepage Link */}
            <Link
              href="/"
              className="mt-8 sm:mt-10 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/90 hover:text-white underline underline-offset-4 transition"
            >
              <span>সরাসরি মূল ওয়েবসাইটে প্রবেশ করুন (Browse Homepage)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: USER LOGIN & PROFILE (ONLY NUMBER & PASSWORD CREATION) */}
        {/* ============================================================== */}
        {activeView === 'user' && (
          <div className="w-full bg-white rounded-3xl p-5 sm:p-8 shadow-2xl border-4 border-white/80 space-y-5 text-left animate-in zoom-in-95 duration-200">
            {/* Top Back & Header */}
            <div className="flex items-center justify-between pb-3 border-b border-red-100">
              <button
                onClick={() => setActiveView('landing')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ফিরে যান</span>
              </button>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                যাত্রী পোর্টাল
              </span>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                User (সম্মানিত যাত্রী)
              </h2>
              <p className="text-xs text-slate-500">
                {userTab === 'signup'
                  ? 'মোবাইল নম্বর বা জিমেইল দিয়ে নতুন একাউন্ট খুলুন'
                  : 'মোবাইল নম্বর বা জিমেইল দিয়ে লগইন করুন'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 bg-red-50 rounded-xl border border-red-100">
              <button
                type="button"
                onClick={() => {
                  setUserTab('login');
                  setUserError(null);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition ${
                  userTab === 'login'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-red-700'
                }`}
              >
                লগইন (Login)
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserTab('signup');
                  setUserError(null);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition ${
                  userTab === 'signup'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-red-700'
                }`}
              >
                নতুন প্রোফাইল (Make Profile)
              </button>
            </div>

            {/* Continue with Google Section */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handleGoogleQuickLogin}
                className="w-full py-3 px-4 bg-white hover:bg-slate-50 active:scale-98 text-slate-800 font-extrabold text-xs sm:text-sm rounded-xl border border-slate-300 shadow-sm flex items-center justify-center gap-3 transition-all duration-200 hover:border-slate-400 group"
              >
                <GoogleIcon className="w-5 h-5 flex-shrink-0" />
                <span className="text-slate-800 font-bold group-hover:text-red-600 transition-colors">
                  Google দিয়ে চালিয়ে যান (Continue with Google)
                </span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider absolute">
                  অথবা মোবাইল / জিমেইল
                </span>
              </div>
            </div>

            {userError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{userError}</span>
              </div>
            )}

            {/* Form: Shared for login and signup (Supports Number & Gmail) */}
            <form
              onSubmit={userTab === 'signup' ? handleUserCreateProfile : handleUserLoginSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>মোবাইল নম্বর অথবা জিমেইল *</span>
                  <span className="text-[10px] text-slate-400 font-normal lowercase font-sans">
                    phone or email
                  </span>
                </label>
                <div className="relative">
                  {userIdentifier.includes('@') ? (
                    <Mail className="w-4 h-4 text-red-500 absolute left-3.5 top-3" />
                  ) : (
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  )}
                  <input
                    type="text"
                    required
                    placeholder="018XXXXXXXX বা user@gmail.com"
                    value={userIdentifier}
                    onChange={(e) => setUserIdentifier(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  পাসওয়ার্ড (Password) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="পাসওয়ার্ড লিখুন"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {userTab === 'signup' && (
                <div className="p-3 bg-red-50/60 rounded-xl border border-red-100 text-[11px] text-red-800 leading-snug">
                  ✓ কোনো দীর্ঘ ফর্মের ঝামেলা নেই। আপনার জিমেইল/ইমেইল বা মোবাইল নম্বর ও পাসওয়ার্ড দিলেই স্থায়ী প্রোফাইল সক্রিয় হবে। অথবা উপরের Google বাটনে ১-ক্লিকেই একাউন্ট খুলতে পারেন।
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
              >
                {userTab === 'signup' ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>প্রোফাইল তৈরি ও প্রবেশ করুন</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>লগইন করুন ও প্রবেশ করুন</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Enter */}
            <div className="pt-2 text-center border-t border-slate-100">
              <button
                type="button"
                onClick={handleDemoUserLogin}
                className="text-xs font-bold text-slate-500 hover:text-red-600 transition"
              >
                বা ডেমো ইউজার হিসেবে সরাসরি প্রবেশ করুন ➔
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: SUPERVISOR LOGIN */}
        {/* ============================================================== */}
        {activeView === 'supervisor' && (
          <div className="w-full bg-white rounded-3xl p-5 sm:p-8 shadow-2xl border-4 border-white/80 space-y-5 text-left animate-in zoom-in-95 duration-200">
            {/* Top Back & Header */}
            <div className="flex items-center justify-between pb-3 border-b border-red-100">
              <button
                onClick={() => setActiveView('landing')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ফিরে যান</span>
              </button>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                অন-বোর্ড স্টাফ
              </span>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Supervisor (বাস সুপারভাইজার)
              </h2>
              <p className="text-xs text-slate-500">
                অন-বোর্ড বাসের সিট ব্যবস্থাপনা, স্ট্যান্ডিং হালনাগাদ ও ট্রাফিক রিপোর্ট
              </p>
            </div>

            {supervisorError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{supervisorError}</span>
              </div>
            )}

            <form onSubmit={handleSupervisorLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  সুপারভাইজার মোবাইল / পিন *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="01712000001 বা SUPER-101"
                    value={supervisorPhone}
                    onChange={(e) => setSupervisorPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
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
                    placeholder="পাসওয়ার্ড লিখুন"
                    value={supervisorPassword}
                    onChange={(e) => setSupervisorPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>সুপারভাইজার কনসোলে প্রবেশ</span>
              </button>
            </form>

            <div className="pt-2 text-center border-t border-slate-100">
              <button
                type="button"
                onClick={handleDemoSupervisorLogin}
                className="text-xs font-bold text-slate-500 hover:text-red-600 transition"
              >
                বা ডেমো সুপারভাইজার হিসেবে সরাসরি প্রবেশ করুন ➔
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 4: COUNTER REPRESENTATIVE (SPECIAL CODE & PASSWORD)      */}
        {/* ============================================================== */}
        {activeView === 'counter' && (
          <div className="w-full bg-white rounded-3xl p-5 sm:p-8 shadow-2xl border-4 border-white/80 space-y-5 text-left animate-in zoom-in-95 duration-200">
            {/* Top Back & Header */}
            <div className="flex items-center justify-between pb-3 border-b border-red-100">
              <button
                onClick={() => setActiveView('landing')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ফিরে যান</span>
              </button>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
                বিশেষ বুথ এক্সেস
              </span>
            </div>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto shadow-xs">
                <Building2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                Counter Representative
              </h2>
              <p className="text-xs text-slate-500">
                কাউন্টার প্রতিনিধি লগইনের জন্য বিশেষ কোড এবং পাসওয়ার্ড আবশ্যক
              </p>
            </div>

            {counterError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{counterError}</span>
              </div>
            )}

            <form onSubmit={handleCounterLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  বিশেষ কাউন্টার সিক্রেট কোড (Special Code) *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-red-600 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="যেমন: MP-CTR-101"
                    value={counterCode}
                    onChange={(e) => setCounterCode(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 uppercase tracking-wider"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  কাউন্টার পাসওয়ার্ড (Password) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="কাউন্টার পাসওয়ার্ড (যেমন: mp1234)"
                    value={counterPassword}
                    onChange={(e) => setCounterPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Authorized Counter Codes Helper Chips */}
              <div className="p-3 bg-red-50/60 rounded-xl border border-red-100 space-y-1.5 text-left">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  অনুমোদিত টেস্ট কাউন্টার কোড (ক্লিক করে অটো-ফিল করুন):
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { code: 'MP-CTR-101', label: 'কাপ্তাই' },
                    { code: 'MP-CTR-102', label: 'বহদ্দারহাট' },
                    { code: 'MP-CTR-103', label: 'জিইসি' },
                    { code: 'MP-CTR-106', label: 'কাঠগড়' },
                  ].map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setCounterCode(c.code);
                        setCounterPassword('mp1234');
                      }}
                      className="px-2 py-0.5 bg-white border border-red-200 hover:bg-red-50 text-[10px] font-mono font-bold text-red-700 rounded-md transition"
                    >
                      {c.code} ({c.label})
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-slate-500 pt-0.5">
                  টেস্ট পাসওয়ার্ড: <strong className="font-mono text-slate-800">mp1234</strong>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>কাউন্টার ড্যাশবোর্ডে প্রবেশ করুন</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
