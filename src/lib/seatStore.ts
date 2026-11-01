import { BusSeat, StandingCapacity, SeatState } from '../types';

export function generateDefaultSeatLayout(busId: string = 'bus-mp-101'): BusSeat[] {
  const seats: BusSeat[] = [];

  // Front Left: Women-Reserved (2 seats)
  seats.push({
    id: `${busId}-seat-W1`,
    seatNumber: 'W1',
    row: 0,
    col: 1,
    status: 'available',
    isWomenReserved: true,
    side: 'front_women',
  });
  seats.push({
    id: `${busId}-seat-W2`,
    seatNumber: 'W2',
    row: 0,
    col: 2,
    status: 'available',
    isWomenReserved: true,
    side: 'front_women',
  });

  // 8 Regular Rows (Left L1-L16 and Right R1-R16)
  for (let r = 1; r <= 8; r++) {
    const leftSeatNum1 = (r - 1) * 2 + 1; // 1, 3, 5, 7, 9, 11, 13, 15
    const leftSeatNum2 = leftSeatNum1 + 1; // 2, 4, 6, 8, 10, 12, 14, 16

    const rightSeatNum1 = (r - 1) * 2 + 1;
    const rightSeatNum2 = rightSeatNum1 + 1;

    // Left Col 1 & 2
    seats.push({
      id: `${busId}-seat-L${leftSeatNum1}`,
      seatNumber: `L${leftSeatNum1}`,
      row: r,
      col: 1,
      status: r === 1 ? 'booked' : 'available',
      side: 'left',
    });
    seats.push({
      id: `${busId}-seat-L${leftSeatNum2}`,
      seatNumber: `L${leftSeatNum2}`,
      row: r,
      col: 2,
      status: 'available',
      side: 'left',
    });

    // Right Col 3 & 4
    seats.push({
      id: `${busId}-seat-R${rightSeatNum1}`,
      seatNumber: `R${rightSeatNum1}`,
      row: r,
      col: 3,
      status: r === 2 ? 'booked' : 'available',
      side: 'right',
    });
    seats.push({
      id: `${busId}-seat-R${rightSeatNum2}`,
      seatNumber: `R${rightSeatNum2}`,
      row: r,
      col: 4,
      status: 'available',
      side: 'right',
    });
  }

  // Row 9: Rear 4 seats (L17, L18, L19, L20)
  ['L17', 'L18', 'L19', 'L20'].forEach((sNum, colIdx) => {
    seats.push({
      id: `${busId}-seat-${sNum}`,
      seatNumber: sNum,
      row: 9,
      col: colIdx + 1,
      status: 'available',
      side: 'rear',
    });
  });

  return seats;
}

// In-memory runtime store for bus seat allocations
const busSeatStore: Record<string, BusSeat[]> = {
  'bus-mp-101': generateDefaultSeatLayout('bus-mp-101'),
  'bus-mp-102': generateDefaultSeatLayout('bus-mp-102'),
  'bus-mp-103': generateDefaultSeatLayout('bus-mp-103'),
  'bus-mp-104': generateDefaultSeatLayout('bus-mp-104'),
};

const busStandingStore: Record<string, StandingCapacity> = {
  'bus-mp-101': { approvedCapacity: 15, reservedCount: 4, isEnabled: true },
  'bus-mp-102': { approvedCapacity: 15, reservedCount: 2, isEnabled: true },
  'bus-mp-103': { approvedCapacity: 15, reservedCount: 6, isEnabled: true },
  'bus-mp-104': { approvedCapacity: 15, reservedCount: 0, isEnabled: true },
};

/**
 * Clean up expired seat holds
 */
export function purgeExpiredHolds(busId: string): void {
  const seats = busSeatStore[busId] || [];
  const now = Date.now();

  busSeatStore[busId] = seats.map((seat) => {
    if (seat.status === 'held' && seat.heldExpiresAt) {
      const expires = new Date(seat.heldExpiresAt).getTime();
      if (now > expires) {
        return {
          ...seat,
          status: 'available',
          heldExpiresAt: undefined,
          heldBySessionId: undefined,
        };
      }
    }
    return seat;
  });
}

/**
 * Get current seat map for a bus
 */
export function getBusSeatMap(busId: string): BusSeat[] {
  purgeExpiredHolds(busId);
  return busSeatStore[busId] || generateDefaultSeatLayout(busId);
}

/**
 * Get standing space status for a bus
 */
export function getBusStandingCapacity(busId: string): StandingCapacity {
  return busStandingStore[busId] || { approvedCapacity: 15, reservedCount: 0, isEnabled: true };
}

/**
 * Attempt to temporarily hold seats with a 5-minute expiration countdown
 */
export function holdSeats(
  busId: string,
  seatNumbers: string[],
  sessionId: string,
  holdDurationMinutes: number = 5
): { success: boolean; error?: string; heldSeats?: string[]; expiresAt?: string } {
  purgeExpiredHolds(busId);

  const seats = busSeatStore[busId] || generateDefaultSeatLayout(busId);
  busSeatStore[busId] = seats;

  // Validate all requested seats are available
  const unavailable: string[] = [];
  for (const sNum of seatNumbers) {
    const seat = seats.find((s) => s.seatNumber === sNum);
    if (!seat) {
      return { success: false, error: `আসন নম্বর ${sNum} পাওয়া যায়নি (Seat not found)` };
    }
    if (seat.status !== 'available' && seat.heldBySessionId !== sessionId) {
      unavailable.push(sNum);
    }
  }

  if (unavailable.length > 0) {
    return {
      success: false,
      error: `আসন ${unavailable.join(', ')} ইতিমধ্যে সংরক্ষিত বা অন্য যাত্রী নির্বাচন করেছেন।`,
    };
  }

  // Atomically hold all requested seats
  const expiresAt = new Date(Date.now() + holdDurationMinutes * 60 * 1000).toISOString();
  busSeatStore[busId] = seats.map((seat) => {
    if (seatNumbers.includes(seat.seatNumber)) {
      return {
        ...seat,
        status: 'held',
        heldExpiresAt: expiresAt,
        heldBySessionId: sessionId,
      };
    }
    return seat;
  });

  return { success: true, heldSeats: seatNumbers, expiresAt };
}

/**
 * Release temporary seat holds
 */
export function releaseHeldSeats(busId: string, seatNumbers: string[], sessionId: string): boolean {
  const seats = busSeatStore[busId];
  if (!seats) return false;

  busSeatStore[busId] = seats.map((seat) => {
    if (seatNumbers.includes(seat.seatNumber) && seat.heldBySessionId === sessionId) {
      return {
        ...seat,
        status: 'available',
        heldExpiresAt: undefined,
        heldBySessionId: undefined,
      };
    }
    return seat;
  });

  return true;
}

/**
 * Commit held seats to confirmed booked state upon successful payment or counter confirmation
 */
export function commitBookedSeats(busId: string, seatNumbers: string[]): boolean {
  const seats = busSeatStore[busId] || generateDefaultSeatLayout(busId);

  busSeatStore[busId] = seats.map((seat) => {
    if (seatNumbers.includes(seat.seatNumber)) {
      return {
        ...seat,
        status: 'booked',
        heldExpiresAt: undefined,
        heldBySessionId: undefined,
      };
    }
    return seat;
  });

  return true;
}
