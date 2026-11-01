'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Ticket, Navigation, DollarSign, Phone, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { role } = useAuth();

  // Hide bottom navigation on login page for clean immersive full-screen interface
  if (pathname === '/login' || pathname?.startsWith('/login')) {
    return null;
  }

  const isStaff =
    role === 'bus_supervisor' ||
    role === 'counter_representative' ||
    role === 'counter_manager' ||
    role === 'operations_admin' ||
    role === 'super_admin';

  const items = [
    { href: '/', label: 'হোম', icon: Home },
    {
      href: '/tickets',
      label: isStaff ? 'সিট মনিটর' : 'টিকেট',
      icon: isStaff ? Users : Ticket,
    },
    { href: '/tracking', label: 'বাস কই?', icon: Navigation },
    { href: '/fares', label: 'ভাড়া', icon: DollarSign },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-red-100 px-2 py-1.5 shadow-lg flex items-center justify-around safe-bottom">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-bold transition-colors ${
              isActive
                ? 'text-red-600 font-extrabold'
                : 'text-slate-500 hover:text-red-600'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-red-600 stroke-[2.5]' : 'text-slate-500'}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}

      {/* Emergency Call Quick Button */}
      <a
        href="tel:01798542469"
        className="flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 active:bg-red-100"
      >
        <Phone className="w-5 h-5 mb-0.5 text-red-600 stroke-[2.5]" />
        <span>হেল্পলাইন</span>
      </a>
    </div>
  );
};
