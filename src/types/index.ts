export type Language = 'bn' | 'en';

export type UserRole =
  | 'super_admin'
  | 'operations_admin'
  | 'counter_manager'
  | 'counter_representative'
  | 'bus_supervisor'
  | 'driver'
  | 'passenger';

export type RouteDirection = 'kaptai_to_patenga' | 'patenga_to_kaptai';

export type GpsFreshness = 'active' | 'stale' | 'unavailable';

export type SeatState = 'available' | 'held' | 'booked' | 'blocked';

export interface BusSeat {
  id: string;
  seatNumber: string;
  row: number;
  col: number; // 1, 2, 3, 4 (with col 2-3 having aisle gap)
  status: SeatState;
  isWomenReserved?: boolean;
  side?: 'left' | 'right' | 'rear' | 'front_women';
  heldExpiresAt?: string; // ISO string for temporary reservation countdown
  heldBySessionId?: string;
}

export interface StandingCapacity {
  approvedCapacity: number;
  reservedCount: number;
  isEnabled: boolean;
}

export interface RouteStop {
  id: string;
  nameBn: string;
  nameEn: string;
  lat: number;
  lng: number;
  sequence: number; // 1 to 11
  isTerminal: boolean;
  boothAvailable: boolean;
  boothNameBn?: string;
  boothNameEn?: string;
  phoneVerificationStatus: 'verified' | 'unverified' | 'pending';
  phone?: string;
  addressBn?: string;
  addressEn?: string;
}

export interface CounterBooth {
  id: string;
  nameBn: string;
  nameEn: string;
  stopId: string;
  stopNameBn: string;
  addressBn: string;
  addressEn: string;
  lat: number;
  lng: number;
  openingHours: string;
  phone: string;
  isPhoneVerified: boolean;
  assignedStaff: string[];
  isActive: boolean;
}

export interface Route {
  id: string;
  code: string;
  nameBn: string;
  nameEn: string;
  descriptionBn: string;
  descriptionEn: string;
  corridorBn: string;
  corridorEn: string;
  stops: RouteStop[];
  approximateDistanceKm: number;
  estimatedDurationMins: number;
  fareMinBDT: number;
  fareMaxBDT: number;
  isOfficialScheduleVerified: boolean;
  notesBn: string;
  notesEn: string;
}

export interface Bus {
  id: string;
  registrationNumberBn: string;
  registrationNumberEn: string;
  status: 'on_duty' | 'idle' | 'maintenance' | 'offline';
  routeId: string;
  direction: RouteDirection;
  currentLat: number;
  currentLng: number;
  speedKmh: number;
  heading: number;
  lastUpdated: string; // ISO string
  freshness: GpsFreshness;
  driverNameBn: string;
  driverNameEn: string;
  driverPhone?: string;
  showDriverPhonePublic: boolean;
  supervisorNameBn?: string;
  supervisorPhone?: string;
  batteryLevel?: number;
  networkStatus?: 'online' | 'offline';
  modelBn: string;
  modelEn: string;
  seatCount: number;
  standingCapacity: StandingCapacity;
  isLiveSharing?: boolean;
  nearestStopNameBn?: string;
  nearestStopNameEn?: string;
  lastKnownStopNameBn?: string;
  lastKnownStopNameEn?: string;
}

export interface FareCalculationResult {
  fromStop: RouteStop;
  toStop: RouteStop;
  stagesCount: number;
  estimatedDistanceKm: number;
  fareBDT: number;
  isIndicative: boolean;
  disclaimerBn: string;
  disclaimerEn: string;
}

export interface TicketBooking {
  id: string;
  reference: string;
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
  passengerCount: number;
  farePerPersonBDT: number;
  totalFareBDT: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'used';
  paymentStatus: 'paid' | 'unpaid' | 'sandbox_paid' | 'refunded';
  paymentMethod?: 'bkash' | 'nagad' | 'rocket' | 'cash_at_counter';
  paymentTrxId?: string;
  createdAt: string;
  qrVerificationToken: string;
  counterId?: string;
  busId?: string;
  isStudentDiscount?: boolean;
  discountAmountBDT?: number;
  isPilotDemo: boolean;
}

export interface ServiceAlert {
  id: string;
  titleBn: string;
  titleEn: string;
  messageBn: string;
  messageEn: string;
  severity: 'info' | 'warning' | 'alert';
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface IncidentReport {
  id: string;
  category: 'overcrowding' | 'delay' | 'driver_behavior' | 'lost_item' | 'counter_issue' | 'other';
  title: string;
  description: string;
  busNumber?: string;
  stopName?: string;
  contactPhone?: string;
  status: 'pending' | 'investigating' | 'resolved';
  createdAt: string;
  notes?: string;
}

export interface PaymentGatewayConfig {
  provider: 'bkash' | 'nagad' | 'rocket';
  name: string;
  isConfigured: boolean;
  isSandbox: boolean;
  notes: string;
}

export interface HelplineSetting {
  primaryNumber: string;
  primaryLabelBn: string;
  primaryLabelEn: string;
  secondaryNumber: string;
  secondaryLabelBn: string;
  secondaryLabelEn: string;
  whatsappNumber?: string;
  showWhatsapp: boolean;
}
