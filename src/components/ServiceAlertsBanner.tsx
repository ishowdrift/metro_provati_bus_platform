'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_ALERTS } from '@/data/mockData';
import { AlertCircle, ChevronRight, X } from 'lucide-react';

export const ServiceAlertsBanner: React.FC = () => {
  const pathname = usePathname();
  const { language } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  // Hide on login screen
  if (pathname === '/login' || pathname?.startsWith('/login')) {
    return null;
  }

  const activeAlert = INITIAL_ALERTS.find((a) => a.isActive);

  if (!activeAlert || dismissed) return null;

  return (
    <aside
      aria-label="Service Alert"
      className="bg-red-50 border-b border-red-200 px-4 py-2 text-xs md:text-sm text-red-950 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span className="font-semibold text-red-900 flex-shrink-0">
            {language === 'bn' ? activeAlert.titleBn : activeAlert.titleEn}:
          </span>
          <span className="truncate text-red-800">
            {language === 'bn' ? activeAlert.messageBn : activeAlert.messageEn}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss alert"
            className="p-1 hover:bg-red-200/50 rounded-md text-red-800 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
