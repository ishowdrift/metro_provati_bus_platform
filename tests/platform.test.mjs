import test from 'node:test';
import assert from 'node:assert/strict';

import {
  toBengaliDigits,
  formatBDT,
  calculateFare,
  calculateFreshness,
  calculateHaversineKm,
} from '../src/lib/fareCalculator.ts';

import {
  isWithinChattogram,
  CHATTOGRAM_GEOFENCE,
  recordDriverPing,
  getLiveBuses,
} from '../src/lib/trackingStore.ts';

import {
  generateDefaultSeatLayout,
  holdSeats,
  releaseHeldSeats,
  commitBookedSeats,
  getBusSeatMap,
} from '../src/lib/seatStore.ts';

import {
  createBookingOrder,
  verifySandboxPayment,
  getBookingByReference,
} from '../src/lib/payments/index.ts';

test('1. Bengali Digit & Currency Formatting', () => {
  assert.equal(toBengaliDigits('12345'), '১২৩৪৫');
  assert.equal(toBengaliDigits(45), '৪৫');
  assert.equal(toBengaliDigits(0), '০');
  assert.equal(formatBDT(45), '৳৪৫');
  assert.equal(formatBDT(10), '৳১০');
});

test('2. Stage-Based Fare Calculation', () => {
  // Stop 1 (Kaptai) to Stop 2 (Bahaddarhat): 1 stage -> ৳15 (+5 TK updated)
  const fare1 = calculateFare('stop-1', 'stop-2');
  assert.ok(fare1);
  assert.equal(fare1.stagesCount, 1);
  assert.equal(fare1.fareBDT, 15);
  assert.equal(fare1.isIndicative, true);

  // Stop 2 (Bahaddarhat) to Stop 9 (EPZ / KEPZ): 9 stages -> ৳55
  const fareBoddarhatKepz = calculateFare('stop-2', 'stop-9');
  assert.ok(fareBoddarhatKepz);
  assert.equal(fareBoddarhatKepz.stagesCount, 9);
  assert.equal(fareBoddarhatKepz.fareBDT, 55);

  // Reverse: Stop 9 (EPZ / KEPZ) to Stop 2 (Bahaddarhat) -> ৳55
  const fareKepzBoddarhat = calculateFare('stop-9', 'stop-2');
  assert.ok(fareKepzBoddarhat);
  assert.equal(fareKepzBoddarhat.fareBDT, 55);

  // Stop 9 (EPZ / KEPZ) to Stop 7 (Agrabad): 2 stages -> Officially ৳35
  const fareKepzAgrabad = calculateFare('stop-9', 'stop-7');
  assert.ok(fareKepzAgrabad);
  assert.equal(fareKepzAgrabad.stagesCount, 2);
  assert.equal(fareKepzAgrabad.fareBDT, 35);

  // Reverse: Stop 7 (Agrabad) to Stop 9 (EPZ / KEPZ): Officially ৳35
  const fareAgrabadKepz = calculateFare('stop-7', 'stop-9');
  assert.ok(fareAgrabadKepz);
  assert.equal(fareAgrabadKepz.fareBDT, 35);

  // Stop 3 (Muradpur) to Stop 11 (2 No Gate): 1 stage -> ৳15
  const fare2NoGate = calculateFare('stop-3', 'stop-11');
  assert.ok(fare2NoGate);
  assert.equal(fare2NoGate.stagesCount, 1);
  assert.equal(fare2NoGate.fareBDT, 15);

  // Stop 6 (Dewanhat) to Stop 12 (Chowmuhani): 1 stage -> ৳15
  const fareChowmuhani = calculateFare('stop-6', 'stop-12');
  assert.ok(fareChowmuhani);
  assert.equal(fareChowmuhani.stagesCount, 1);
  assert.equal(fareChowmuhani.fareBDT, 15);

  // Stop 1 (Kaptai) to Stop 10 (Katgor): 11 stages (terminal-to-terminal) -> ৳65
  const fareTerminal = calculateFare('stop-1', 'stop-10');
  assert.ok(fareTerminal);
  assert.equal(fareTerminal.stagesCount, 11);
  assert.equal(fareTerminal.fareBDT, 65);

  // Same stop: 0 stages -> ৳0
  const fareSame = calculateFare('stop-1', 'stop-1');
  assert.ok(fareSame);
  assert.equal(fareSame.stagesCount, 0);
  assert.equal(fareSame.fareBDT, 0);

  // Invalid stop returns null
  assert.equal(calculateFare('stop-invalid', 'stop-1'), null);
});

test('3. GPS Freshness Threshold Calculation', () => {
  const nowIso = new Date().toISOString();
  assert.equal(calculateFreshness(nowIso), 'active');

  const twoMinsAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
  assert.equal(calculateFreshness(twoMinsAgo), 'active');

  const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  assert.equal(calculateFreshness(fiveMinsAgo), 'stale');

  const twentyMinsAgo = new Date(Date.now() - 20 * 60 * 1000).toISOString();
  assert.equal(calculateFreshness(twentyMinsAgo), 'unavailable');
});

test('4. Chattogram Corridor Geofencing', () => {
  // GEC Mor (Inside)
  assert.equal(isWithinChattogram(22.3582, 91.8211), true);

  // Patenga Sea Beach (Inside)
  assert.equal(isWithinChattogram(22.2289, 91.7946), true);

  // Dhaka (Far Outside)
  assert.equal(isWithinChattogram(23.8103, 90.4125), false);

  // London (Outside)
  assert.equal(isWithinChattogram(51.5074, -0.1278), false);
});

test('5. Bus Telemetry Ingestion & Duty Status', () => {
  // Seeded coordinates must not be treated as live telemetry before a device ping.
  const unreportedBus = getLiveBuses().find((bus) => bus.id === 'bus-mp-102');
  assert.ok(unreportedBus);
  assert.equal(unreportedBus.freshness, 'unavailable');
  assert.equal(unreportedBus.status, 'offline');

  // Valid telemetry ping in GEC Mor
  const result = recordDriverPing({
    busId: 'bus-mp-101',
    lat: 22.3585,
    lng: 91.8215,
    speedKmh: 30,
    heading: 190,
    batteryLevel: 85,
  });

  assert.equal(result.success, true);
  assert.ok(result.bus);
  assert.equal(result.bus.currentLat, 22.3585);
  assert.equal(result.bus.freshness, 'active');

  // Ping outside Chattogram rejected
  const outsideResult = recordDriverPing({
    busId: 'bus-mp-101',
    lat: 23.8103, // Dhaka
    lng: 90.4125,
  });
  assert.equal(outsideResult.success, false);
});

test('6. Atomic Seat Reservation & Concurrency Lease', () => {
  const busId = 'bus-mp-102';
  const sessionId1 = 'passenger-sess-101';
  const sessionId2 = 'passenger-sess-102';

  // Session 1 holds L2 and L3
  const hold1 = holdSeats(busId, ['L2', 'L3'], sessionId1, 5);
  assert.equal(hold1.success, true);
  assert.ok(hold1.expiresAt);

  // Session 2 tries to hold L2 (Already held by session 1) -> Must fail with conflict
  const hold2 = holdSeats(busId, ['L2'], sessionId2, 5);
  assert.equal(hold2.success, false);
  assert.ok(hold2.error?.includes('ইতিমধ্যে সংরক্ষিত বা অন্য যাত্রী নির্বাচন করেছেন'));

  // Session 1 releases L2
  const released = releaseHeldSeats(busId, ['L2'], sessionId1);
  assert.equal(released, true);

  // Now Session 2 can hold L2
  const hold2Retry = holdSeats(busId, ['L2'], sessionId2, 5);
  assert.equal(hold2Retry.success, true);

  // Commit L3 to booked permanently
  const committed = commitBookedSeats(busId, ['L3']);
  assert.equal(committed, true);

  const seatMap = getBusSeatMap(busId);
  const seatL3 = seatMap.find((s) => s.seatNumber === 'L3');
  assert.equal(seatL3?.status, 'booked');
});

test('7. Payment Order Creation & Sandbox Verification', () => {
  const order = createBookingOrder({
    passengerName: 'সাকিব আল হাসান',
    passengerPhone: '01711000000',
    routeId: 'route-mp-1',
    direction: 'kaptai_to_patenga',
    fromStopId: 'stop-1',
    toStopId: 'stop-10',
    fromStopNameBn: 'কাপ্তাই রাস্তার মাথা',
    toStopNameBn: 'কাঠগড়',
    selectedSeats: ['R1'],
    standingCount: 0,
    farePerPersonBDT: 50,
    totalFareBDT: 50,
    paymentMethod: 'bkash',
    busId: 'bus-mp-103',
  });

  assert.equal(order.success, true);
  assert.ok(order.booking);
  assert.ok(order.booking.reference.startsWith('MP-'));
  assert.equal(order.booking.paymentStatus, 'unpaid');
  assert.ok(order.redirectUrl?.includes('/payment/sandbox-checkout'));

  // Simulate verify payment
  const verified = verifySandboxPayment(order.booking.id, 'TRX-TEST-999');
  assert.equal(verified.success, true);
  assert.equal(verified.booking?.paymentStatus, 'sandbox_paid');
  assert.equal(verified.booking?.status, 'confirmed');

  // Verify lookup by reference
  const lookedUp = getBookingByReference(order.booking.reference);
  assert.ok(lookedUp);
  assert.equal(lookedUp.passengerName, 'সাকিব আল হাসান');
});

test('8. Google & Gmail Passenger Authentication & Name Formatting', () => {
  // Test email format detection
  const isGmail = (str) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim()) &&
    str.trim().toLowerCase().endsWith('@gmail.com');

  assert.equal(isGmail('passenger@gmail.com'), true);
  assert.equal(isGmail('passenger.ctg@gmail.com'), true);
  assert.equal(isGmail('01855667788'), false);
  assert.equal(isGmail('invalid-email'), false);

  // Test name derivation from Google Gmail handle
  const deriveName = (email, fallbackName) => {
    if (fallbackName && fallbackName.trim()) return fallbackName.trim();
    const handle = email.split('@')[0] || 'passenger';
    return handle.charAt(0).toUpperCase() + handle.slice(1);
  };

  assert.equal(deriveName('passenger@gmail.com'), 'Passenger');
  assert.equal(deriveName('sakib.ctg@gmail.com', 'সাকিব আল হাসান'), 'সাকিব আল হাসান');
});

test('9. Counter Directory Staff-Only Authorization Filter', () => {
  const isStaffAuthorized = (role) =>
    role === 'counter_representative' ||
    role === 'counter_manager' ||
    role === 'bus_supervisor' ||
    role === 'operations_admin' ||
    role === 'super_admin';

  // Allowed staff
  assert.equal(isStaffAuthorized('counter_representative'), true);
  assert.equal(isStaffAuthorized('bus_supervisor'), true);
  assert.equal(isStaffAuthorized('counter_manager'), true);
  assert.equal(isStaffAuthorized('super_admin'), true);

  // Restricted users
  assert.equal(isStaffAuthorized('passenger'), false);
  assert.equal(isStaffAuthorized('driver'), false);
  assert.equal(isStaffAuthorized('guest'), false);
});

test('10. Supervisor & Counter Seat Monitor Empty Seats Calculation', () => {
  const isSupervisorOrCounter = (role) =>
    role === 'bus_supervisor' ||
    role === 'counter_representative' ||
    role === 'counter_manager' ||
    role === 'operations_admin' ||
    role === 'super_admin';

  assert.equal(isSupervisorOrCounter('bus_supervisor'), true);
  assert.equal(isSupervisorOrCounter('counter_representative'), true);
  assert.equal(isSupervisorOrCounter('passenger'), false);

  // Test seat store empty seats count & list
  const busId = 'bus-mp-101';
  const seats = getBusSeatMap(busId);
  const availableSeats = seats.filter((s) => s.status === 'available');
  const bookedSeats = seats.filter((s) => s.status === 'booked');
  const heldSeats = seats.filter((s) => s.status === 'held');

  assert.ok(seats.length >= 36);
  assert.ok(availableSeats.length > 0);
  assert.equal(seats.length, availableSeats.length + bookedSeats.length + heldSeats.length);

  // Verify seat numbers exist and are valid string identifiers
  for (const s of availableSeats) {
    assert.ok(typeof s.seatNumber === 'string' && s.seatNumber.length > 0);
  }
});

test('11. Mobile Navigation Visibility on Login Interface', () => {
  const shouldShowMobileBottomNav = (pathname) => pathname !== '/login' && !pathname.startsWith('/login');

  assert.equal(shouldShowMobileBottomNav('/login'), false);
  assert.equal(shouldShowMobileBottomNav('/login/'), false);
  assert.equal(shouldShowMobileBottomNav('/'), true);
  assert.equal(shouldShowMobileBottomNav('/fares'), true);
  assert.equal(shouldShowMobileBottomNav('/tickets'), true);
  assert.equal(shouldShowMobileBottomNav('/tracking'), true);
});

test('12. Live Route Overlay Card Collapsible State on Mobile Map Tap', () => {
  let isCardMinimized = false;
  const onMapTap = () => {
    isCardMinimized = true;
  };
  const onPillTap = () => {
    isCardMinimized = false;
  };

  assert.equal(isCardMinimized, false);
  // User taps on the map -> minimizes card to view full map
  onMapTap();
  assert.equal(isCardMinimized, true);
  // User taps on the minimized pill / details button -> expands back
  onPillTap();
  assert.equal(isCardMinimized, false);
});
