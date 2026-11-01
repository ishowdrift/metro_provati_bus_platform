import { RouteStop, FareCalculationResult, GpsFreshness } from '../types';
import { INITIAL_STOPS } from '../data/mockData';

/**
 * Converts English digits (0-9) to Bengali digits (০-৯)
 */
export function toBengaliDigits(input: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(input).replace(/[0-9]/g, (w) => bnDigits[parseInt(w, 10)]);
}

/**
 * Formats monetary amounts in Bangladeshi Taka with the ৳ symbol and Bengali numerals
 */
export function formatBDT(amount: number): string {
  return `৳${toBengaliDigits(amount)}`;
}

/**
 * Computes Haversine distance in kilometers between two geographic coordinates
 */
export function calculateHaversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Calculates stage-based fare between two stops along the corridor.
 * Minimum fare is ৳10; Terminal-to-Terminal (10 stages) is capped at ৳45.
 * Fares are explicitly marked as indicative until officially approved by Metro Probati.
 */
export function calculateFare(fromStopId: string, toStopId: string): FareCalculationResult | null {
  const fromStop = INITIAL_STOPS.find((s) => s.id === fromStopId);
  const toStop = INITIAL_STOPS.find((s) => s.id === toStopId);

  if (!fromStop || !toStop) {
    return null;
  }

  const stagesCount = Math.abs(fromStop.sequence - toStop.sequence);

  if (stagesCount === 0) {
    return {
      fromStop,
      toStop,
      stagesCount: 0,
      estimatedDistanceKm: 0,
      fareBDT: 0,
      isIndicative: true,
      disclaimerBn: 'প্রারম্ভিক ও গন্তব্য একই স্টপেজ নির্ধারিত হয়েছে।',
      disclaimerEn: 'Origin and destination are the same stop.',
    };
  }

  // Pair-specific indicative overrides configured in the current draft matrix.
  // Bahaddarhat (stop-2) <-> EPZ / KEPZ (stop-9): indicative draft ৳55
  // Agrabad (stop-7) <-> EPZ / KEPZ (stop-9): indicative draft ৳35
  const SPECIFIC_CORRIDOR_FARES: Record<string, number> = {
    'stop-2_stop-9': 55,
    'stop-9_stop-2': 55,
    'stop-7_stop-9': 35,
    'stop-9_stop-7': 35,
  };

  const pairKey = `${fromStopId}_${toStopId}`;

  // Stage pricing scale (approx ৳15 - ৳65 corridor; Bahaddarhat to KEPZ ৳55, Agrabad to KEPZ ৳35)
  // Stage 1: ৳15
  // Stage 2: ৳20
  // Stage 3: ৳25
  // Stage 4: ৳30
  // Stage 5: ৳35
  // Stage 6: ৳40
  // Stage 7: ৳45
  // Stage 8: ৳50
  // Stage 9: ৳55
  // Stage 10: ৳60
  // Stage 11+: ৳65
  let fare = 15;
  if (SPECIFIC_CORRIDOR_FARES[pairKey]) {
    fare = SPECIFIC_CORRIDOR_FARES[pairKey];
  } else if (stagesCount === 1) fare = 15;
  else if (stagesCount === 2) fare = 20;
  else if (stagesCount === 3) fare = 25;
  else if (stagesCount === 4) fare = 30;
  else if (stagesCount === 5) fare = 35;
  else if (stagesCount === 6) fare = 40;
  else if (stagesCount === 7) fare = 45;
  else if (stagesCount === 8) fare = 50;
  else if (stagesCount === 9) fare = 55;
  else if (stagesCount === 10) fare = 60;
  else fare = 65;

  const estimatedDistanceKm = calculateHaversineKm(
    fromStop.lat,
    fromStop.lng,
    toStop.lat,
    toStop.lng
  );

  return {
    fromStop,
    toStop,
    stagesCount,
    estimatedDistanceKm,
    fareBDT: fare,
    isIndicative: true,
    disclaimerBn:
      'এই ভাড়া বর্তমান সিস্টেমের নির্দেশক খসড়া হিসাব (১৫–৬৫ টাকা পরিধি; বহদ্দারহাট থেকে কেইপিজেড ৫৫ টাকা, কেইপিজেড থেকে আগ্রাবাদ ৩৫ টাকা)। এটি চূড়ান্ত অনুমোদিত ভাড়া নয়; যাত্রার আগে কাউন্টারে নিশ্চিত করুন।',
    disclaimerEn:
      'This is an indicative draft estimate (৳15–৳65 range; Bahaddarhat to KEPZ ৳55, KEPZ to Agrabad ৳35), not a final approved fare. Confirm the final amount at a counter before travelling.',
  };
}

/**
 * Computes telemetry GPS freshness level according to timing threshold:
 * - < 3 minutes: 'active'
 * - 3 to 10 minutes: 'stale'
 * - > 10 minutes: 'unavailable'
 */
export function calculateFreshness(timestampIso: string): GpsFreshness {
  const timestamp = new Date(timestampIso).getTime();
  if (isNaN(timestamp)) return 'unavailable';

  const diffMs = Date.now() - timestamp;
  const threeMinutesMs = 3 * 60 * 1000;
  const tenMinutesMs = 10 * 60 * 1000;

  if (diffMs < 0) return 'active'; // Clock skew tolerance
  if (diffMs <= threeMinutesMs) return 'active';
  if (diffMs <= tenMinutesMs) return 'stale';
  return 'unavailable';
}

/**
 * Finds the nearest corridor stop to a given geographic coordinate
 */
export function findNearestStop(lat: number, lng: number): RouteStop {
  let nearest = INITIAL_STOPS[0];
  let minDistance = Infinity;

  for (const stop of INITIAL_STOPS) {
    const dist = calculateHaversineKm(lat, lng, stop.lat, stop.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = stop;
    }
  }

  return nearest;
}

/**
 * Returns a human-friendly relative time string in Bengali
 */
export function formatTimeAgoBn(timestampIso: string): string {
  const timestamp = new Date(timestampIso).getTime();
  if (isNaN(timestamp)) return 'অজ্ঞাত সময়';

  const diffSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (diffSeconds < 60) return 'মাত্র কয়েক সেকেন্ড আগে';
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${toBengaliDigits(diffMinutes)} মিনিট আগে`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${toBengaliDigits(diffHours)} ঘণ্টা আগে`;
  const diffDays = Math.floor(diffHours / 24);
  return `${toBengaliDigits(diffDays)} দিন আগে`;
}

/**
 * Returns a human-friendly relative time string in English
 */
export function formatTimeAgoEn(timestampIso: string): string {
  const timestamp = new Date(timestampIso).getTime();
  if (isNaN(timestamp)) return 'unknown time';

  const diffSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (diffSeconds < 60) return 'just now';
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

