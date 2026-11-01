import { TicketBooking, RouteDirection } from '../../types';
import { commitBookedSeats } from '../seatStore';

// In-memory bookings registry
const bookingsStore: TicketBooking[] = [
  {
    id: 'tkt-pilot-1001',
    reference: 'MP-20261014-9821',
    passengerName: 'মেহরাব হোসেন',
    passengerPhone: '01812345678',
    routeId: 'route-mp-1',
    direction: 'kaptai_to_patenga',
    fromStopId: 'stop-1',
    toStopId: 'stop-7',
    fromStopNameBn: 'কাপ্তai রাস্তার মাথা',
    toStopNameBn: 'আগ্রাবাদ',
    selectedSeats: ['A1', 'A2'],
    standingCount: 0,
    passengerCount: 2,
    farePerPersonBDT: 40,
    totalFareBDT: 80,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'bkash',
    paymentTrxId: 'BK-TEST-884920',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    qrVerificationToken: 'MP-SEC-HASH-9821-OK',
    busId: 'bus-mp-101',
    isPilotDemo: true,
  },
];

export interface CreateBookingParams {
  passengerName: string;
  passengerPhone: string;
  routeId: string;
  direction: RouteDirection;
  fromStopId: string;
  toStopId: string;
  fromStopNameBn: string;
  toStopNameBn: string;
  selectedSeats: string[];
  standingCount: number;
  farePerPersonBDT: number;
  totalFareBDT: number;
  paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'cash_at_counter';
  busId?: string;
  counterId?: string;
  isStudentDiscount?: boolean;
  discountAmountBDT?: number;
}

export function generateBookingReference(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `MP-${dateStr}-${randomSuffix}`;
}

export function createBookingOrder(params: CreateBookingParams): {
  success: boolean;
  error?: string;
  booking?: TicketBooking;
  redirectUrl?: string;
} {
  const {
    passengerName,
    passengerPhone,
    fromStopId,
    toStopId,
    selectedSeats,
    standingCount,
    totalFareBDT,
    paymentMethod,
    busId = 'bus-mp-101',
    isStudentDiscount,
    discountAmountBDT,
  } = params;

  if (!passengerName || !passengerPhone) {
    return { success: false, error: 'যাত্রীর নাম ও মোবাইল নম্বর আবশ্যক (Name and phone required)' };
  }

  if (selectedSeats.length === 0 && standingCount === 0) {
    return { success: false, error: 'অন্তত একটি আসন বা স্ট্যান্ডিং স্থান নির্বাচন করুন (Select at least 1 seat/standing)' };
  }

  const bookingId = `tkt-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const reference = generateBookingReference();
  const qrToken = `MP-QR-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  const isCash = paymentMethod === 'cash_at_counter';

  const newBooking: TicketBooking = {
    id: bookingId,
    reference,
    passengerName,
    passengerPhone,
    routeId: params.routeId,
    direction: params.direction,
    fromStopId,
    toStopId,
    fromStopNameBn: params.fromStopNameBn,
    toStopNameBn: params.toStopNameBn,
    selectedSeats,
    standingCount,
    passengerCount: selectedSeats.length + standingCount,
    farePerPersonBDT: params.farePerPersonBDT,
    totalFareBDT,
    status: isCash ? 'confirmed' : 'pending',
    paymentStatus: isCash ? 'paid' : 'unpaid',
    paymentMethod,
    createdAt: new Date().toISOString(),
    qrVerificationToken: qrToken,
    busId,
    counterId: params.counterId,
    isStudentDiscount: !!isStudentDiscount,
    discountAmountBDT: discountAmountBDT || 0,
    isPilotDemo: true,
  };

  // If cash at counter, commit seats immediately
  if (isCash && selectedSeats.length > 0) {
    commitBookedSeats(busId, selectedSeats);
  }

  bookingsStore.unshift(newBooking);

  // Return sandbox checkout redirect for digital wallets
  const redirectUrl = isCash
    ? `/tickets?ref=${reference}`
    : `/payment/sandbox-checkout?bookingId=${bookingId}&provider=${paymentMethod}&amount=${totalFareBDT}&ref=${reference}`;

  return {
    success: true,
    booking: newBooking,
    redirectUrl,
  };
}

export function verifySandboxPayment(
  bookingId: string,
  trxId: string
): { success: boolean; error?: string; booking?: TicketBooking } {
  const booking = bookingsStore.find((b) => b.id === bookingId);
  if (!booking) {
    return { success: false, error: 'বুকিং রেকর্ড পাওয়া যায়নি (Booking not found)' };
  }

  booking.paymentStatus = 'sandbox_paid';
  booking.status = 'confirmed';
  booking.paymentTrxId = trxId || `TX-${Date.now()}`;

  // Commit held seats to permanently booked
  if (booking.busId && booking.selectedSeats.length > 0) {
    commitBookedSeats(booking.busId, booking.selectedSeats);
  }

  return { success: true, booking };
}

export function getBookings(): TicketBooking[] {
  return bookingsStore;
}

export function getBookingByReference(reference: string): TicketBooking | undefined {
  return bookingsStore.find((b) => b.reference === reference);
}

export function getBookingById(id: string): TicketBooking | undefined {
  return bookingsStore.find((b) => b.id === id);
}
