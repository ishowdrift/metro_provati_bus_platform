'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const FLEET_PHOTOS = [
  { id: 'fleet-01', image: '/images/bus-1.jpg', alt: 'Metro Probati bus photograph' },
  { id: 'fleet-02', image: '/images/bus-2.jpg', alt: 'Metro Probati bus photograph' },
  { id: 'fleet-03', image: '/images/bus-3.jpg', alt: 'Metro Probati bus photograph' },
];

export const BusCarousel: React.FC = () => {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = FLEET_PHOTOS[currentIndex];
  const total = FLEET_PHOTOS.length;

  const showPrevious = () => setCurrentIndex((index) => (index - 1 + total) % total);
  const showNext = () => setCurrentIndex((index) => (index + 1) % total);

  return (
    <section className="grid overflow-hidden border-y border-stone-300 bg-white lg:grid-cols-[1.35fr_0.65fr]">
      <div className="relative min-h-[260px] overflow-hidden bg-stone-200 sm:min-h-[390px] lg:min-h-[470px]">
        <Image
          key={current.id}
          src={current.image}
          alt={language === 'bn' ? 'মেট্রো প্রভাতী বাসের ছবি' : current.alt}
          fill
          priority={currentIndex === 0}
          sizes="(max-width: 1024px) 100vw, 65vw"
          className="object-cover object-center transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
        <div className="absolute left-5 top-5 flex items-center gap-2 bg-white px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.2em] text-stone-900 sm:left-7 sm:top-7">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C92232]" />
          <span>{language === 'bn' ? 'বহরের ছবি' : 'Fleet photography'}</span>
        </div>
        <div className="absolute bottom-5 left-5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/85 sm:bottom-7 sm:left-7">
          METRO PROBATI / {String(currentIndex + 1).padStart(2, '0')}
        </div>
        <div className="absolute bottom-4 right-4 flex items-center gap-2 sm:bottom-6 sm:right-6">
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Previous fleet photograph"
            className="flex h-10 w-10 items-center justify-center border border-white/60 bg-black/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-stone-900"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={showNext}
            aria-label="Next fleet photograph"
            className="flex h-10 w-10 items-center justify-center border border-white/60 bg-black/20 text-white backdrop-blur-sm transition hover:bg-white hover:text-stone-900"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-between px-6 py-7 sm:px-9 sm:py-10 lg:px-10 lg:py-12">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#C92232]">
            {language === 'bn' ? 'ছবি' : 'Photograph'} {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
          <h3 className="mt-5 text-3xl font-black leading-[1.08] tracking-[-0.045em] text-stone-950 sm:text-4xl">
            {language === 'bn' ? 'মেট্রো প্রভাতী' : 'Metro Probati'}
            <span className="mt-1 block text-stone-400">{language === 'bn' ? 'বাস বহর' : 'on the road'}</span>
          </h3>
          <p className="mt-5 max-w-sm text-sm leading-7 text-stone-500">
            {language === 'bn'
              ? 'মেট্রো প্রভাতীর প্রকাশিত বাসের ছবিগুলো দেখুন। নির্দিষ্ট ট্রিপে কোন বাস চলবে, আসন ও অন্যান্য সুবিধা—এসব তথ্য যাত্রার আগে কাউন্টারে নিশ্চিত করুন।'
              : 'Explore the published Metro Probati bus photographs. Confirm the vehicle assigned to your trip, seating and other service details at a counter before travelling.'}
          </p>
        </div>

        <div className="mt-10 border-t border-stone-200 pt-5">
          <div className="mb-4 flex items-center gap-2">
            {FLEET_PHOTOS.map((photo, index) => (
              <button
                type="button"
                key={photo.id}
                onClick={() => setCurrentIndex(index)}
                aria-label={'Show fleet photograph ' + (index + 1)}
                aria-current={index === currentIndex ? 'true' : undefined}
                className={'h-1.5 transition-all ' + (index === currentIndex ? 'w-10 bg-[#C92232]' : 'w-5 bg-stone-200 hover:bg-stone-400')}
              />
            ))}
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
              {language === 'bn' ? 'বাসের ছবি' : 'Fleet gallery'}
            </span>
            <Link href="/routes" className="inline-flex items-center gap-2 text-xs font-extrabold text-[#C92232] transition-colors hover:text-[#A91D2A]">
              {language === 'bn' ? 'রুট দেখুন' : 'Explore route'}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
