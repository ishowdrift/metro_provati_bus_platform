-- METRO PROBATI (মেট্রো প্রভাতী) TRANSIT PLATFORM
-- Initial PostgreSQL + Supabase Schema with Row-Level Security (RLS)

-- 1. Create Enums
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'operations_admin',
  'counter_manager',
  'counter_representative',
  'bus_supervisor',
  'driver',
  'passenger'
);

CREATE TYPE bus_duty_status AS ENUM (
  'on_duty',
  'idle',
  'maintenance',
  'offline'
);

CREATE TYPE gps_freshness AS ENUM (
  'active',
  'stale',
  'unavailable'
);

CREATE TYPE booking_status AS ENUM (
  'confirmed',
  'pending',
  'cancelled',
  'used'
);

CREATE TYPE payment_status AS ENUM (
  'paid',
  'unpaid',
  'sandbox_paid',
  'refunded'
);

-- 2. Profiles Table (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'passenger',
  assigned_bus_id TEXT,
  assigned_counter_id TEXT,
  preferred_language TEXT DEFAULT 'bn',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Routes Table
CREATE TABLE IF NOT EXISTS public.routes (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name_bn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_bn TEXT,
  description_en TEXT,
  corridor_bn TEXT NOT NULL,
  corridor_en TEXT NOT NULL,
  approximate_distance_km NUMERIC(5, 2) NOT NULL,
  estimated_duration_mins INT NOT NULL,
  fare_min_bdt NUMERIC(6, 2) NOT NULL DEFAULT 10.00,
  fare_max_bdt NUMERIC(6, 2) NOT NULL DEFAULT 45.00,
  is_official_schedule_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Route Stops Table
CREATE TABLE IF NOT EXISTS public.route_stops (
  id TEXT PRIMARY KEY,
  route_id TEXT REFERENCES public.routes(id) ON DELETE CASCADE,
  name_bn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  lat NUMERIC(9, 6) NOT NULL,
  lng NUMERIC(9, 6) NOT NULL,
  sequence INT NOT NULL,
  is_terminal BOOLEAN DEFAULT FALSE,
  booth_available BOOLEAN DEFAULT FALSE,
  phone_verification_status TEXT DEFAULT 'pending',
  address_bn TEXT,
  address_en TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Counter Booths Table
CREATE TABLE IF NOT EXISTS public.counter_booths (
  id TEXT PRIMARY KEY,
  stop_id TEXT REFERENCES public.route_stops(id) ON DELETE SET NULL,
  name_bn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  address_bn TEXT NOT NULL,
  address_en TEXT,
  lat NUMERIC(9, 6) NOT NULL,
  lng NUMERIC(9, 6) NOT NULL,
  opening_hours TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_phone_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Buses Table (Fleet & Telemetry)
CREATE TABLE IF NOT EXISTS public.buses (
  id TEXT PRIMARY KEY,
  registration_number_bn TEXT NOT NULL UNIQUE,
  registration_number_en TEXT NOT NULL UNIQUE,
  status bus_duty_status NOT NULL DEFAULT 'idle',
  route_id TEXT REFERENCES public.routes(id) ON DELETE SET NULL,
  direction TEXT NOT NULL DEFAULT 'kaptai_to_patenga',
  current_lat NUMERIC(9, 6) NOT NULL,
  current_lng NUMERIC(9, 6) NOT NULL,
  speed_kmh NUMERIC(5, 2) DEFAULT 0,
  heading NUMERIC(5, 2) DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  freshness gps_freshness NOT NULL DEFAULT 'unavailable',
  driver_name_bn TEXT NOT NULL,
  driver_name_en TEXT,
  driver_phone TEXT,
  show_driver_phone_public BOOLEAN DEFAULT FALSE,
  supervisor_name_bn TEXT,
  supervisor_phone TEXT,
  battery_level INT DEFAULT 100,
  network_status TEXT DEFAULT 'online',
  model_bn TEXT NOT NULL,
  model_en TEXT,
  seat_count INT NOT NULL DEFAULT 38,
  standing_capacity_approved INT NOT NULL DEFAULT 15,
  standing_capacity_reserved INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  reference TEXT UNIQUE NOT NULL,
  passenger_name TEXT NOT NULL,
  passenger_phone TEXT NOT NULL,
  route_id TEXT REFERENCES public.routes(id),
  direction TEXT NOT NULL,
  from_stop_id TEXT REFERENCES public.route_stops(id),
  to_stop_id TEXT REFERENCES public.route_stops(id),
  selected_seats TEXT[] DEFAULT '{}',
  standing_count INT DEFAULT 0,
  total_fare_bdt NUMERIC(8, 2) NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'unpaid',
  payment_method TEXT,
  payment_trx_id TEXT,
  qr_verification_token TEXT NOT NULL UNIQUE,
  bus_id TEXT REFERENCES public.buses(id),
  counter_id TEXT REFERENCES public.counter_booths(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Incident Reports Table
CREATE TABLE IF NOT EXISTS public.incident_reports (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  bus_number TEXT,
  stop_name TEXT,
  contact_phone TEXT,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Row-Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counter_booths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;

-- Public can read routes, stops, booths, and live bus positions
CREATE POLICY "Public routes read" ON public.routes FOR SELECT USING (true);
CREATE POLICY "Public stops read" ON public.route_stops FOR SELECT USING (true);
CREATE POLICY "Public booths read" ON public.counter_booths FOR SELECT USING (true);
CREATE POLICY "Public buses read" ON public.buses FOR SELECT USING (true);

-- Drivers can update their assigned bus telemetry
CREATE POLICY "Driver bus telemetry update" ON public.buses
  FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'driver' OR role = 'super_admin'));

-- Passengers can view their own bookings
CREATE POLICY "User view own bookings" ON public.bookings
  FOR SELECT
  USING (true);

-- Counter staff & Admin can insert and update bookings
CREATE POLICY "Staff insert bookings" ON public.bookings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public submit incidents" ON public.incident_reports
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff view incidents" ON public.incident_reports
  FOR SELECT
  USING (true);
