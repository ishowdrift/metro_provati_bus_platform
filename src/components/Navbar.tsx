'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Languages,
  UserCheck,
  LogOut,
  Building2,
  ShieldCheck,
  Shield,
  Phone,
  User,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();
  const { role, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide entire navbar on login interface for clean full-screen experience
  if (pathname === '/login' || pathname?.startsWith('/login')) {
    return null;
  }

  // Counter Directory is restricted to counter representatives & supervisors
  const isStaff =
    role === 'counter_representative' ||
    role === 'counter_manager' ||
    role === 'bus_supervisor' ||
    role === 'operations_admin' ||
    role === 'super_admin';

  const isSupervisorOrCounter =
    role === 'bus_supervisor' ||
    role === 'counter_representative' ||
    role === 'counter_manager' ||
    role === 'operations_admin' ||
    role === 'super_admin';

  const ticketsLabel = isSupervisorOrCounter
    ? (language === 'bn' ? 'সিট মনিটর' : 'Seat Monitor')
    : t('nav.tickets');

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/routes', label: t('nav.routes') },
    ...(isStaff ? [{ href: '/counters', label: t('nav.counters') }] : []),
    { href: '/fares', label: t('nav.fares') },
    { href: '/tracking', label: t('nav.tracking') },
    { href: '/tickets', label: ticketsLabel },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-red-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Brand Logo & Wordmark */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl overflow-hidden ring-2 ring-red-500/30 shadow-xs group-hover:scale-105 transition-transform duration-200 bg-white flex items-center justify-center p-0.5">
              <Image
                src="/logo.png"
                alt="মেট্রো প্রভাতী লোগো"
                width={48}
                height={48}
                className="w-full h-full object-contain rounded-md sm:rounded-lg"
                unoptimized
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-base sm:text-lg md:text-xl text-slate-900 tracking-tight">
                  মেট্রো প্রভাতী
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                  চট্টগ্রাম
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-wider hidden sm:block">
                Metro Probati Digital Transit
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action Tools & User Status */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-red-50 hover:border-red-200 transition"
            >
              <Languages className="w-3.5 h-3.5 text-red-600" />
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* User / Staff Controls */}
            {user ? (
              <div className="flex items-center gap-1.5">
                {/* 1. Passenger Profile Pill */}
                {role === 'passenger' && (
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-bold text-slate-800 transition"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <User className="w-3.5 h-3.5 text-red-600" />
                    <span className="max-w-[130px] truncate">{user.name || user.phone || 'যাত্রী'}</span>
                    <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold">
                      {language === 'bn' ? 'যাত্রী' : 'Passenger'}
                    </span>
                  </Link>
                )}

                {/* 2. Supervisor Console Button */}
                {(role === 'bus_supervisor' || role === 'operations_admin') && (
                  <Link
                    href="/supervisor"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    <span>{language === 'bn' ? 'সুপারভাইজার কনসোল' : 'Supervisor'}</span>
                  </Link>
                )}

                {/* 3. Counter Representative Dashboard Button */}
                {(role === 'counter_representative' || role === 'counter_manager') && (
                  <Link
                    href="/counter"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs"
                  >
                    <Building2 className="w-3.5 h-3.5 text-white" />
                    <span>{language === 'bn' ? 'কাউন্টার ড্যাশবোর্ড' : 'Counter Rep'}</span>
                  </Link>
                )}

                {/* 4. Super Admin */}
                {role === 'super_admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold transition shadow-xs"
                  >
                    <Shield className="w-3.5 h-3.5 text-white" />
                    <span>{language === 'bn' ? 'অ্যাডমিন' : 'Admin'}</span>
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={logout}
                  title={language === 'bn' ? 'লগআউট করুন' : 'Logout'}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-slate-600 text-xs font-bold transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
                </button>
              </div>
            ) : (
              /* Direct Login / Entry Button for Guests */
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5 text-white" />
                <span>{language === 'bn' ? 'প্রবেশ / লগইন' : 'Enter / Login'}</span>
              </Link>
            )}

            {/* Emergency Helpline Pill */}
            <a
              href="tel:01798542469"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-red-800 text-xs font-bold transition"
            >
              <Phone className="w-3.5 h-3.5 text-red-600" />
              <span className="font-mono">01798542469</span>
            </a>
          </div>

          {/* Mobile Quick Action & Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            {user ? (
              <Link
                href={
                  role === 'bus_supervisor'
                    ? '/supervisor'
                    : role === 'counter_representative'
                    ? '/counter'
                    : '/profile'
                }
                className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-bold max-w-[120px] truncate"
              >
                {role === 'passenger'
                  ? '👤 প্রোফাইল'
                  : role === 'bus_supervisor'
                  ? '🪪 সুপারভাইজার'
                  : '🏢 কাউন্টার'}
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-bold shadow-xs"
              >
                লগইন
              </Link>
            )}

            <button
              onClick={toggleLanguage}
              className="p-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:border-red-200"
            >
              {language === 'bn' ? 'EN' : 'বাং'}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-red-50 hover:text-red-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-red-100 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          {/* Main Navigation Links */}
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold text-center transition ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-red-50 hover:text-red-700'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Status Card & Actions - Completely separate by role */}
          {user ? (
            <div className="pt-1">
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {user.name ? user.name.charAt(0) : 'P'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {user.name || user.phone}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">{user.phone}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white shrink-0">
                  {role === 'passenger'
                    ? 'যাত্রী'
                    : role === 'bus_supervisor'
                    ? 'সুপারভাইজার'
                    : role === 'counter_representative'
                    ? 'কাউন্টার প্রতিনিধি'
                    : 'স্টাফ'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                {role === 'passenger' && (
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3 text-center bg-white border border-red-200 text-red-700 rounded-lg text-xs font-bold hover:bg-red-50 flex items-center justify-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>আমার প্রোফাইল</span>
                  </Link>
                )}

                {(role === 'bus_supervisor' || role === 'operations_admin') && (
                  <Link
                    href="/supervisor"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3 text-center bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>সুপারভাইজার কনসোল</span>
                  </Link>
                )}

                {(role === 'counter_representative' || role === 'counter_manager') && (
                  <Link
                    href="/counter"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 px-3 text-center bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 flex items-center justify-center gap-1.5"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>কাউন্টার ড্যাশবোর্ড</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 text-center bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>লগআউট</span>
                </button>
              </div>
            </div>
          ) : (
            /* Unauthenticated / Guest Mobile Button */
            <div className="pt-1">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'প্রবেশ / লগইন করুন' : 'Login / Enter'}</span>
              </Link>
            </div>
          )}

          {/* Help contacts */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>হেল্পলাইন: 01798542469</span>
            <span>সহায়তা: 01918695599</span>
          </div>
        </div>
      )}
    </header>
  );
};
