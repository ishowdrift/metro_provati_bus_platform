import type { Metadata, Viewport } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingCallWidget } from '@/components/FloatingCallWidget';
import { MobileBottomNav } from '@/components/MobileBottomNav';

export const metadata: Metadata = {
  metadataBase: new URL('https://metroprovatibusplatform.vercel.app'),
  title: {
    default: 'মেট্রো প্রভাতী | Metro Probati — Chattogram Digital Transit Service',
    template: '%s | Metro Probati',
  },
  description:
    'কাপ্তাই রাস্তার মাথা ↔ কাঠগড় করিডোরের রুট তথ্য, নির্দেশক ভাড়া হিসাব, কাউন্টার ডিরেক্টরি ও যাত্রীসেবা।',
  keywords: [
    'Metro Probati',
    'মেট্রো প্রভাতী',
    'Chattogram bus',
    'চট্টগ্রাম বাস',
    'Kaptai to Katgor',
    'Live bus tracking Chattogram',
    'Bahaddarhat bus',
    'GEC bus',
    'Agrabad bus',
    'EPZ bus',
  ],
  authors: [{ name: 'Metro Probati Digital Team' }],
  creator: 'Metro Probati',
  publisher: 'Metro Probati Transit Network',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: '/logo.png',
    shortcut: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    alternateLocale: 'en_US',
    url: 'https://metroprovatibusplatform.vercel.app',
    title: 'মেট্রো প্রভাতী | Metro Probati — Chattogram Express Transit',
    description:
      'কাপ্তাই রাস্তার মাথা ↔ কাঠগড় করিডোরের রুট তথ্য, নির্দেশক ভাড়া হিসাব ও যাত্রীসেবা।',
    siteName: 'Metro Probati Transit',
    images: [
      {
        url: '/images/bus-1.jpg',
        width: 1200,
        height: 630,
        alt: 'মেট্রো প্রভাতী এক্সপ্রেস বাস বহর — চট্টগ্রাম নগরী',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'মেট্রো প্রভাতী | Metro Probati — Chattogram Transit Service',
    description:
      'কাপ্তাই রাস্তার মাথা ↔ কাঠগড় করিডোরের রুট তথ্য, নির্দেশক ভাড়া হিসাব ও যাত্রীসেবা।',
    images: ['/images/bus-1.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#D52B35',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="min-h-screen flex flex-col bg-[#F1EEE8] text-[#272524] selection:bg-[#C92232] selection:text-white">
        <LanguageProvider>
          <AuthProvider>
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
