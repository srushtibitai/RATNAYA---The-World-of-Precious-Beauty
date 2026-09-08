import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export function LogoIntroSplash({ onFinish }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 4-second timer (4,000ms) with progress ticks every 40ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2.5;
      });
    }, 100);

    const timer = setTimeout(() => {
      handleComplete();
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const handleComplete = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 800);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#0A0A0A] text-white flex flex-col items-center justify-between p-6 sm:p-10 overflow-hidden transition-all duration-800 ease-out select-none ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Luxury Jewellery Video (No Spinning Logo in Video) */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-50">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover filter brightness-90 contrast-110"
        >
          <source src="/assets/jewellery/video/singup.mp4" type="video/mp4" />
          <source src="/assets/jewellery/video/login.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/90" />
      </div>

      {/* Top Header Tag */}
      <div className="relative z-10 w-full flex justify-between items-center text-xs tracking-[0.28em] uppercase text-gold-light font-semibold pt-2">
        <span className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-gold animate-pulse" /> RATNAYA LUXURY ATELIER
        </span>
        <span className="hidden sm:inline">HIGH JEWELLERY MARKETPLACE</span>
      </div>

      {/* Centerpiece Container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto py-6 max-w-xl">
        
        {/* Animated Rotating Golden Ring around Transparent Logo (No Background Fill) */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center mb-6 animate-zoom-in">
          {/* Outer Spinning Golden Dashed Orbit Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#C5A059] animate-[spin_10s_linear_infinite] opacity-85 shadow-[0_0_25px_rgba(197,160,89,0.4)]" />
          
          {/* Inner Counter-Rotating Thin Gold Ring */}
          <div className="absolute inset-2.5 rounded-full border border-solid border-[#E5C888]/60 animate-[spin_7s_linear_infinite_reverse]" />
          
          {/* Soft Golden Glow Aura (Transparent, No Solid Fill) */}
          <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-[#C5A059]/25 via-transparent to-[#E5C888]/15 blur-lg animate-pulse" />

          {/* Clean Transparent Logo Image (No White Circle / No Background Box) */}
          <div className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center p-2 bg-transparent">
            <img
              src="/assets/logo.png"
              alt="Ratnaya Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] drop-shadow-[0_0_20px_rgba(197,160,89,0.5)]"
            />
          </div>
        </div>

        {/* Brand Name in Glowing Metallic Gold */}
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl tracking-[0.35em] uppercase font-normal mb-2 text-[#C5A059] drop-shadow-lg animate-fade-in-up">
          RATNAYA
        </h1>

        {/* Gold Accent Line */}
        <div className="w-28 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent my-3" />

        {/* Subtitle */}
        <p className="font-serif-italic text-xl sm:text-2xl text-[#E5C888] tracking-wide font-normal animate-fade-in-up delay-100">
          The World of Precious Beauty
        </p>
      </div>

      {/* Bottom Progress Bar (4 Seconds) & Skip Button */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-4 pb-4">
        <div className="w-full bg-white/20 h-[3px] rounded-full overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-[#9A7B3E] via-[#C5A059] to-[#E5C888] h-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-full text-xs text-gold-light">
          <span className="font-mono text-[0.7rem] font-semibold">{Math.round(progress)}% LOADED</span>
          <button
            onClick={handleComplete}
            className="text-xs text-white hover:text-gold tracking-widest uppercase font-semibold flex items-center gap-1.5 bg-transparent border-none cursor-pointer transition-colors"
          >
            <span>ENTER WEBSITE</span> <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
