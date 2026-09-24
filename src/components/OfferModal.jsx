import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Copy, Check, ArrowRight, Gift, Clock, ShieldCheck, Tag } from 'lucide-react';
import { api, getImageUrl } from '../services/api';

export function OfferModal({ isOpen, onClose, onNavigateShop }) {
  const [copied, setCopied] = useState(false);
  const [offerData, setOfferData] = useState({
    code: 'ROYAL15',
    eyebrow: 'WELCOME PATRON OFFER',
    title: 'Unlock Your Exclusive Royal Discount',
    discount: 'FLAT 15% OFF',
    subtitle: 'Enjoy an extra 15% OFF + Free Insured Shipping across India on your order today!',
    image: '/assets/jewellery/necklace/1.jpg',
    expiresAt: Date.now() + 15 * 60 * 1000
  });

  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 59 });
  const expiresAtRef = useRef(offerData.expiresAt);

  // Fetch offer data and synchronized server expiry from Backend API
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    async function loadServerOffer() {
      try {
        const res = await api.getWelcomeOffer();
        if (isMounted && res && res.success) {
          setOfferData({
            code: res.code || 'ROYAL15',
            eyebrow: res.eyebrow || 'WELCOME PATRON OFFER',
            title: res.title || 'Unlock Your Exclusive Royal Discount',
            discount: res.discount || 'FLAT 15% OFF',
            subtitle: res.subtitle || 'Enjoy an extra 15% OFF + Free Insured Shipping across India on your order today!',
            image: res.image || '/assets/jewellery/necklace/1.jpg',
            expiresAt: res.expiresAt || (Date.now() + 15 * 60 * 1000)
          });
          expiresAtRef.current = res.expiresAt || (Date.now() + 15 * 60 * 1000);
        }
      } catch (err) {
        console.warn('Welcome Offer API load notice:', err);
      }
    }

    loadServerOffer();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Synchronized countdown timer calculating exact remaining time until server expiresAt
  useEffect(() => {
    if (!isOpen) return;

    const updateTimer = () => {
      const now = Date.now();
      const targetTime = expiresAtRef.current || (now + 15 * 60 * 1000);
      const remainingMs = Math.max(0, targetTime - now);
      const remainingSec = Math.floor(remainingMs / 1000);

      const mins = Math.floor(remainingSec / 60);
      const secs = remainingSec % 60;
      setTimeLeft({ minutes: mins, seconds: secs });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [isOpen, offerData.expiresAt]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(offerData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleClaimOffer = () => {
    handleCopyCode();
    onClose();
    if (onNavigateShop) {
      onNavigateShop();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[300] flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Modal Container */}
      <div className="w-full max-w-3xl bg-[#FAF6F0] rounded-lg overflow-hidden shadow-2xl border border-gold/50 relative grid grid-cols-1 md:grid-cols-[280px_1fr] max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white/90 text-gray-700 flex items-center justify-center shadow-md hover:bg-gold-dark hover:text-white transition-all border-none cursor-pointer"
          aria-label="Close offer modal"
        >
          <X size={18} />
        </button>

        {/* Left Banner Image */}
        <div className="relative bg-amber-950 min-h-[220px] md:min-h-full flex items-center justify-center overflow-hidden">
          <img
            src={getImageUrl(offerData.image)}
            alt="Royal Offer Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-950 via-amber-950/40 to-transparent" />
          
          {/* Badge Overlay */}
          <div className="relative z-10 p-6 text-center text-white flex flex-col items-center">
            <span className="w-12 h-12 rounded-full bg-gold/30 border border-gold/60 backdrop-blur-md flex items-center justify-center text-gold-light mb-3 shadow-lg animate-bounce">
              <Gift size={24} />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gold-light bg-black/50 px-2.5 py-1 rounded-full border border-gold/30 backdrop-blur-sm">
              LIMITED TIME GIFT
            </span>
            <h3 className="font-heading text-2xl text-gold-light mt-2 mb-1">{offerData.discount}</h3>
            <p className="text-xs text-amber-100/90 font-light">On All Royal Kundan & Emerald Collections</p>
          </div>
        </div>

        {/* Right Content Form */}
        <div className="p-6 sm:p-8 flex flex-col justify-between relative bg-[#FAF6F0]">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gold/15 text-gold-dark">
                <Sparkles size={14} />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-gold-dark">
                {offerData.eyebrow}
              </span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl text-gray-900 mb-2">
              {offerData.title}
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5">
              {offerData.subtitle}
            </p>

            {/* Coupon Code Container */}
            <div className="bg-white border-2 border-dashed border-gold/60 p-3.5 rounded-lg flex items-center justify-between gap-3 shadow-sm mb-5">
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-semibold block">Use Promo Code At Checkout:</span>
                <span className="text-lg font-mono font-bold text-amber-950 tracking-wider flex items-center gap-1.5">
                  <Tag size={16} className="text-gold-dark" />
                  {offerData.code}
                </span>
              </div>

              <button
                onClick={handleCopyCode}
                className={`px-4 py-2 rounded text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  copied
                    ? 'bg-emerald-700 text-white'
                    : 'bg-gold-dark text-white hover:bg-amber-900 shadow-sm'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={14} /> COPIED!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> COPY CODE
                  </>
                )}
              </button>
            </div>

            {/* Urgency Countdown Bar Synced with Backend */}
            <div className="flex items-center justify-between text-xs text-amber-900 bg-amber-50 p-2.5 rounded border border-amber-200/80 mb-6">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock size={15} className="text-gold-dark" /> Special Offer Expires In:
              </span>
              <span className="font-mono font-bold text-amber-950 bg-white px-2 py-0.5 rounded border border-amber-300">
                {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div>
            <button
              onClick={handleClaimOffer}
              className="btn-gold w-full py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer mb-3"
            >
              <Sparkles size={16} /> SHOP NOW & CLAIM 15% OFF <ArrowRight size={16} />
            </button>

            <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
              <span className="flex items-center gap-1 text-emerald-800 font-medium">
                <ShieldCheck size={13} /> 100% BIS Hallmarked Gold
              </span>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 underline bg-transparent border-none cursor-pointer"
              >
                No thanks, I'll pay full price
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
