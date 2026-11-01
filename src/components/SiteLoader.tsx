'use client';

import React from 'react';
import Image from 'next/image';

interface SiteLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  text?: string;
  subtext?: string;
  className?: string;
}

export const SiteLoader: React.FC<SiteLoaderProps> = ({
  size = 'md',
  text = 'মেট্রো প্রভাতী লোড হচ্ছে...',
  subtext = 'চট্টগ্রামের নির্ভরযোগ্য ডিজিটাল বাস সেবা',
  className = '',
}) => {
  const sizeMap = {
    sm: {
      container: 'w-10 h-10',
      logo: 'w-8 h-8',
      ring: 'w-10 h-10',
      textSize: 'text-xs',
      imgPx: 32,
    },
    md: {
      container: 'w-20 h-20',
      logo: 'w-14 h-14',
      ring: 'w-20 h-20',
      textSize: 'text-sm',
      imgPx: 56,
    },
    lg: {
      container: 'w-28 h-28',
      logo: 'w-20 h-20',
      ring: 'w-28 h-28',
      textSize: 'text-base',
      imgPx: 80,
    },
    fullscreen: {
      container: 'w-32 h-32',
      logo: 'w-24 h-24',
      ring: 'w-32 h-32',
      textSize: 'text-base sm:text-lg',
      imgPx: 96,
    },
  };

  const selectedSize = sizeMap[size];

  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {/* Animated Glowing Logo with Dual Rotating Orbit Rings */}
      <div className={`relative flex items-center justify-center ${selectedSize.container}`}>
        {/* Outer glowing pulsed ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-red-400 opacity-25 blur-md animate-pulse" />

        {/* Outer rotating dashed ring */}
        <div className={`absolute inset-0 rounded-full border-2 border-dashed border-red-500/60 animate-spin [animation-duration:6s]`}></div>

        {/* Inner reverse rotating ring */}
        <div className={`absolute inset-1 rounded-full border border-t-red-600 border-r-transparent border-b-rose-400 border-l-transparent animate-spin [animation-direction:reverse] [animation-duration:3s]`}></div>

        {/* Center Logo with gentle pulse */}
        <div className={`relative ${selectedSize.logo} rounded-full overflow-hidden bg-white p-0.5 shadow-xl ring-2 ring-red-100 animate-pulse`}>
          <Image
            src="/logo.png"
            alt="মেট্রো প্রভাতী"
            width={selectedSize.imgPx}
            height={selectedSize.imgPx}
            className="w-full h-full object-contain rounded-full"
            unoptimized
          />
        </div>
      </div>

      {/* Optional Bengali / English loading title */}
      {text && (
        <div className="text-center space-y-1">
          <p className={`font-extrabold text-slate-800 tracking-tight ${selectedSize.textSize}`}>
            {text}
          </p>
          {subtext && (
            <p className="text-xs text-slate-500 font-medium">
              {subtext}
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (size === 'fullscreen') {
    return (
      <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-md flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return content;
};
