import type { Metadata, Viewport } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingCallWidget } from '@/components/FloatingCallWidget';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { ServiceAlertsBanner } from '@/components/ServiceAlertsBanner';

export const metadata: Metadata = {
  title: 'মেট্রো প্রভাতী | Metro Probati — Chattogram Transit Service',
  description:
    'কাপ্তাই রাস্তার মাথা ↔ কাঠগড় করিডোরে পরিচালিত চট্টগ্রাম নগরীর আধুনিক ডিজিটাল বাস সার্ভিস। লাইভ ট্র্যাকিং, আসন বুকিং, কাউন্টার ডিরেক্টরি ও স্বচ্ছ ভাড়া।',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: '/logo.png',
    shortcut: '/favicon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#dc2626',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-red-600 selection:text-white">
        <LanguageProvider>
          <AuthProvider>
            <ServiceAlertsBanner />
            <Navbar />
            <main className="flex-grow pb-14 md:pb-0">{children}</main>
            <FloatingCallWidget />
            <MobileBottomNav />
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
