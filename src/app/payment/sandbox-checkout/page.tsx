'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, CheckCircle2, Lock, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { formatBDT } from '@/lib/fareCalculator';

function SandboxCheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useLanguage();

  const bookingId = searchParams.get('bookingId') || '';
  const provider = searchParams.get('provider') || 'bkash';
  const amount = Number(searchParams.get('amount')) || 40;
  const reference = searchParams.get('ref') || 'MP-DEMO';

  const [simulatedAccount] = useState('018XXXXXXXX (স্যান্ডবক্স অ্যাকাউন্ট)');
  const [trxId] = useState(`TXN-${Date.now().toString().slice(-6)}`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const providerNames: Record<string, { nameBn: string; color: string; badgeColor: string }> = {
    bkash: {
      nameBn: 'বিকাশ পেমেন্ট গেটওয়ে (স্যান্ডবক্স)',
      color: 'bg-pink-600',
      badgeColor: 'text-pink-600 bg-pink-50',
    },
    nagad: {
      nameBn: 'নগদ অনলাইন গেটওয়ে (স্যান্ডবক্স)',
      color: 'bg-orange-600',
      badgeColor: 'text-orange-600 bg-orange-50',
    },
    rocket: {
      nameBn: 'রকেট / ডিবিবিএল গেটওয়ে (স্যান্ডবক্স)',
      color: 'bg-purple-600',
      badgeColor: 'text-purple-600 bg-purple-50',
    },
  };

  const currentProvider = providerNames[provider] || providerNames.bkash;

  const handleSimulatePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          trxId,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirect to confirmed ticket pass
        router.push(`/tickets?ref=${reference}`);
      } else {
        setError(data.error || 'পেমেন্ট যাচাইকরণ ব্যর্থ হয়েছে।');
      }
    } catch {
      setError('সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12 space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{language === 'bn' ? 'আসন নির্বাচনে ফিরে যান' : 'Back to seat selection'}</span>
      </button>

      {/* Checkout Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden">
        {/* Top Provider Header */}
        <div className={`${currentProvider.color} p-6 text-white text-center space-y-1`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm">
            <Lock className="w-3 h-3" />
            <span>নিরাপদ স্যান্ডবক্স পরিবেশ</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight mt-1">
            {currentProvider.nameBn}
          </h2>
          <p className="text-xs text-white/80">মার্চেন্ট: মেট্রো প্রভাতী ট্রান্সপোর্ট সার্ভিসেস</p>
        </div>

        {/* Invoice Summary */}
        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>ইনভয়েস রেফারেন্স:</span>
              <span className="font-mono font-bold text-slate-800">{reference}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>সিমুলেটেড একাউন্ট:</span>
              <span className="font-mono text-slate-700">{simulatedAccount}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>স্যান্ডবক্স ট্রানজেকশন আইডি:</span>
              <span className="font-mono text-slate-700">{trxId}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase">মোট পরিশোধযোগ্য:</span>
              <span className="text-2xl font-black text-slate-900 font-mono">
                {formatBDT(amount)}
              </span>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              নিরাপত্তা নীতি: মেট্রো প্রভাতী কখনোই আপনার ওয়ালেট পিন বা ওটিপি জানতে চায় না। এটি একটি নিরাপদ স্যান্ডবক্স টেস্ট মোড।
            </p>
          </div>

          {/* Simulate Action */}
          <div className="space-y-3">
            <button
              onClick={handleSimulatePayment}
              disabled={loading}
              className={`w-full py-4 ${currentProvider.color} hover:opacity-95 text-white font-extrabold text-sm rounded-xl transition shadow-lg active:scale-95 flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>পেমেন্ট যাচাই করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>স্যান্ডবক্স পেমেন্ট নিশ্চিত করুন ({formatBDT(amount)})</span>
                </>
              )}
            </button>

            <button
              onClick={() => router.push('/tickets')}
              disabled={loading}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              বাতিল করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SandboxCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto" />
        </div>
      }
    >
      <SandboxCheckoutContent />
    </Suspense>
  );
}
