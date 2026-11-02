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
  Ticket,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { INITIAL_HELPLINE } from '@/data/mockData';
import { toBengaliDigits } from '@/lib/fareCalculator';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();
  const { role, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide entire navbar on login interface for clean full-screen experience
  if (pathname === '/login' || pathname?.startsWith('/login')) {
    return null;
  }

  const isSupervisorOrCounter =
    role === 'bus_supervisor' ||
    role === 'counter_representative' ||
    role === 'counter_manager' ||
    role === 'operations_admin' ||
    role === 'super_admin';

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/routes', label: t('nav.routes') },
    { href: '/tracking', label: t('nav.tracking') },
    { href: '/fares', label: t('nav.fares') },
    { href: '/counters', label: t('nav.counters') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[#E5E0D8] transition-colors shadow-xs">
      {/* Wayfinding Mini Corridor Strip */}
      <div className="bg-[#272524] text-white py-1.5 px-4 text-[10px] font-mono tracking-wider">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white">LINE MP-01</span>
            <span className="text-white/40">/</span>
            <span className="text-white/80">
              {language === 'bn' ? 'কাপ্তাই রাস্তার মাথা ↔ কাঠগড় (২৪.৯ কিমি)' : 'Kaptai Rastar Matha ↔ Katgor (24.9 KM)'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-white/70">
            <span>
              {language === 'bn' ? 'হেল্পলাইন:' : 'Helpline:'}{' '}
              <strong className="text-white font-mono">{toBengaliDigits('01882925610')}</strong>
            </span>
            <span className="text-white/30">|</span>
            <span>{language === 'bn' ? 'সকাল ৬:০০ – রাত ১১:০০' : '06:00 AM – 11:00 PM'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Wordmark */}
          <Link
            href="/"
            className="group flex items-center gap-3 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C92232]"
          >
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-xs border border-[#E5E0D8] transition-transform duration-200 group-hover:scale-105 sm:h-12 sm:w-12">
              <Image
                src="/logo.png"
                alt="মেট্রো প্রভাতী লোগো"
                width={48}
                height={48}
                className="w-full h-full object-contain"
                priority
                unoptimized
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-[#272524] sm:text-xl font-display">
                  মেট্রো প্রভাতী
                </span>
                <span className="border-l border-[#E5E0D8] pl-2 text-[10px] font-extrabold uppercase tracking-wider text-[#C92232]">
                  চট্টগ্রাম
                </span>
              </div>
              <p className="hidden text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:block">
                Metro Probati • Express Transit
              </p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#F2E4E2] text-[#C92232] shadow-xs'
                      : 'text-slate-600 hover:text-[#C92232] hover:bg-[#F1EEE8]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions: Language, User Profile, CTA Book Ticket */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E5E0D8] bg-white text-xs font-bold text-[#272524] hover:bg-[#F2E4E2] hover:text-[#C92232] hover:border-[#F2E4E2] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C92232]"
            >
              <Languages className="w-3.5 h-3.5 text-[#C92232]" />
              <span>{language === 'bn' ? 'EN' : 'বাং'}</span>
            </button>

            {/* User / Staff Controls */}
            {user ? (
              <div className="flex items-center gap-1.5">
                {role === 'passenger' && (
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FFF5F5] hover:bg-[#F2E4E2] border border-[#F2E4E2] text-xs font-bold text-[#272524] transition"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#49665A] animate-pulse" />
                    <User className="w-3.5 h-3.5 text-[#C92232]" />
                    <span className="max-w-[110px] truncate">{user.name || user.phone || 'যাত্রী'}</span>
                  </Link>
                )}

                {(role === 'bus_supervisor' || role === 'operations_admin') && (
                  <Link
                    href="/supervisor"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#A87936] hover:bg-amber-700 text-white text-xs font-bold transition shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    <span>{language === 'bn' ? 'সুপারভাইজার' : 'Supervisor'}</span>
                  </Link>
                )}

                {(role === 'counter_representative' || role === 'counter_manager') && (
                  <Link
                    href="/counter"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#C92232] hover:bg-[#A91D2A] text-white text-xs font-bold transition shadow-xs"
                  >
                    <Building2 className="w-3.5 h-3.5 text-white" />
                    <span>{language === 'bn' ? 'কাউন্টার পিওএস' : 'Counter POS'}</span>
                  </Link>
                )}

                {role === 'super_admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#272524] hover:bg-black text-white text-xs font-bold transition shadow-xs"
                  >
                    <Shield className="w-3.5 h-3.5 text-white" />
                    <span>{language === 'bn' ? 'অ্যাডমিন' : 'Admin'}</span>
                  </Link>
                )}

                <button
                  onClick={logout}
                  title={language === 'bn' ? 'লগআউট করুন' : 'Logout'}
                  className="p-2 rounded-xl border border-[#E5E0D8] hover:bg-[#FFF5F5] hover:text-[#C92232] hover:border-[#F2E4E2] text-slate-600 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E5E0D8] bg-white hover:bg-[#F2E4E2] hover:border-[#F2E4E2] text-[#272524] hover:text-[#C92232] text-xs font-bold transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#C92232]" />
                <span>{language === 'bn' ? 'প্রবেশ' : 'Sign In'}</span>
              </Link>
            )}

            {/* Primary Action Button: Book Ticket */}
            <Link
              href="/tickets"
              className="flex items-center gap-2 bg-[#C92232] px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-white transition-all duration-200 hover:bg-[#A91D2A] active:scale-95 shadow-md shadow-[#C92232]/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C92232]"
            >
              <Ticket className="w-4 h-4 text-white" />
              <span>{isSupervisorOrCounter ? (language === 'bn' ? 'সিট মনিটর' : 'Seat Monitor') : (language === 'bn' ? 'আসন বুকিং' : 'Book Ticket')}</span>
            </Link>
          </div>

          {/* Mobile Actions: Language + CTA + Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-lg border border-[#E5E0D8] text-xs font-bold text-[#272524]"
              aria-label="Toggle language"
            >
              {language === 'bn' ? 'EN' : 'বাং'}
            </button>

            <Link
              href="/tickets"
              className="px-3 py-1.5 rounded-lg bg-[#C92232] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#A91D2A]"
            >
              <Ticket className="w-3.5 h-3.5 text-white" />
              <span>{language === 'bn' ? 'টিকেট' : 'Book'}</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-[#F2E4E2] hover:text-[#C92232] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C92232]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#C92232]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E0D8] bg-white px-4 pt-3 pb-6 space-y-4 animate-fade-in-up shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold text-center transition ${
                    isActive
                      ? 'bg-[#C92232] text-white'
                      : 'bg-[#F1EEE8] text-[#272524] hover:bg-[#F2E4E2] hover:text-[#C92232]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Info or Login */}
          {user ? (
            <div className="p-3.5 rounded-2xl bg-[#FFF5F5] border border-[#F2E4E2] flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#C92232] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {user.name ? user.name.charAt(0) : 'P'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {user.name || user.phone}
                  </p>
                  <p className="text-[10px] text-[#C92232] font-bold uppercase">{user.role?.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={role === 'bus_supervisor' ? '/supervisor' : role === 'counter_representative' ? '/counter' : '/profile'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#F2E4E2] text-[#C92232] text-xs font-bold"
                >
                  {language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="p-1 text-slate-500 hover:text-[#C92232]"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-[#FFF5F5] hover:bg-[#F2E4E2] border border-[#F2E4E2] text-[#C92232] text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <UserCheck className="w-4 h-4 text-[#C92232]" />
              <span>{language === 'bn' ? 'প্রবেশ / লগইন করুন' : 'Sign In / Account'}</span>
            </Link>
          )}

          {/* Quick Helplines */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <a href={`tel:${INITIAL_HELPLINE.primaryNumber}`} className="flex items-center gap-1 font-mono font-bold text-[#C92232]">
              <Phone className="w-3.5 h-3.5 text-[#C92232]" />
              <span>{toBengaliDigits(INITIAL_HELPLINE.primaryNumber)}</span>
            </a>
            <span className="text-[11px] text-slate-400">
              {language === 'bn' ? 'সকাল ০৬:০০ — রাত ১১:০০' : '06:00 AM — 11:00 PM'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
