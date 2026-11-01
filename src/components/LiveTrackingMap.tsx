'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bus, RouteStop } from '@/types';
import { INITIAL_STOPS } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';
import { toBengaliDigits, formatTimeAgoBn, formatTimeAgoEn } from '@/lib/fareCalculator';
import {
  Navigation,
  RefreshCw,
  MapPin,
  Compass,
  Phone,
  ShieldAlert,
  List,
  Map as MapIcon,
  Crosshair,
  AlertCircle,
  Clock,
  ExternalLink,
  Star,
  Maximize2,
  Bus as BusIcon,
  Info,
  Copy,
  Check,
  Share2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface LiveTrackingMapProps {
  selectedBusId?: string;
  onSelectBus?: (bus: Bus) => void;
}

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  selectedBusId,
  onSelectBus,
}) => {
  const { language } = useLanguage();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [activeBus, setActiveBus] = useState<Bus | null>(null);
  // View mode: 'google' (Official Google Maps embed route), 'radar' (interactive live telemetry), 'list'
  const [viewMode, setViewMode] = useState<'google' | 'radar' | 'list'>('google');
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  // Collapsible state for Google Maps live route info overlay card (minimizes on map tap for mobile)
  const [isCardMinimized, setIsCardMinimized] = useState(false);

  // Minimize the live route overlay card when user taps / clicks inside the Google Maps iframe
  useEffect(() => {
    const handleWindowBlur = () => {
      if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
        setIsCardMinimized(true);
      }
    };
    window.addEventListener('blur', handleWindowBlur);
    return () => window.removeEventListener('blur', handleWindowBlur);
  }, []);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(googleMapsExternalLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Exact Google Maps direction link provided by user
  const googleMapsExternalLink =
    'https://www.google.com/maps/dir/Katgor+Diagnostic+%26+Research+Centre,+Jalal+Market,+Chattogram/Kaptai+Rasta+Matha,+R163,+Chittagong/@22.3091628,91.7084904,11.22z/data=!4m13!4m12!1m5!1m1!1s0x30acdf092aad927d:0x6cc58cfe06896719!2m2!1d91.7920791!2d22.2600703!1m5!1m1!1s0x30ad27b57f76e4d3:0x3c8084d9f9eef03f!2m2!1d91.8684592!2d22.3943363?entry=ttu';

  // Embed URL for the Google Maps iframe
  const googleMapsEmbedUrl =
    'https://maps.google.com/maps?saddr=Katgor+Diagnostic+%26+Research+Centre,+Jalal+Market,+Chattogram&daddr=Kaptai+Rasta+Matha,+R163,+Chittagong&hl=bn&z=12&output=embed';

  // Leaflet references for interactive live radar
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<any>(null);
  const leafletMapRef = useRef<any>(null);
  const stopsLayerRef = useRef<any>(null);
  const busesLayerRef = useRef<any>(null);
  const userLayerRef = useRef<any>(null);

  // Fetch telemetry
  const fetchBuses = async () => {
    try {
      const res = await fetch('/api/tracking/buses');
      const data = await res.json();
      if (data.success && Array.isArray(data.buses)) {
        setBuses(data.buses);
        setLastSync(new Date().toLocaleTimeString());
        if (selectedBusId) {
          const found = data.buses.find((b: Bus) => b.id === selectedBusId);
          if (found) setActiveBus(found);
        }
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
    const interval = setInterval(fetchBuses, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusId]);

  const handleBusClick = useCallback(
    (bus: Bus) => {
      setActiveBus(bus);
      if (onSelectBus) onSelectBus(bus);
      if (leafletMapRef.current) {
        leafletMapRef.current.flyTo([bus.currentLat, bus.currentLng], 14, { duration: 1 });
      }
    },
    [onSelectBus]
  );

  const handleLocateMe = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError(language === 'bn' ? 'ব্রাউজারে লোকেশন সমর্থিত নয়' : 'Geolocation unsupported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLocation(coords);
        if (leafletMapRef.current) {
          leafletMapRef.current.flyTo([coords.lat, coords.lng], 15, { duration: 1.2 });
        }
      },
      () => {
        setLocationError(
          language === 'bn' ? 'লোকেশন পারমিশন দেওয়া হয়নি' : 'Location permission denied'
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Initialize interactive Leaflet Radar Map when viewMode === 'radar'
  useEffect(() => {
    let isMounted = true;
    if (viewMode !== 'radar') return;
    if (typeof window === 'undefined') return;

    async function initRadar() {
      if (!mapContainerRef.current) return;
      if (leafletMapRef.current) return;

      try {
        const L = (await import('leaflet')).default;
        if (!isMounted || !mapContainerRef.current) return;

        leafletRef.current = L;

        // Leaflet with 100% Free OpenStreetMap tiles (ZERO watermarks!)
        const map = L.map(mapContainerRef.current, {
          center: [22.315, 91.82],
          zoom: 12,
          zoomControl: false,
          attributionControl: true,
        });
        leafletMapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        // Route corridor
        const corridorCoords = INITIAL_STOPS.map((s) => [s.lat, s.lng] as [number, number]);

        L.polyline(corridorCoords, {
          color: '#fee2e2',
          weight: 8,
          opacity: 0.8,
          lineCap: 'round',
        }).addTo(map);

        L.polyline(corridorCoords, {
          color: '#dc2626',
          weight: 4,
          opacity: 0.95,
          dashArray: '6, 6',
          lineCap: 'round',
        }).addTo(map);

        // Stops
        const stopsLayer = L.layerGroup().addTo(map);
        stopsLayerRef.current = stopsLayer;

        INITIAL_STOPS.forEach((stop, index) => {
          const isTerm = stop.isTerminal;
          const stopHtml = `
            <div style="cursor: pointer; text-align: center;">
              <div style="
                width: ${isTerm ? '26px' : '20px'};
                height: ${isTerm ? '26px' : '20px'};
                background: ${isTerm ? '#dc2626' : '#ffffff'};
                border: 2px solid #dc2626;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 5px rgba(0,0,0,0.25);
                color: ${isTerm ? '#ffffff' : '#b91c1c'};
                font-size: 10px;
                font-weight: bold;
                margin: 0 auto;
              ">
                ${index + 1}
              </div>
            </div>
          `;

          const stopIcon = L.divIcon({
            className: 'custom-div-icon',
            html: stopHtml,
            iconSize: [26, 26],
            iconAnchor: [13, 13],
          });

          const marker = L.marker([stop.lat, stop.lng], { icon: stopIcon });
          marker.bindPopup(`
            <div style="padding: 10px; min-width: 180px;">
              <div style="font-size: 10px; color: #dc2626; font-weight: bold;">স্টপ #${index + 1}</div>
              <h4 style="font-weight: bold; font-size: 13px; color: #0f172a; margin: 2px 0;">
                ${language === 'bn' ? stop.nameBn : stop.nameEn}
              </h4>
              <p style="font-size: 11px; color: #64748b; margin: 0;">
                ${language === 'bn' ? stop.addressBn : stop.addressEn}
              </p>
            </div>
          `);
          stopsLayer.addLayer(marker);
        });

        // Buses Layer
        const busesLayer = L.layerGroup().addTo(map);
        busesLayerRef.current = busesLayer;

        // User Layer
        const userLayer = L.layerGroup().addTo(map);
        userLayerRef.current = userLayer;

        const bounds = L.latLngBounds(corridorCoords);
        map.fitBounds(bounds, { padding: [40, 40] });
      } catch (err) {
        // tolerance
      }
    }

    initRadar();

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [viewMode, language]);

  // Update live bus markers in radar mode
  useEffect(() => {
    if (viewMode !== 'radar') return;
    const L = leafletRef.current;
    const busesLayer = busesLayerRef.current;
    if (!L || !busesLayer) return;

    busesLayer.clearLayers();

    buses.forEach((bus) => {
      const isSelected = activeBus?.id === bus.id;
      const isLive =
        bus.isLiveSharing !== false &&
        bus.freshness === 'active' &&
        bus.status === 'on_duty';
      const isStale = !isLive && bus.freshness === 'stale';

      const busReg =
        language === 'bn'
          ? bus.registrationNumberBn.replace('চট্ট মেট্রো ব ', '')
          : bus.registrationNumberEn.replace('Chatto Metro Ba ', '');

      const busIconHtml = `
        <div style="position: relative; cursor: pointer;">
          ${
            isLive
              ? `
            <div class="animate-radar-ping" style="
              position: absolute;
              top: -12px;
              left: -12px;
              width: 48px;
              height: 48px;
              border-radius: 50%;
              border: 2px solid #dc2626;
              background: rgba(220, 38, 38, 0.2);
              pointer-events: none;
            "></div>
          `
              : `
            <div style="
              position: absolute;
              top: -6px;
              left: -6px;
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border: 1.5px dashed ${isStale ? '#f59e0b' : '#64748b'};
              pointer-events: none;
            "></div>
          `
          }

          <div style="
            width: ${isSelected ? '28px' : '24px'};
            height: ${isSelected ? '28px' : '24px'};
            background: ${
              isLive
                ? isSelected
                  ? '#991b1b'
                  : '#dc2626'
                : isStale
                ? isSelected
                  ? '#b45309'
                  : '#d97706'
                : '#64748b'
            };
            border: 2px solid #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            color: #ffffff;
            font-size: 11px;
            font-weight: bold;
          ">
            🚌
          </div>

          <div style="
            position: absolute;
            top: -24px;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            background: ${isSelected ? (isLive ? '#dc2626' : '#d97706') : '#ffffff'};
            color: ${isSelected ? '#ffffff' : (isLive ? '#0f172a' : '#92400e')};
            border: 1px solid ${isLive ? '#dc2626' : '#f59e0b'};
            padding: 2px 6px;
            border-radius: 6px;
            font-size: 10px;
            font-weight: 800;
            box-shadow: 0 2px 5px rgba(0,0,0,0.15);
            pointer-events: none;
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span>${busReg}</span>
            <span>${isLive ? '🔴' : '⏱️'}</span>
          </div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: busIconHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([bus.currentLat, bus.currentLng], {
        icon,
        zIndexOffset: isSelected ? 1000 : isLive ? 500 : 200,
      });

      marker.on('click', () => {
        handleBusClick(bus);
      });

      busesLayer.addLayer(marker);
    });
  }, [buses, activeBus, viewMode, language, handleBusClick]);

  const liveCount = buses.filter(
    (b) => b.isLiveSharing !== false && b.freshness === 'active' && b.status === 'on_duty'
  ).length;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-red-100 overflow-hidden flex flex-col">
      {/* 1. Header Bar with Mode Toggles */}
      <div className="p-4 sm:p-5 bg-white border-b border-red-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-xs border border-red-100">
            <Navigation className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                {language === 'bn'
                  ? 'মেট্রো প্রভাতী চট্টগ্রাম করিডোর ম্যাপ'
                  : 'Metro Probati Corridor Map'}
              </h3>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              কাঠগড় ↔ কাপ্তাই রাস্তার মাথা •{' '}
              {lastSync ? `আপডেট: ${toBengaliDigits(lastSync)}` : 'লোড হচ্ছে...'}
            </p>
          </div>
        </div>

        {/* View Mode Switcher: Google Maps / Live Radar / List */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200">
            <button
              onClick={() => setViewMode('google')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                viewMode === 'google'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>🗺️</span>
              <span>{language === 'bn' ? 'গুগল ম্যাপস' : 'Google Maps'}</span>
            </button>

            <button
              onClick={() => setViewMode('radar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                viewMode === 'radar'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>{language === 'bn' ? 'লাইভ রাডার' : 'Live Radar'}</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                viewMode === 'list'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'তালিকা' : 'List'}</span>
            </button>
          </div>

          <button
            onClick={fetchBuses}
            disabled={loading}
            title="রিফ্রেশ"
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Main Map Display */}
      {viewMode === 'google' ? (
        /* OFFICIAL GOOGLE MAPS EMBED VIEW (Matches user's exact link & screenshot) */
        <div
          onClick={() => {
            if (!isCardMinimized) setIsCardMinimized(true);
          }}
          className="relative w-full h-[460px] sm:h-[580px] lg:h-[640px] bg-slate-100 overflow-hidden"
        >
          {/* Authentic Google Maps Iframe */}
          <iframe
            src={googleMapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
            title="Metro Probati Route Google Maps"
          />

          {/* Transparent tap backdrop over the map when card is expanded:
              Tapping anywhere on the map area immediately minimizes the card */}
          {!isCardMinimized && (
            <div
              onClick={() => setIsCardMinimized(true)}
              onTouchStart={() => setIsCardMinimized(true)}
              className="absolute inset-0 z-10 cursor-pointer"
              aria-label="Tap on map to minimize route details"
              title={language === 'bn' ? 'ম্যাপ দেখতে ট্যাপ করুন' : 'Tap to view full map'}
            />
          )}

          {/* Collapsible Info Card: Minimized Pill OR Full Details */}
          {isCardMinimized ? (
            /* COMPACT FLOATING PILL (Unblocks 100% of the map view on mobile) */
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsCardMinimized(false);
              }}
              className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 max-w-[340px] w-[calc(100%-1.5rem)] sm:w-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 px-3 py-2 cursor-pointer hover:bg-white active:scale-98 transition-all duration-200 flex items-center justify-between gap-2.5 group select-none animate-in fade-in slide-in-from-top-2"
              title={language === 'bn' ? 'রুট বিবরণ দেখতে ট্যাপ করুন' : 'Tap to expand route details'}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <div className="truncate text-left">
                  <div className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 truncate">
                    <span>{language === 'bn' ? 'মেট্রো প্রভাতী এক্সপ্রেস' : 'Metro Probati Express'}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                      {language === 'bn' ? 'লাইভ রুট' : 'Live'}
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-blue-700 flex items-center gap-1 truncate">
                    <span>৫২ মি. • ২৪.৯ কিমি</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-700">১৫–৬৫ ৳</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCardMinimized(false);
                }}
                className="px-2.5 py-1 rounded-xl bg-red-50 hover:bg-red-100 group-hover:bg-red-100 text-red-600 border border-red-200 text-[10px] sm:text-[11px] font-bold flex items-center gap-1 shrink-0 transition"
              >
                <span>{language === 'bn' ? 'বিস্তারিত' : 'Details'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* FULL DETAILED CARD */
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 max-w-[340px] w-[calc(100%-1.5rem)] sm:w-[340px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-3.5 sm:p-4 select-none transition-all duration-200 animate-in zoom-in-95"
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  onClick={() => setIsCardMinimized(true)}
                  className="cursor-pointer group flex-1"
                  title={language === 'bn' ? 'ম্যাপ দেখতে ছোট করুন' : 'Minimize card'}
                >
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-red-600 transition-colors">
                    মেট্রো প্রভাতী এক্সপ্রেস করিডোর
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-relaxed font-medium">
                    কাঠগড় ডায়াগনস্টিক সেন্টার ↔ কাপ্তাই রাস্তার মাথা বাস স্টপ
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    লাইভ রুট
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCardMinimized(true);
                    }}
                    className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-90 text-slate-600 border border-slate-200 transition"
                    title={language === 'bn' ? 'ম্যাপ দেখতে কার্ড ছোট করুন' : 'Minimize to view map'}
                    aria-label="Minimize"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick helper button to minimize and view the whole map */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCardMinimized(true);
                }}
                className="w-full mt-2 py-1 px-2 rounded-lg bg-slate-100/90 hover:bg-slate-200 active:scale-98 text-slate-600 text-[10px] sm:text-[11px] font-semibold flex items-center justify-center gap-1.5 transition border border-slate-200"
              >
                <Maximize2 className="w-3 h-3 text-slate-500" />
                <span>{language === 'bn' ? 'ম্যাপ বড় করে দেখতে ট্যাপ করুন (কার্ড ছোট করুন)' : 'Tap map or here to minimize card'}</span>
                <ChevronUp className="w-3 h-3 text-slate-500" />
              </button>

              {/* Route Stats from user screenshot */}
              <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="flex items-center gap-1 text-blue-700">
                    <span>🚗</span>
                    <span>৫২ মিনিট • ২৪.৯ কিমি</span>
                  </span>
                  <span className="text-emerald-700 font-extrabold">
                    ভাড়া: ১৫ ৳ — ৬৫ ৳
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  ভায়া চট্টগ্রাম এলিভেটেড এক্সপ্রেসওয়ে / শহীদ ওয়াসিম আকরাম ফ্লাইওভার (দ্রুততম রুট)
                </p>
              </div>

              <div className="flex items-center gap-1.5 mt-2.5 text-xs">
                <span className="font-extrabold text-slate-900">৪.৮</span>
                <div className="flex text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-slate-500">(৫,৪২০ যাত্রী)</span>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded ml-auto">
                  ৫% শিক্ষার্থী ছাড়
                </span>
              </div>

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                <a
                  href={googleMapsExternalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Maps</span>
                </a>

                <button
                  onClick={handleCopyLink}
                  title="রুট লিংক কপি করুন"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition flex items-center justify-center"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>

                <a
                  href={googleMapsExternalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Directions"
                  className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition"
                >
                  <Navigation className="w-4 h-4" />
                </a>
              </div>

              {copied && (
                <div className="mt-1.5 text-[11px] text-center font-bold text-emerald-700 bg-emerald-50 py-1 rounded-lg">
                  ✓ গুগল ম্যাপস রুট লিংক কপি করা হয়েছে!
                </div>
              )}

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  রুটে {toBengaliDigits(liveCount)}টি বাস চলছে
                </span>
                <button
                  onClick={() => setViewMode('radar')}
                  className="text-red-600 font-bold hover:underline flex items-center gap-0.5"
                >
                  <span>লাইভ রাডার</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : viewMode === 'radar' ? (
        /* INTERACTIVE LIVE TELEMETRY RADAR (OpenStreetMap with moving bus pins, NO WATERMARKS) */
        <div className="relative w-full h-[460px] sm:h-[580px] lg:h-[640px] bg-slate-100 overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Quick Corridor & Locate Controls */}
          <div className="absolute right-4 bottom-14 z-20 flex flex-col bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <button
              onClick={handleLocateMe}
              title="আমার অবস্থান"
              className="p-2.5 hover:bg-slate-50 text-slate-700 border-b border-slate-100 transition"
            >
              <Crosshair className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const latLngs = INITIAL_STOPS.map((s) => [s.lat, s.lng] as [number, number]);
                leafletMapRef.current?.fitBounds(latLngs, { padding: [40, 40] });
              }}
              title="পুরো করিডোর"
              className="p-2.5 hover:bg-slate-50 text-slate-700 transition"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3 text-[11px] text-slate-700 shadow-xl space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <span className="font-bold text-slate-900">🔴 লাইভ বাস (সক্রিয় জিপিএস)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-600" />
              <span className="font-semibold text-slate-800">⏱️ সর্বশেষ অবস্থান (জিপিএস বন্ধ)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full border border-red-600 bg-white text-[8px] flex items-center justify-center font-bold text-red-600">
                •
              </span>
              <span className="text-slate-600">স্টপ পয়েন্ট (১-১১ ক্রমিক)</span>
            </div>
          </div>
        </div>
      ) : (
        /* LIST VIEW */
        <div className="p-4 sm:p-6 divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
          {buses.map((bus) => {
            const isLive =
              bus.isLiveSharing !== false &&
              bus.freshness === 'active' &&
              bus.status === 'on_duty';

            return (
              <div
                key={bus.id}
                onClick={() => handleBusClick(bus)}
                className="py-4 first:pt-0 last:pb-0 cursor-pointer rounded-2xl p-3.5 hover:bg-slate-50 transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        isLive ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <BusIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {bus.registrationNumberBn}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {bus.direction === 'kaptai_to_patenga'
                          ? 'কাঠগড় অভিমুখী'
                          : 'কাপ্তাই রাস্তার মাথা অভিমুখী'} •{' '}
                        {isLive ? `কাছাকাছি: ${bus.nearestStopNameBn || 'চিহ্নিত হচ্ছে'}` : `সর্বশেষ: ${bus.lastKnownStopNameBn || 'চিহ্নিত'}`}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        isLive
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isLive ? '🔴 লাইভ' : '⏱️ সর্বশেষ'}
                    </span>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {isLive ? `${toBengaliDigits(bus.speedKmh)} কিমি/ঘ` : 'জিপিএস বন্ধ'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Selected Bus Drawer */}
      {activeBus && (
        <div className="p-4 sm:p-5 bg-white border-t border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-slate-900 text-base">
                {activeBus.registrationNumberBn} ({activeBus.modelBn})
              </h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-bold border border-red-200">
                {activeBus.isLiveSharing !== false && activeBus.freshness === 'active'
                  ? '🔴 লাইভ জিপিএস সক্রিয়'
                  : '⏱️ সর্বশেষ জ্ঞাত অবস্থান'}
              </span>
            </div>
            <div className="text-xs text-slate-600 mt-1 flex items-center gap-3">
              <span>
                গতি: <strong>{toBengaliDigits(activeBus.speedKmh)} কিমি/ঘ</strong>
              </span>
              <span>•</span>
              <span>
                কাছাকাছি স্টপ: <strong>{activeBus.lastKnownStopNameBn || activeBus.nearestStopNameBn}</strong>
              </span>
              <span>•</span>
              <span>সিঙ্ক: {formatTimeAgoBn(activeBus.lastUpdated)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeBus.supervisorPhone && (
              <a
                href={`tel:${activeBus.supervisorPhone}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>সুপারভাইজার কল</span>
              </a>
            )}
            <button
              onClick={() => setActiveBus(null)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
