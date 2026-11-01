'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  bn: {
    // Brand & Navigation
    'brand.name': 'মেট্রো প্রভাতী',
    'brand.tagline': 'চট্টগ্রামের আধুনিক ডিজিটাল বাস সার্ভিস',
    'brand.sub': 'কাপ্তাই রাস্তার মাথা ↔ কাঠগড়',
    'nav.home': 'হোম',
    'nav.routes': 'রুট ও স্টপ',
    'nav.counters': 'কাউন্টার',
    'nav.fares': 'ভাড়া তালিকা',
    'nav.tracking': 'বাস ট্র্যাকিং',
    'nav.tickets': 'আমার টিকিট',
    'nav.contact': 'যোগাযোগ',
    'nav.login': 'লগইন',
    'nav.signup': 'রেজিস্ট্রেশন',
    'nav.profile': 'প্রোফাইল',
    'nav.admin': 'অ্যাডমিন প্যানেল',
    'nav.driver': 'ড্রাইভার পোর্টাল',
    'nav.supervisor': 'সুপারভাইজার',
    'nav.counterStaff': 'কাউন্টার প্রতিনিধি',
    'nav.emergencyCall': 'জরুরি কল',
    'nav.helpline': 'হেল্পলাইন',

    // Hero Section
    'hero.badge': 'চট্টগ্রামের প্রথম প্রিমিয়াম ডিজিটাল বাস নেটওয়ার্ক',
    'hero.title': 'চট্টগ্রামের পথে, আপনার যাত্রা আরও সহজ।',
    'hero.subtitle':
      'কাপ্তাই রাস্তার মাথা থেকে কাঠগড়— রিয়েল-টাইম জিপিএস ট্র্যাকিং, আসন বুকিং, কাউন্টার ডিরেক্টরি এবং স্বচ্ছ ভাড়ায় নিরাপদ যাত্রা।',
    'hero.cta.book': 'আসন বুক করুন',
    'hero.cta.track': 'লাইভ বাস ট্র্যাক করুন',
    'hero.cta.fares': 'ভাড়া জানুন',
    'hero.stat.fleet': '৪+ রুট বাস',
    'hero.stat.stops': '১২টি প্রধান স্টপ',
    'hero.stat.routeLength': '২৫ কিমি করিডোর',
    'hero.stat.fareRange': '৳১৫ — ৳৬৫ খসড়া',

    // Route Search Card
    'search.title': 'ভাড়া ও রুট অনুসন্ধান',
    'search.from': 'যাত্রা শুরুর কাউন্টার / স্টপ',
    'search.to': 'গন্তব্য কাউন্টার / স্টপ',
    'search.selectFrom': 'স্টপেজ নির্বাচন করুন',
    'search.selectTo': 'গন্তব্য নির্বাচন করুন',
    'search.btn': 'ভাড়া ও সময় দেখুন',
    'search.resultTitle': 'অনুসন্ধান ফলাফল',
    'search.approxFare': 'আনুমানিক ভাড়া:',
    'search.distance': 'দূরত্ব:',
    'search.stages': 'পর্যায়:',
    'search.bookNow': 'আসন নির্বাচন করুন',
    'search.disclaimer': 'উক্ত ভাড়া খসড়া নির্দেশক; কাউন্টার ভিত্তিক অনুমোদিত তালিকা চূড়ান্ত।',

    // Live Tracking
    'tracking.title': 'রিয়েল-টাইম বাস ট্র্যাকিং',
    'tracking.subtitle': 'অপারেটর জিপিএস সংযোগ থেকে সরাসরি আপডেট। কোনো কৃত্রিম বা ভুয়া লোকেশন দেখানো হয় না।',
    'tracking.active': 'সক্রিয় জিপিএস',
    'tracking.stale': 'পুরাতন ডাটা (৩-১০ মিনিট)',
    'tracking.unavailable': 'জিপিএস সংযোগ বিচ্ছিন্ন',
    'tracking.busNumber': 'বাস নম্বর',
    'tracking.speed': 'গতি',
    'tracking.heading': 'দিক',
    'tracking.direction': 'গন্তব্য অভিমুখ',
    'tracking.lastUpdate': 'সর্বশেষ আপডেট',
    'tracking.supervisor': 'সুপারভাইজার',
    'tracking.driver': 'চালক',
    'tracking.locateMe': 'আমার বর্তমান অবস্থান',
    'tracking.fitRoute': 'সম্পূর্ণ রুট দেখুন',
    'tracking.refresh': 'রিফ্রেশ',
    'tracking.listView': 'তালিকা ভিউ',
    'tracking.mapView': 'ম্যাপ ভিউ',

    // Seat Booking
    'seats.title': 'আসন ও স্ট্যান্ডিং স্পেস নির্বাচন',
    'seats.busHeading': 'বাসের আসন বিন্যাস (৩৮ আসন + ১৫ স্ট্যান্ডিং)',
    'seats.driverCabin': 'চালকের কেবিন ও প্রবেশপথ',
    'seats.legendAvailable': 'উপলব্ধ',
    'seats.legendHeld': 'হোল্ডকৃত (৫ মি.)',
    'seats.legendBooked': 'বুক করা',
    'seats.legendSelected': 'আপনার নির্বাচন',
    'seats.standingLabel': 'অনুমোদিত স্ট্যান্ডিং স্পেস',
    'seats.standingDesc': 'পিক আওয়ারে অনুমোদিত স্ট্যান্ডিং স্পেস গ্রহণ করুন',
    'seats.holdWarning': 'নির্বাচিত আসন ৫ মিনিটের জন্য আপনার ব্রাউজারে সংরক্ষিত থাকবে।',
    'seats.proceedCheckout': 'পেমেন্ট ও টিকিটে যান',

    // Common labels
    'common.bdt': 'টাকা',
    'common.km': 'কিমি',
    'common.min': 'মিনিট',
    'common.live': 'লাইভ',
    'common.loading': 'লোড হচ্ছে...',
    'common.error': 'ত্রুটি ঘটেছে',
    'common.close': 'বন্ধ করুন',
    'common.confirm': 'নিশ্চিত করুন',
    'common.cancel': 'বাতিল করুন',
    'common.back': 'ফিরে যান',
    'common.details': 'বিস্তারিত',
  },
  en: {
    // Brand & Navigation
    'brand.name': 'Metro Probati',
    'brand.tagline': 'Modern Digital Bus Transit for Chattogram',
    'brand.sub': 'Kaptai Rastar Matha ↔ Katgor',
    'nav.home': 'Home',
    'nav.routes': 'Routes & Stops',
    'nav.counters': 'Counters',
    'nav.fares': 'Fares',
    'nav.tracking': 'Live Bus Tracking',
    'nav.tickets': 'My Tickets',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin Panel',
    'nav.driver': 'Driver Portal',
    'nav.supervisor': 'Supervisor',
    'nav.counterStaff': 'Counter Staff',
    'nav.emergencyCall': 'Emergency Call',
    'nav.helpline': 'Helpline',

    // Hero Section
    'hero.badge': "Chattogram's Premier Digital Transit Network",
    'hero.title': 'Your Journey Across Chattogram, Made Easier.',
    'hero.subtitle':
      'From Kaptai Rastar Matha to Katgor — Real-time GPS tracking, seat reservations, counter directory, and transparent fares for a safe commute.',
    'hero.cta.book': 'Book a Seat',
    'hero.cta.track': 'Track Live Bus',
    'hero.cta.fares': 'Check Fares',
    'hero.stat.fleet': '4+ Active Buses',
    'hero.stat.stops': '12 Key Stops',
    'hero.stat.routeLength': '25 KM Corridor',
    'hero.stat.fareRange': '৳15 — ৳65 Draft',

    // Route Search Card
    'search.title': 'Fare & Route Finder',
    'search.from': 'Origin Stop / Counter',
    'search.to': 'Destination Stop / Counter',
    'search.selectFrom': 'Select origin stop',
    'search.selectTo': 'Select destination',
    'search.btn': 'Check Fares & Stages',
    'search.resultTitle': 'Search Result',
    'search.approxFare': 'Estimated Fare:',
    'search.distance': 'Distance:',
    'search.stages': 'Stages:',
    'search.bookNow': 'Select Seats',
    'search.disclaimer': 'Fares are indicative drafts pending official operator ratification.',

    // Live Tracking
    'tracking.title': 'Real-Time Bus Tracking',
    'tracking.subtitle': 'Direct telemetry from active driver devices. No fake or simulated GPS data.',
    'tracking.active': 'Active GPS',
    'tracking.stale': 'Stale Data (3-10m)',
    'tracking.unavailable': 'GPS Offline',
    'tracking.busNumber': 'Bus Reg',
    'tracking.speed': 'Speed',
    'tracking.heading': 'Heading',
    'tracking.direction': 'Heading To',
    'tracking.lastUpdate': 'Last Update',
    'tracking.supervisor': 'Supervisor',
    'tracking.driver': 'Driver',
    'tracking.locateMe': 'Locate Me',
    'tracking.fitRoute': 'Fit to Route',
    'tracking.refresh': 'Refresh',
    'tracking.listView': 'List View',
    'tracking.mapView': 'Map View',

    // Seat Booking
    'seats.title': 'Seat & Standing Space Selection',
    'seats.busHeading': 'Bus Layout (38 Seats + 15 Standing Capacity)',
    'seats.driverCabin': "Driver's Cabin & Entrance",
    'seats.legendAvailable': 'Available',
    'seats.legendHeld': 'Held (5m)',
    'seats.legendBooked': 'Booked',
    'seats.legendSelected': 'Your Selection',
    'seats.standingLabel': 'Authorized Standing Space',
    'seats.standingDesc': 'Opt for authorized standing capacity during peak hours',
    'seats.holdWarning': 'Selected seats are temporarily held in your session for 5 minutes.',
    'seats.proceedCheckout': 'Proceed to Checkout',

    // Common labels
    'common.bdt': 'BDT',
    'common.km': 'KM',
    'common.min': 'mins',
    'common.live': 'LIVE',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
    'common.back': 'Back',
    'common.details': 'Details',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'bn',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('bn');

  useEffect(() => {
    const saved = localStorage.getItem('metro_probati_lang') as Language;
    if (saved && (saved === 'bn' || saved === 'en')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('metro_probati_lang', lang);
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'bn' ? 'en' : 'bn';
    setLanguage(nextLang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
