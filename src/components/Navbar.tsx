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
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Wordmark */}
          <Link
            href="/"
            className="group flex items-center gap-3 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C92232]"
          >
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden bg-white transition-transform duration-200 group-hover:scale-[1.03] sm:h-12 sm:w-12">
              <Image
                src="/logo.png"
                alt="মেট্রো প্রভাতী লোগো"
                width={48}
                height={48}
                className="w-full h-full object-contain rounded-none"
                priority
                unoptimized
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-lg font-black tracking-[-0.04em] text-stone-950 sm:text-xl">
                  মেট্রো প্রভাতী
                </span>
                <span className="border-l border-stone-300 pl-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#C92232] sm:text-[10px]">
                  চট্টগ্রাম
                </span>
              </div>
              <p className="hidden text-[9px] font-semibold uppercase tracking-[0.19em] text-stone-500 sm:block sm:text-[10px]">
                Metro Probati • Transit Intelligence
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
                  className={`border-b-2 px-2.5 py-3 text-[12px] font-bold transition-all duration-150 xl:px-3 ${
                    isActive
                      ? 'border-[#C92232] text-[#C92232]'
                      : 'border-transparent text-stone-600 hover:border-stone-300 hover:text-[#C92232]'
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 border border-stone-200 text-xs font-bold text-stone-700 hover:bg-[#FFF7F6] hover:text-[#C92232] hover:border-[#FCEBEC] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C92232]"
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
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#FFF7F6] hover:bg-[#FCEBEC] border border-[#FCEBEC] text-xs font-bold text-stone-800 transition"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#24775F] animate-pulse" />
                    <User className="w-3.5 h-3.5 text-[#C92232]" />
                    <span className="max-w-[110px] truncate">{user.name || user.phone || 'যাত্রী'}</span>
                  </Link>
                )}

                {(role === 'bus_supervisor' || role === 'operations_admin') && (
                  <Link
                    href="/supervisor"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#B7791F] hover:bg-amber-700 text-white text-xs font-bold transition"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    <span>{language === 'bn' ? 'সুপারভাইজার' : 'Supervisor'}</span>
                  </Link>
                )}

                {(role === 'counter_representative' || role === 'counter_manager') && (
                  <Link
                    href="/counter"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C92232] hover:bg-[#A91D2A] text-white text-xs font-bold transition"
                  >
                    <Building2 className="w-3.5 h-3.5 text-white" />
                    <span>{language === 'bn' ? 'কাউন্টার পিওএস' : 'Counter POS'}</span>
                  </Link>
                )}

                {role === 'super_admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#211F1F] hover:bg-black text-white text-xs font-bold transition"
                  >
                    <Shield className="w-3.5 h-3.5 text-white" />
                    <span>{language === 'bn' ? 'অ্যাডমিন' : 'Admin'}</span>
                  </Link>
                )}

                <button
                  onClick={logout}
                  title={language === 'bn' ? 'লগআউট করুন' : 'Logout'}
                  className="p-1.5 border border-stone-200 hover:bg-[#FFF7F6] hover:text-[#C92232] hover:border-[#FCEBEC] text-stone-600 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-2 border border-stone-200 hover:bg-[#FFF7F6] hover:border-[#FCEBEC] text-stone-700 hover:text-[#C92232] text-xs font-bold transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#C92232]" />
                <span>{language === 'bn' ? 'প্রবেশ' : 'Sign In'}</span>
              </Link>
            )}

            {/* Primary Action Button: Book Ticket */}
            <Link
              href="/tickets"
              className="flex items-center gap-2 bg-[#C92232] px-4 py-2.5 text-xs font-extrabold text-white transition-all duration-200 hover:bg-[#A91D2A] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C92232]"
            >
              <Ticket className="w-3.5 h-3.5 text-white" />
              <span>{isSupervisorOrCounter ? (language === 'bn' ? 'সিট মনিটর' : 'Seat Monitor') : (language === 'bn' ? 'আসন বুকিং' : 'Book Ticket')}</span>
            </Link>
          </div>

          {/* Mobile Actions: Language + CTA + Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 border border-stone-200 text-xs font-bold text-stone-700"
              aria-label="Toggle language"
            >
              {language === 'bn' ? 'EN' : 'বাং'}
            </button>

            <Link
              href="/tickets"
              className="px-3 py-1.5 bg-[#C92232] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#A91D2A]"
            >
              <Ticket className="w-3 h-3 text-white" />
              <span>{language === 'bn' ? 'টিকেট' : 'Book'}</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:bg-[#FFF7F6] hover:text-[#C92232] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C92232]"
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
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-fade-in-up shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 text-xs font-bold text-center transition ${
                    isActive
                      ? 'bg-[#C92232] text-white'
                      : 'bg-[#FAF9F7] text-stone-700 hover:bg-[#FFF7F6] hover:text-[#C92232]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Info or Login */}
          {user ? (
            <div className="p-3 bg-[#FFF7F6] border border-[#FCEBEC] flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 bg-[#C92232] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {user.name ? user.name.charAt(0) : 'P'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-stone-900 truncate">
                    {user.name || user.phone}
                  </p>
                  <p className="text-[10px] text-[#C92232] font-bold uppercase">{user.role?.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={role === 'bus_supervisor' ? '/supervisor' : role === 'counter_representative' ? '/counter' : '/profile'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2.5 py-1 bg-white border border-[#FCEBEC] text-[#C92232] text-xs font-bold"
                >
                  {language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="p-1 text-stone-500 hover:text-[#C92232]"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 bg-[#FFF7F6] hover:bg-[#FCEBEC] border border-[#FCEBEC] text-[#C92232] text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <UserCheck className="w-4 h-4 text-[#C92232]" />
              <span>{language === 'bn' ? 'প্রবেশ / লগইন করুন' : 'Sign In / Account'}</span>
            </Link>
          )}

          {/* Quick Helplines */}
          <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
            <a href={`tel:${INITIAL_HELPLINE.primaryNumber}`} className="flex items-center gap-1 font-mono font-bold text-[#C92232]">
              <Phone className="w-3.5 h-3.5 text-[#C92232]" />
              <span>{INITIAL_HELPLINE.primaryNumber}</span>
            </a>
            <span className="text-[11px] text-stone-400">
              {language === 'bn' ? 'সকাল ০৬:০০ — রাত ১১:৩০' : '06:00 AM — 11:30 PM'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
