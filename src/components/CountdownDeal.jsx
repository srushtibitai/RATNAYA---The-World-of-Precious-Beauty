import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';

export function CountdownDeal({ onNavigateShop }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 18,
    minutes: 42,
    seconds: 15
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-[#111111] text-white relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=2000')`
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <span className="text-xs sm:text-sm tracking-[0.25em] uppercase text-gold font-semibold flex items-center gap-2 mb-3">
              <Clock size={16} /> EXCLUSIVE FESTIVE OFFER
            </span>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4 font-normal">
              Hurry, Deals End Soon
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-8 font-light max-w-lg">
              Enjoy complimentary certified diamond upgrade and zero making charges on select 22K Kundan bridal sets.
            </p>

            {/* Countdown Box Grid */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-md mb-8">
              {[
                { label: 'DAYS', val: String(timeLeft.days).padStart(2, '0') },
                { label: 'HOURS', val: String(timeLeft.hours).padStart(2, '0') },
                { label: 'MINUTES', val: String(timeLeft.minutes).padStart(2, '0') },
                { label: 'SECONDS', val: String(timeLeft.seconds).padStart(2, '0') }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-md border border-gold/40 p-3 sm:p-4 rounded-sm text-center"
                >
                  <div className="font-heading text-xl sm:text-3xl text-[#E5C888] font-normal leading-none mb-1">
                    {item.val}
                  </div>
                  <div className="text-[0.62rem] sm:text-xs tracking-widest text-gray-400">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={onNavigateShop} className="btn-gold py-3.5 px-8 text-xs sm:text-sm">
              SHOP NOW <ArrowRight size={16} />
            </button>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-sm overflow-hidden border border-gold/40 shadow-2xl max-w-md mx-auto">
              <img
                src="/assets/jewellery/necklace/8.jpg"
                alt="Limited Festive Deal"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
