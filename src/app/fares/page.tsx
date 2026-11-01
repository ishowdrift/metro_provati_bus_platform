'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FareCalculatorCard } from '@/components/FareCalculatorCard';
import { INITIAL_STOPS } from '@/data/mockData';
import { calculateFare, formatBDT, toBengaliDigits } from '@/lib/fareCalculator';
import { useLanguage } from '@/context/LanguageContext';
import { Table, Calculator, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function FaresPage() {
  const { language } = useLanguage();
  const [selectedOrigin, setSelectedOrigin] = useState<string>('stop-1');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
          {language === 'bn' ? 'স্বচ্ছ ও সাশ্রয়ী ভাড়া' : 'Transparent Fare Schedule'}
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-1">
          {language === 'bn' ? 'মেট্রো প্রভাতী ভাড়া তালিকা ও স্টেজ ম্যাট্রিক্স' : 'Metro Probati Fares & Stage Matrix'}
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-3xl">
          {language === 'bn'
            ? 'কাপ্তাই রাস্তার মাথা থেকে কাঠগড় করিডোরের দূরত্ব ভিত্তিক খসড়া পর্যায় এবং ভাড়ার তালিকা।'
            : 'Distance-based draft stage tariffs and indicative fares across the Kaptai to Katgor transit corridor.'}
        </p>
      </div>

      {/* Interactive Calculator Section */}
      <div className="max-w-3xl mx-auto">
        <FareCalculatorCard />
      </div>

      {/* Fare Stage Breakdown Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">
              {language === 'bn' ? 'স্টেজ ভিত্তিক অনুমোদিত খসড়া হার' : 'Stage Tariff Scale'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'bn'
                ? 'ন্যূনতম ভাড়া ১৫ টাকা; সর্বোচ্চ ৬৫ টাকা (বহদ্দারহাট ↔ কেইপিজেড ৫৫ টাকা, কেইপিজেড ↔ আগ্রাবাদ ৩৫ টাকা)'
                : 'Min Fare ৳15; Max ৳65 (Bahaddarhat ↔ KEPZ ৳55, KEPZ ↔ Agrabad ৳35)'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600">
              {language === 'bn' ? 'প্রারম্ভিক স্টপ নির্বাচন:' : 'View From Origin:'}
            </label>
            <select
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {INITIAL_STOPS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.sequence}. {language === 'bn' ? s.nameBn : s.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Matrix from Selected Origin */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">{language === 'bn' ? 'গন্তব্য স্টপেজ' : 'Destination'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'স্টেজ সংখ্যা' : 'Stages'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'আনুমানিক দূরত্ব' : 'Est. Distance'}</th>
                <th className="py-3 px-4">{language === 'bn' ? 'ভাড়া (খসড়া)' : 'Fare (Draft)'}</th>
                <th className="py-3 px-4 text-right">{language === 'bn' ? 'বুকিং' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {INITIAL_STOPS.map((destStop) => {
                const fare = calculateFare(selectedOrigin, destStop.id);
                if (!fare) return null;

                const isSame = selectedOrigin === destStop.id;

                return (
                  <tr
                    key={destStop.id}
                    className={`hover:bg-red-50/40 transition ${isSame ? 'bg-slate-50/60 opacity-60' : ''}`}
                  >
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {toBengaliDigits(destStop.sequence)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {language === 'bn' ? destStop.nameBn : destStop.nameEn}
                      {destStop.isTerminal && (
                        <span className="ml-2 text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold">
                          {language === 'bn' ? 'টার্মিনাল' : 'Terminal'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {toBengaliDigits(fare.stagesCount)} {language === 'bn' ? 'টি' : ''}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {toBengaliDigits(fare.estimatedDistanceKm)} কিমি
                    </td>
                    <td className="py-3 px-4 font-mono font-extrabold text-red-600">
                      {isSame ? '—' : formatBDT(fare.fareBDT)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {!isSame && (
                        <Link
                          href={`/tickets?from=${selectedOrigin}&to=${destStop.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition shadow-xs"
                        >
                          <span>{language === 'bn' ? 'টিকেট' : 'Book'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Ratification Disclaimer */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-300 text-xs text-amber-900 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-bold">
            {language === 'bn' ? 'ভাড়া তালিকা সম্পর্কিত গুরুত্বপূর্ণ সতর্কতা' : 'Important Fare Policy Notice'}
          </h5>
          <p className="leading-relaxed">
            {language === 'bn'
              ? 'উক্ত ভাড়া তালিকা ও স্টেজ হিসাব ১৫–৬৫ টাকার হালনাগাদকৃত নির্দেশক খসড়া (যেমন: বহদ্দারহাট থেকে কেইপিজেড ৫৫ টাকা)। মেট্রো প্রভাতী বাস মালিক কর্তৃপক্ষ এবং বিআরটিএ-এর অনুমোদিত চূড়ান্ত কাউন্টার তালিকা অচিরেই প্রকাশ করা হবে। কোনো কাউন্টার অতিরিক্ত ভাড়া দাবি করলে আমাদের হেল্পলাইনে (০১৭৯৮৫৪২৪৬৯) রিপোর্ট করুন।'
              : 'This fare matrix is a pilot draft representing the updated ৳15–৳65 tariff structure (e.g. Bahaddarhat to KEPZ ৳55). Official ratified fares will take effect following BRTA and operator publication. Report any fare irregularities to our helpline (01798542469).'}
          </p>
        </div>
      </div>
    </div>
  );
}
