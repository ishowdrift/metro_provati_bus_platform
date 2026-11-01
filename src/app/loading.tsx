import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-[#dc2626] flex flex-col items-center justify-center p-4 select-none">
      {/* Smooth zoom-out logo that stops cleanly */}
      <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-white shadow-2xl flex items-center justify-center p-3.5 border-4 border-white animate-logo-zoom-out">
        <Image
          src="/logo.png"
          alt="Metro Probati"
          width={160}
          height={160}
          className="w-full h-full object-contain rounded-full"
          priority
        />
      </div>

      {/* Lightweight subtle pulse dots */}
      <div className="mt-5 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-white/90 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/90 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/90 animate-bounce" />
      </div>
    </div>
  );
}
