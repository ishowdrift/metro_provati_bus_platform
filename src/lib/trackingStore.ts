import { Bus, GpsFreshness } from '../types';
import { INITIAL_BUSES } from '../data/mockData';
import { calculateFreshness, findNearestStop } from './fareCalculator';

// Chattogram Metropolitan & Suburban Transport Corridor Bounding Box
export const CHATTOGRAM_GEOFENCE = {
  minLat: 22.15,
  maxLat: 22.55,
  minLng: 91.65,
  maxLng: 92.05,
};

export function isWithinChattogram(lat: number, lng: number): boolean {
  return (
    lat >= CHATTOGRAM_GEOFENCE.minLat &&
    lat <= CHATTOGRAM_GEOFENCE.maxLat &&
    lng >= CHATTOGRAM_GEOFENCE.minLng &&
    lng <= CHATTOGRAM_GEOFENCE.maxLng
  );
}

// In-memory bus telemetry store
// Keep the fleet roster available for driver-device updates, but never treat
// seeded coordinates as live telemetry. A bus becomes visible to passengers
// only after recordDriverPing receives an actual device update.
let busesStore: Bus[] = JSON.parse(JSON.stringify(INITIAL_BUSES)).map((bus: Bus) => ({
  ...bus,
  status: 'offline',
  speedKmh: 0,
  isLiveSharing: false,
  freshness: 'unavailable',
  lastUpdated: new Date(0).toISOString(),
}));

/**
 * Returns all buses with dynamically updated freshness statuses and nearest stop names
 */
export function getLiveBuses(): Bus[] {
  busesStore = busesStore.map((bus) => {
    let freshness: GpsFreshness = calculateFreshness(bus.lastUpdated);
    if (bus.status === 'offline' || bus.status === 'maintenance') {
      freshness = 'unavailable';
    } else if (bus.isLiveSharing === false || bus.status === 'idle') {
      freshness = freshness === 'active' ? 'stale' : freshness;
    }

    const nearest = findNearestStop(bus.currentLat, bus.currentLng);

    return {
      ...bus,
      freshness,
      nearestStopNameBn: nearest.nameBn,
      nearestStopNameEn: nearest.nameEn,
      lastKnownStopNameBn: bus.lastKnownStopNameBn || nearest.nameBn,
      lastKnownStopNameEn: bus.lastKnownStopNameEn || nearest.nameEn,
    };
  });

  return busesStore;
}

/**
 * Get a specific bus by ID with recalculated freshness
 */
export function getBusById(busId: string): Bus | undefined {
  const buses = getLiveBuses();
  return buses.find((b) => b.id === busId);
}

/**
 * Updates a bus's telemetry from genuine GPS hardware / driver browser Geolocation ping
 */
export function recordDriverPing(params: {
  busId: string;
  lat: number;
  lng: number;
  speedKmh?: number;
  heading?: number;
  batteryLevel?: number;
  networkStatus?: 'online' | 'offline';
  isLiveSharing?: boolean;
}): { success: boolean; error?: string; bus?: Bus } {
  const { busId, lat, lng, speedKmh, heading, batteryLevel, networkStatus, isLiveSharing } = params;

  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    return { success: false, error: 'অবৈধ জিপিএস স্থানাঙ্ক (Invalid coordinates)' };
  }

  // Geofence enforcement
  if (!isWithinChattogram(lat, lng)) {
    return {
      success: false,
      error: 'স্থানাঙ্ক চট্টগ্রাম মেট্রোপলিটন এলাকার বাইরে (Location outside Chattogram corridor)',
    };
  }

  const busIndex = busesStore.findIndex((b) => b.id === busId);
  if (busIndex === -1) {
    return { success: false, error: 'বাসের রেকর্ড পাওয়া যায়নি (Bus not found)' };
  }

  const nowIso = new Date().toISOString();
  const nearest = findNearestStop(lat, lng);
  const liveActive = isLiveSharing !== false;

  busesStore[busIndex] = {
    ...busesStore[busIndex],
    currentLat: lat,
    currentLng: lng,
    speedKmh: liveActive
      ? speedKmh !== undefined
        ? Math.max(0, Math.round(speedKmh))
        : busesStore[busIndex].speedKmh
      : 0,
    heading: heading !== undefined ? Math.round(heading) : busesStore[busIndex].heading,
    batteryLevel: batteryLevel !== undefined ? batteryLevel : busesStore[busIndex].batteryLevel,
    networkStatus: networkStatus || 'online',
    lastUpdated: nowIso,
    freshness: liveActive ? 'active' : 'stale',
    status: liveActive ? 'on_duty' : 'idle',
    isLiveSharing: liveActive,
    nearestStopNameBn: nearest.nameBn,
    nearestStopNameEn: nearest.nameEn,
    lastKnownStopNameBn: nearest.nameBn,
    lastKnownStopNameEn: nearest.nameEn,
  };

  return { success: true, bus: busesStore[busIndex] };
}

/**
 * Updates bus operational duty status
 */
export function setBusDutyStatus(
  busId: string,
  status: 'on_duty' | 'idle' | 'maintenance' | 'offline'
): Bus | undefined {
  const busIndex = busesStore.findIndex((b) => b.id === busId);
  if (busIndex === -1) return undefined;

  const isLive = status === 'on_duty';
  busesStore[busIndex] = {
    ...busesStore[busIndex],
    status,
    isLiveSharing: isLive,
    speedKmh: isLive ? busesStore[busIndex].speedKmh : 0,
    freshness: isLive ? calculateFreshness(busesStore[busIndex].lastUpdated) : 'stale',
  };

  return busesStore[busIndex];
}

/**
 * Updates bus standing capacity count from supervisor/counter
 */
export function updateBusOccupancy(
  busId: string,
  reservedStandingCount: number
): Bus | undefined {
  const busIndex = busesStore.findIndex((b) => b.id === busId);
  if (busIndex === -1) return undefined;

  const currentStanding = busesStore[busIndex].standingCapacity;
  const newCount = Math.min(
    currentStanding.approvedCapacity,
    Math.max(0, reservedStandingCount)
  );

  busesStore[busIndex] = {
    ...busesStore[busIndex],
    standingCapacity: {
      ...currentStanding,
      reservedCount: newCount,
    },
  };

  return busesStore[busIndex];
}
