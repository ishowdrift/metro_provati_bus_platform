'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_BUSES } from '@/data/mockData';
import { toBengaliDigits } from '@/lib/fareCalculator';
import {
  Navigation,
  Compass,
  Battery,
  Wifi,
  WifiOff,
  ShieldCheck,
  AlertTriangle,
  Play,
  Square,
  Smartphone,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function DriverDashboardPage() {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [selectedBusId, setSelectedBusId] = useState('bus-mp-101');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{
    lat: number;
    lng: number;
    speed: number;
    heading: number;
  } | null>(null);
  const [pingCount, setPingCount] = useState(0);
  const [lastPingTime, setLastPingTime] = useState<string>('');
  const [batteryLevel, setBatteryLevel] = useState<number>(90);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>('জিপিএস সম্প্রচার বন্ধ রয়েছে');

  const watchIdRef = useRef<number | null>(null);
  const activeBus = INITIAL_BUSES.find((b) => b.id === selectedBusId) || INITIAL_BUSES[0];

  // Battery & network listeners
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Battery API if supported
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const sendPingToServer = async (lat: number, lng: number, speedKmh: number, heading: number) => {
    try {
      const res = await fetch('/api/tracking/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId: selectedBusId,
          lat,
          lng,
          speedKmh,
          heading,
          batteryLevel,
          networkStatus: isOnline ? 'online' : 'offline',
          dutyStatus: 'on_duty',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPingCount((prev) => prev + 1);
        setLastPingTime(new Date().toLocaleTimeString());
        setStatusMessage('টেলিমেট্রি সফলভাবে পাঠানো হয়েছে (সক্রিয় জিপিএস)');
      } else {
        setStatusMessage(data.error || 'পিংক গ্রহণে ব্যর্থতা');
      }
    } catch {
      setStatusMessage('সার্ভারে পিং পাঠাতে নেটওয়ার্ক সমস্যা');
    }
  };

  const handleStartBroadcasting = () => {
    if (!navigator.geolocation) {
      alert('আপনার ব্রাউজারে Geolocation সমর্থিত নয়');
      return;
    }

    setIsBroadcasting(true);
    setStatusMessage('স্যাটেলাইট স্থানাঙ্ক অনুসন্ধান করা হচ্ছে...');

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const speedKmh = pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 25;
        const heading = pos.coords.heading || 180;

        setCurrentCoords({ lat, lng, speed: speedKmh, heading });
        sendPingToServer(lat, lng, speedKmh, heading);
      },
      (err) => {
        // Fallback for desktop demo if user denies GPS permission or device has no GPS fix:
        // Use realistic initial bus coordinates so demo testing still updates ping telemetry
        const fallbackLat = activeBus.currentLat;
        const fallbackLng = activeBus.currentLng;
        setCurrentCoords({ lat: fallbackLat, lng: fallbackLng, speed: 28, heading: 195 });
        sendPingToServer(fallbackLat, fallbackLng, 28, 195);
        setStatusMessage('ডেমো মোড: প্রাথমিক স্থানাঙ্ক সম্প্রচারিত হচ্ছে');
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );
  };

  const handleStopBroadcasting = async () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setIsBroadcasting(false);
    setStatusMessage('জিপিএস সম্প্রচার বন্ধ করা হয়েছে (অফ-ডিউটি)');

    // Notify server of off-duty
    try {
      await fetch('/api/tracking/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId: selectedBusId,
          dutyStatus: 'idle',
        }),
      });
    } catch {
      // Ignore
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Driver Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-red-600/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 text-white border border-white/30 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Navigation className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30">
              <span
                className={`w-2 h-2 rounded-full ${
                  isBroadcasting ? 'bg-white animate-pulse' : 'bg-red-200'
                }`}
              />
              <span>চালক জিপিএস টেলিমেট্রি পোর্টাল</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              {activeBus.registrationNumberBn}
            </h1>
            <p className="text-xs text-red-100">
              চালক: <strong>{user?.name || 'মো. রফিকুল ইসলাম'}</strong> • মডেল: {activeBus.modelBn}
            </p>
          </div>
        </div>

        <select
          value={selectedBusId}
          disabled={isBroadcasting}
          onChange={(e) => setSelectedBusId(e.target.value)}
          className="px-3 py-2 bg-red-800/80 border border-red-400 rounded-xl text-xs font-semibold text-white focus:outline-none"
        >
          {INITIAL_BUSES.map((b) => (
            <option key={b.id} value={b.id} className="bg-slate-900 text-white">
              {b.registrationNumberBn}
            </option>
          ))}
        </select>
      </div>

      {/* Main Broadcast Control Center */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-red-100 shadow-md space-y-8 text-center">
        <div className="max-w-md mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            টেলিমিতি ব্রডকাস্ট স্ট্যাটাস
          </span>
          <div className="text-sm font-semibold text-red-950 bg-red-50/50 border border-red-100 rounded-xl py-2 px-4">
            {statusMessage}
          </div>
        </div>

        {/* Start / Stop Toggle Button */}
        <div>
          {!isBroadcasting ? (
            <button
              onClick={handleStartBroadcasting}
              className="px-8 py-5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-lg rounded-3xl shadow-xl shadow-red-600/30 hover:shadow-2xl transition-all duration-200 inline-flex items-center gap-3 border-4 border-red-200"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>ডিউটি শুরু করুন ও জিপিএস শেয়ারিং চালু করুন</span>
            </button>
          ) : (
            <button
              onClick={handleStopBroadcasting}
              className="px-8 py-5 bg-neutral-900 hover:bg-black active:scale-95 text-white font-extrabold text-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-200 inline-flex items-center gap-3 border-4 border-neutral-200"
            >
              <Square className="w-6 h-6 fill-current" />
              <span>ডিউটি সমাপ্ত ও জিপিএস বন্ধ করুন</span>
            </button>
          )}
        </div>

        {/* Telemetry Readout Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-red-100 text-left">
          <div className="p-4 rounded-2xl bg-white border border-red-100 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold">সম্প্রচারিত পিং সংখ্যা</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
              {toBengaliDigits(pingCount)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {lastPingTime ? `শেষ: ${lastPingTime}` : 'অপেক্ষমাণ'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-red-100 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold">লাইভ গতি (স্পিডোমিটার)</span>
            <div className="text-2xl font-black text-red-600 font-mono mt-0.5">
              {toBengaliDigits(currentCoords?.speed || 0)} কিমি/ঘন্টা
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              হেডিং: {toBengaliDigits(currentCoords?.heading || 0)}°
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-red-100 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold">ডিভাইস ব্যাটারি লেভেল</span>
            <div className="text-2xl font-black text-slate-800 font-mono mt-0.5 flex items-center gap-1.5">
              <Battery className="w-5 h-5 text-red-600" />
              <span>{toBengaliDigits(batteryLevel)}%</span>
            </div>
            <div className="text-[11px] text-red-700 font-medium mt-1">চার্জ সন্তোষজনক</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-red-100 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold">ইন্টারনেট সংযোগ</span>
            <div className="text-xl font-black font-mono mt-1 flex items-center gap-1.5">
              {isOnline ? (
                <>
                  <Wifi className="w-5 h-5 text-red-600" />
                  <span className="text-red-700">ONLINE</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 text-slate-500" />
                  <span className="text-slate-600">OFFLINE</span>
                </>
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">সেলুলার ৪জি ডাটা</div>
          </div>
        </div>
      </div>

      {/* Driver Privacy & PWA Background Architecture Disclosure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-red-600 text-white shadow-md shadow-red-600/10 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Lock className="w-4 h-4" />
            <span>চালকের গোপনীয়তা ও ফোন নম্বর সুরক্ষা</span>
          </div>
          <p className="text-xs text-red-100 leading-relaxed">
            মেট্রো প্রভাতী নীতি অনুসারে চালকের ব্যক্তিগত মোবাইল নম্বর জনসম্মুখে উন্মুক্ত করা হয় না। যাত্রী কেবল নির্ধারিত কাউন্টার বা ফিল্ড সুপারভাইজারের সাথে যোগাযোগ করতে পারেন। অফ-ডিউটি অবস্থায় জিপিএস ট্র্যাকিং স্বয়ংক্রিয়ভাবে নিষ্ক্রিয় থাকে।
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-red-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Smartphone className="w-4 h-4 text-red-600" />
            <span>মোবাইল ব্রাউজার ব্যাকগ্রাউন্ড ট্র্যাকিং সতর্কতা</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            মোবাইল ওয়েব ব্রাউজারের পাওয়ার সেভার বিধিমালার কারণে স্ক্রিন লক বা অন্য অ্যাপে গেলে ট্র্যাকিং সাময়িক বিরতি নিতে পারে। সার্বক্ষণিক নিরবচ্ছিন্ন ট্র্যাকিং নিশ্চিত করতে স্ক্রিন অন রাখুন অথবা হোমস্ক্রিনে অ্যাপটি PWA হিসেবে যুক্ত করুন।
          </p>
        </div>
      </div>
    </div>
  );
}
