import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          গোপনীয়তা নীতি (Privacy Policy)
        </h1>
        <p className="text-xs text-slate-500">সর্বশেষ সংস্করণ: অক্টোবর ২০২৬</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h3 className="font-bold text-slate-900 text-base">১. চালক ও স্টাফদের জিপিএস তথ্য সুরক্ষা</h3>
          <p>
            মেট্রো প্রভাতী প্ল্যাটফর্ম চালকদের ব্রাউজার বা অন-ডিউটি ডিভাইস থেকে শুধুমাত্র তখনই জিপিএস লোকেশন সংগ্রহ করে যখন তিনি সক্রিয় ডিউটিতে থাকেন। চালকের ব্যক্তিগত ফোন নম্বর বা ব্যক্তিগত অবস্থান কখনো জনসম্মুখে উন্মুক্ত করা হয় না। অফ-ডিউটি হওয়া মাত্রই ট্র্যাকিং সম্পূর্ণরূপে বন্ধ হয়ে যায়।
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-slate-900 text-base">২. যাত্রীর তথ্য ও পেমেন্ট নিরাপত্তা</h3>
          <p>
            টিকিট বুকিংয়ের জন্য সংগৃহীত মোবাইল নম্বর ও নাম শুধুমাত্র টিকিট যাচাই এবং জরুরি নোটিফিকেশনের কাজে ব্যবহৃত হয়। আমরা কখনোই কোনো তৃতীয় পক্ষের কাছে তথ্য বিক্রি করি না। মেট্রো প্রভাতী কখনোই গ্রাহকের ব্যাংক পিন, ওটিপি বা পাসওয়ার্ড চায় না।
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-slate-900 text-base">৩. মোবাইল ব্রাউজার কুকিজ ও সেশন</h3>
          <p>
            আসন ৫ মিনিটের অস্থায়ী হোল্ড এবং ভাষা পছন্দের সেটিংস কার্যকর রাখতে ব্রাউজারের লোকাল স্টোরেজ ও সেশন ব্যবহৃত হয়।
          </p>
        </section>
      </div>
    </div>
  );
}
