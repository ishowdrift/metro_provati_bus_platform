import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          ব্যবহারের শর্তাবলী (Terms of Service)
        </h1>
        <p className="text-xs text-slate-500">সর্বশেষ সংস্করণ: অক্টোবর ২০২৬</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h3 className="font-bold text-slate-900 text-base">১. সেবার আওতা ও খসড়া তথ্যাদি</h3>
          <p>
            মেট্রো প্রভাতী কাপ্তাই রাস্তার মাথা থেকে কাঠগড় করিডোরে পরিচালিত এক্সপ্রেস বাস সেবা। ওয়েবসাইটে প্রদর্শিত ভাড়া (১৫–৬৫ টাকা পরিধি; যেমন: বহদ্দারহাট থেকে কেইপিজেড ৫৫ টাকা), সময়সূচি এবং কাউন্টার তালিকা প্রাথমিক নির্দেশক খসড়া। কর্তৃপক্ষ প্রয়োজন অনুসারে রুট ও ভাড়া সমন্বয় করতে পারে।
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-slate-900 text-base">২. আসন সংরক্ষণ ও রিফান্ড নীতি</h3>
          <p>
            আসন নির্বাচনের পর ৫ মিনিটের মধ্যে পেমেন্ট অথবা কাউন্টার কনফার্মেশন সম্পন্ন না হলে আসন অবমুক্ত হয়ে যাবে। কোনো ট্রিপ বাতিল হলে বা অনাকাঙ্ক্ষিত কারণে বাস বিকল হলে টিকিটের সমপরিমাণ অর্থ কাউন্টার থেকে ফেরত পাওয়া যাবে অথবা পরবর্তী ট্রিপে সমন্বয় করা হবে।
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-slate-900 text-base">৩. যাত্রীর আচরণ ও ১৫ জন স্ট্যান্ডিং সীমা</h3>
          <p>
            যাত্রীদের নিরাপত্তা ও বাসের শৃঙ্খলা রক্ষার্থে প্রতিটি বাসে সর্বোচ্চ ১৫ জন নিয়ন্ত্রিত স্ট্যান্ডিং যাত্রী অনুমোদন করা হয়। বাসের ভেতরে ধূমপান বা কোনো বিপজ্জনক দ্রব্য পরিবহন সম্পূর্ণ নিষিদ্ধ।
          </p>
        </section>
      </div>
    </div>
  );
}
