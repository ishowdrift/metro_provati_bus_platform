'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { INITIAL_BUSES, INITIAL_STOPS } from '@/data/mockData';
import { Bus } from '@/types';
import { toBengaliDigits } from '@/lib/fareCalculator';
import {
  Users,
  Bus as BusIcon,
  AlertTriangle,
  Phone,
  ShieldCheck,
  Compass,
  Battery,
  Wifi,
  Plus,
  Minus,
  CheckCircle2,
  RefreshCw,
  Radio,
  MapPin,
  Play,
  Pause,
  SkipForward,
} from 'lucide-react';

// Official Chattogram Metro Corridor Stops Waypoints
const CORRIDOR_WAYPOINTS = [
  { id: 'stop-1', nameBn: 'কাপ্তাই রাস্তার মাথা', lat: 22.3985, lng: 91.8682 },
  { id: 'stop-2', nameBn: 'বহদ্দারহাট', lat: 22.3688, lng: 91.8436 },
  { id: 'stop-3', nameBn: 'মুরাদপুর', lat: 22.3634, lng: 91.8262 },
  { id: 'stop-11', nameBn: '২ নম্বর গেট', lat: 22.3606, lng: 91.8236 },
  { id: 'stop-4', nameBn: 'জিইসি মোড়', lat: 22.3582, lng: 91.8211 },
  { id: 'stop-5', nameBn: 'ওয়াসা মোড়', lat: 22.3512, lng: 91.8228 },
  { id: 'stop-6', nameBn: 'দেওয়ানহাট', lat: 22.3375, lng: 91.8155 },
  { id: 'stop-12', nameBn: 'চৌমুহনী', lat: 22.3325, lng: 91.8135 },
  { id: 'stop-7', nameBn: 'আগ্রাবাদ বাদামতলী', lat: 22.3275, lng: 91.8122 },
  { id: 'stop-8', nameBn: 'সল্টগোলা ক্রসিং', lat: 22.2890, lng: 91.8020 },
  { id: 'stop-9', nameBn: 'ইপিজেড (সিইপিজেড)', lat: 22.2815, lng: 91.7965 },
  { id: 'stop-10', nameBn: 'কাঠগড় (মাস্টার টার্মিনাল)', lat: 22.2601, lng: 91.7921 },
];

export default function SupervisorDashboardPage() {
  const { user, role } = useAuth();
  const { language } = useLanguage();

  const [buses, setBuses] = useState<Bus[]>(INITIAL_BUSES);
  const [selectedBusId, setSelectedBusId] = useState<string>('bus-mp-101');
  const [incidentTitle, setIncidentTitle] = useState('');
  const [incidentDesc, setIncidentDesc] = useState('');
  const [incidentCategory, setIncidentCategory] = useState<
    'overcrowding' | 'delay' | 'driver_behavior' | 'lost_item' | 'other'
  >('overcrowding');
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);

  // Live GPS Location Broadcasting State
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(true);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState<number>(3); // Default at GEC Mor
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: 22.3582,
    lng: 91.8211,
  });
  const [currentSpeed, setCurrentSpeed] = useState<number>(32);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('সক্রিয় হচ্ছে...');
  const [syncSuccessCount, setSyncSuccessCount] = useState<number>(0);
  const [isDeviceGps, setIsDeviceGps] = useState<boolean>(false);
  const [pingStatus, setPingStatus] = useState<'idle' | 'pinging' | 'synced' | 'error'>('synced');

  // Broadcast location ping function
  const sendLocationPing = useCallback(
    async (lat: number, lng: number, speed: number) => {
      setPingStatus('pinging');
      try {
        const res = await fetch('/api/tracking/ping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            busId: selectedBusId,
            lat,
            lng,
            speedKmh: speed,
            heading: 180,
            batteryLevel: 94,
            networkStatus: 'online',
            dutyStatus: 'on_duty',
          }),
        });

        if (res.ok) {
          setLastSyncedTime(new Date().toLocaleTimeString('bn-BD'));
          setSyncSuccessCount((prev) => prev + 1);
          setPingStatus('synced');
        } else {
          setPingStatus('error');
        }
      } catch {
        setPingStatus('error');
      }
    },
    [selectedBusId]
  );

  // Corridor waypoint step advancement
  const advanceCorridorStep = useCallback(() => {
    setCurrentWaypointIndex((prev) => {
      const nextIdx = (prev + 1) % CORRIDOR_WAYPOINTS.length;
      const wp = CORRIDOR_WAYPOINTS[nextIdx];
      setCurrentCoords({ lat: wp.lat, lng: wp.lng });
      // Random realistic speed between 25 and 38 km/h
      const nextSpeed = Math.floor(25 + Math.random() * 14);
      setCurrentSpeed(nextSpeed);
      sendLocationPing(wp.lat, wp.lng, nextSpeed);
      return nextIdx;
    });
  }, [sendLocationPing]);

  // Toggle Live Location Broadcasting & sync status with server
  const handleToggleBroadcasting = async () => {
    const nextState = !isBroadcasting;
    setIsBroadcasting(nextState);

    try {
      await fetch('/api/tracking/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId: selectedBusId,
          lat: currentCoords.lat,
          lng: currentCoords.lng,
          speedKmh: nextState ? currentSpeed : 0,
          heading: 180,
          batteryLevel: 94,
          networkStatus: 'online',
          dutyStatus: nextState ? 'on_duty' : 'idle',
          isLiveSharing: nextState,
        }),
      });
      setLastSyncedTime(new Date().toLocaleTimeString('bn-BD'));
      setSyncSuccessCount((prev) => prev + 1);
    } catch {
      // Ignore
    }
  };

  // Auto-start GPS sharing when supervisor logs in
  useEffect(() => {
    // 1. Try native device geolocation if in Chattogram
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, speed } = pos.coords;
          // Check if coordinates fall within Chattogram geofence
          if (
            latitude >= 22.15 &&
            latitude <= 22.55 &&
            longitude >= 91.65 &&
            longitude <= 92.05
          ) {
            setCurrentCoords({ lat: latitude, lng: longitude });
            setIsDeviceGps(true);
            if (speed) setCurrentSpeed(Math.round(speed * 3.6));
            sendLocationPing(latitude, longitude, speed ? Math.round(speed * 3.6) : 30);
          }
        },
        () => {
          // If permission denied or unavailable, use corridor waypoint progression
          setIsDeviceGps(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }

    // 2. Continuous real-time ping loop every 6 seconds
    const interval = setInterval(() => {
      if (!isBroadcasting) return;

      if (isDeviceGps && typeof window !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude, speed } = pos.coords;
            if (
              latitude >= 22.15 &&
              latitude <= 22.55 &&
              longitude >= 91.65 &&
              longitude <= 92.05
            ) {
              setCurrentCoords({ lat: latitude, lng: longitude });
              const spd = speed ? Math.round(speed * 3.6) : 28;
              setCurrentSpeed(spd);
              sendLocationPing(latitude, longitude, spd);
            } else {
              // Out of bounds fallback
              advanceCorridorStep();
            }
          },
          () => advanceCorridorStep(),
          { enableHighAccuracy: true, timeout: 4000 }
        );
      } else {
        advanceCorridorStep();
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isBroadcasting, isDeviceGps, sendLocationPing, advanceCorridorStep]);

  const currentWaypoint = CORRIDOR_WAYPOINTS[currentWaypointIndex];

  // Route Guard: Only supervisors/operations admins can access
  if (role !== 'bus_supervisor' && role !== 'operations_admin' && role !== 'super_admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-red-100 p-6 sm:p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {language === 'bn' ? 'সংরক্ষিত সুপারভাইজার কনসোল' : 'Restricted Supervisor Portal'}
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {language === 'bn'
                ? 'এই ড্যাশবোর্ডটি শুধুমাত্র দায়িত্বপ্রাপ্ত বাস সুপারভাইজারদের জন্য সংরক্ষিত। সাধারণ যাত্রী অ্যাকাউন্টের মাধ্যমে এটি উন্মুক্ত নয়।'
                : 'This console is exclusively for authorized bus supervisors. Passenger accounts do not have access.'}
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <Link
              href="/login"
              className="block w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition"
            >
              {language === 'bn' ? 'সুপারভাইজার হিসেবে লগইন করুন' : 'Login as Supervisor'}
            </Link>
            <Link
              href="/"
              className="block w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition"
            >
              {language === 'bn' ? 'যাত্রী হোমে ফিরে যান' : 'Return to Home'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activeBus = buses.find((b) => b.id === selectedBusId) || buses[0];

  const handleStandingUpdate = (delta: number) => {
    const current = activeBus.standingCapacity.reservedCount;
    const max = activeBus.standingCapacity.approvedCapacity;
    const nextCount = Math.max(0, Math.min(max, current + delta));

    setBuses((prev) =>
      prev.map((b) => {
        if (b.id === activeBus.id) {
          return {
            ...b,
            standingCapacity: {
              ...b.standingCapacity,
              reservedCount: nextCount,
            },
          };
        }
        return b;
      })
    );
  };

  const handleReportIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentTitle || !incidentDesc) return;

    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: incidentCategory,
          title: incidentTitle,
          description: incidentDesc,
          busNumber: activeBus.registrationNumberBn,
          contactPhone: user?.phone || '01712000001',
        }),
      });

      if (res.ok) {
        setReportSuccess('জরুরি রিপোর্ট বা অনুসন্ধান সফলভাবে পাঠানো হয়েছে!');
        setIncidentTitle('');
        setIncidentDesc('');
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-600 via-red-600 to-red-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 text-white border border-white/30 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>অন-বোর্ড সুপারভাইজার কনসোল</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              {activeBus.registrationNumberBn} ({activeBus.modelBn})
            </h1>
            <p className="text-xs text-red-100 mt-0.5">
              সুপারভাইজার: <strong>{user?.name || 'মো. হাবিবুর রহমান'}</strong> • রুট:{' '}
              {activeBus.direction === 'kaptai_to_patenga' ? 'কাঠগড় অভিমুখী' : 'কাপ্তাই অভিমুখী'}
            </p>
          </div>
        </div>

        {/* Bus switcher & driver call */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedBusId}
            onChange={(e) => setSelectedBusId(e.target.value)}
            className="px-3.5 py-2.5 bg-red-800/90 border border-red-400 rounded-xl text-xs font-bold text-white focus:outline-none"
          >
            {buses.map((b) => (
              <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                {b.registrationNumberBn} ({b.modelBn})
              </option>
            ))}
          </select>

          {activeBus.driverPhone && (
            <a
              href={`tel:${activeBus.driverPhone}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-red-50 text-red-700 rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>চালককে কল করুন</span>
            </a>
          )}
        </div>
      </div>

      {/* 🔴 LIVE GPS LOCATION BROADCASTING RADAR PANEL */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-red-500 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-48 h-48 bg-red-50 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-3.5">
            <div className="relative mt-1">
              <span className="flex h-5 w-5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isBroadcasting ? 'bg-red-500' : 'bg-slate-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-5 w-5 ${
                    isBroadcasting ? 'bg-red-600' : 'bg-slate-500'
                  }`}
                />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  লাইভ জিপিএস লোকেশন শেয়ারিং
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isBroadcasting
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {isBroadcasting ? '🟢 ব্রডকাস্টিং সক্রিয় (Live GPS)' : '⏱️ সর্বশেষ অবস্থান সংরক্ষিত (জিপিএস বন্ধ)'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-red-50 text-red-700 border border-red-200">
                  {isDeviceGps ? 'মোবাইল GPS সেন্সর' : 'করিডোর অটো-সিঙ্ক'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {isBroadcasting ? (
                  <>
                    🟢 <strong>লাইভ জিপিএস সক্রিয়:</strong> আপনার বাসের রিয়েল-টাইম অবস্থান ও গতি সার্ভারে ব্রডকাস্ট হচ্ছে।{' '}
                    <strong>কাউন্টার প্রতিনিধি</strong> এবং <strong>যাত্রীরা লাইভ ট্র্যাকিং ম্যাপে</strong> এই বাসটি চলমান দেখতে পাচ্ছেন।
                  </>
                ) : (
                  <>
                    🛡️ <strong>স্বচ্ছতা ও যাত্রী আস্থা:</strong> আপনি বর্তমানে লাইভ জিপিএস বন্ধ রেখেছেন। যাত্রীরা যাতে বিভ্রান্ত না হন এবং আস্থাশীল থাকেন, সেজন্য ম্যাপে বাসটিকে গায়েব না করে{' '}
                    <strong>সর্বশেষ জ্ঞাত অবস্থান: {currentWaypoint?.nameBn || 'জিইসি মোড়'}</strong> প্রদর্শিত হচ্ছে।
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Quick GPS Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                sendLocationPing(currentCoords.lat, currentCoords.lng, currentSpeed);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-xl text-xs font-bold transition active:scale-95"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${pingStatus === 'pinging' ? 'animate-spin' : ''}`}
              />
              <span>এখনই পিং পাঠান</span>
            </button>

            <button
              onClick={advanceCorridorStep}
              title="পরবর্তী স্টপেজে মুভ করুন"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition active:scale-95"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>পরবর্তী স্টপ</span>
            </button>

            <button
              onClick={handleToggleBroadcasting}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white transition active:scale-95 shadow-xs ${
                isBroadcasting
                  ? 'bg-slate-800 hover:bg-slate-900'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isBroadcasting ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>জিপিএস বন্ধ করুন</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>লাইভ জিপিএস চালু করুন</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live GPS Telemetry Dashboard Values */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-red-50/70 border border-red-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              <span>বর্তমান নিকটবর্তী স্টপ</span>
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 mt-1 truncate">
              {currentWaypoint?.nameBn || 'জিইসি মোড়'}
            </div>
            <span className="text-[11px] text-red-700 font-mono mt-0.5 block">
              {currentCoords.lat.toFixed(4)}° N, {currentCoords.lng.toFixed(4)}° E
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Compass className="w-3.5 h-3.5 text-red-600" />
              <span>চলমান গতিবেগ</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-1">
              {toBengaliDigits(currentSpeed)} <span className="text-sm font-sans font-bold">কিমি/ঘ</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
              ● মসৃণ গতিতে চলমান
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Radio className="w-3.5 h-3.5 text-red-600" />
              <span>শেষ সার্ভার সিঙ্ক</span>
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 font-mono mt-1">
              {lastSyncedTime}
            </div>
            <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
              মোট সিঙ্ক: {toBengaliDigits(syncSuccessCount)} বার
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Wifi className="w-3.5 h-3.5 text-red-600" />
              <span>কাউন্টার ও যাত্রী সংযোগ</span>
            </div>
            <div className="text-base sm:text-lg font-black text-emerald-700 mt-1">
              সক্রিয় সংযোগ
            </div>
            <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
              কাউন্টার ও অ্যাপে লাইভ
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Occupancy & Seat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-red-100 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">সিটে বসা যাত্রী</span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
            {toBengaliDigits(32)} / {toBengaliDigits(activeBus.seatCount)}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            ৪টি আসন ফাঁকা রয়েছে
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-red-100 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">অনুমোদিত স্ট্যান্ডিং যাত্রী</span>
          <div className="text-2xl font-black text-red-600 font-mono mt-0.5">
            {toBengaliDigits(activeBus.standingCapacity.reservedCount)} /{' '}
            {toBengaliDigits(activeBus.standingCapacity.approvedCapacity)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">সর্বোচ্চ সীমা ১৫ জন</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-red-100 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">অন-বোর্ড টিকিট চেকার</span>
          <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
            {toBengaliDigits(32)} টি বৈধ
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            কাউন্টার ভেরিফাইড
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-red-100 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">ডিভাইস ব্যাটারি ও নেটওয়ার্ক</span>
          <div className="text-2xl font-black text-slate-800 font-mono mt-0.5 flex items-center gap-1.5">
            <Battery className="w-5 h-5 text-emerald-600" />
            <span>{toBengaliDigits(activeBus.batteryLevel || 94)}%</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            4G LTE হাই-স্পিড সংযোগ
          </div>
        </div>
      </div>

      {/* Interactive Controls & Incident Reporting */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Standing Capacity Interactive Counter */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-red-100">
            <h3 className="font-extrabold text-slate-900 text-lg">
              অন-বোর্ড স্ট্যান্ডিং যাত্রী হালনাগাদ
            </h3>
            <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
              অনুমোদিত সীমা: ১৫ জন
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-red-50/50 border border-red-100 text-center space-y-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              বর্তমান স্ট্যান্ডিং যাত্রী সংখ্যা
            </div>
            <div className="text-5xl font-black text-slate-900 font-mono">
              {toBengaliDigits(activeBus.standingCapacity.reservedCount)}
            </div>
            <div className="text-xs text-slate-500">
              অবশিষ্ট অনুমোদিত স্পেস:{' '}
              <strong className="font-mono text-red-600">
                {toBengaliDigits(
                  Math.max(
                    0,
                    activeBus.standingCapacity.approvedCapacity -
                      activeBus.standingCapacity.reservedCount
                  )
                )}
              </strong>{' '}
              জন
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => handleStandingUpdate(-1)}
                disabled={activeBus.standingCapacity.reservedCount <= 0}
                className="w-14 h-14 rounded-2xl bg-white border-2 border-red-200 hover:bg-red-50 disabled:opacity-40 text-slate-900 font-bold text-2xl shadow-sm flex items-center justify-center transition active:scale-95"
              >
                <Minus className="w-6 h-6" />
              </button>

              <button
                onClick={() => handleStandingUpdate(1)}
                disabled={
                  activeBus.standingCapacity.reservedCount >=
                  activeBus.standingCapacity.approvedCapacity
                }
                className="w-14 h-14 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-bold text-2xl shadow-md flex items-center justify-center transition active:scale-95"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Emergency Incident Alert Box */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-red-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="font-extrabold text-slate-900 text-lg">
                জরুরি ঘটনা / ট্রাফিক রিপোর্ট
              </h3>
            </div>
            <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
              তাৎক্ষণিক
            </span>
          </div>

          {reportSuccess && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{reportSuccess}</span>
            </div>
          )}

          <form onSubmit={handleReportIncident} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                ঘটনার ধরন
              </label>
              <select
                value={incidentCategory}
                onChange={(e) => setIncidentCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-red-50/30 border border-red-100 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="overcrowding">যাত্রী অতিরিক্ত চাপ / ওভারক্রাউডিং</option>
                <option value="delay">যানজট ও বিলম্বিত চলাচল</option>
                <option value="driver_behavior">চালক / স্টাফ সংশ্লিষ্ট ইস্যু</option>
                <option value="lost_item">যাত্রীর ফেলে যাওয়া মালামাল</option>
                <option value="other">অন্যান্য অনাকাঙ্ক্ষিত ঘটনা</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                শিরোনাম
              </label>
              <input
                type="text"
                required
                placeholder="যেমন: আগ্রাবাদ মোড়ে তীব্র যানজট"
                value={incidentTitle}
                onChange={(e) => setIncidentTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-red-50/30 border border-red-100 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                বিস্তারিত বিবরণ
              </label>
              <textarea
                required
                rows={3}
                placeholder="ঘটনার সুনির্দিষ্ট স্থান ও বর্তমান পরিস্থিতি লিখুন..."
                value={incidentDesc}
                onChange={(e) => setIncidentDesc(e.target.value)}
                className="w-full px-3.5 py-2 bg-red-50/30 border border-red-100 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition shadow-md shadow-red-600/20"
            >
              সুপার অ্যাডমিন ও কন্ট্রোল রুমে প্রেরণ করুন
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
