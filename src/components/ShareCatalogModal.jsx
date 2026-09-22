import React, { useState } from 'react';
import { api } from '../services/api';
import {
  Share2,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  MessageCircle,
  X,
  Send,
  Sparkles,
  Store,
  Package,
  Globe,
  Download
} from 'lucide-react';

export function ShareCatalogModal({ isOpen, onClose, seller, product = null, totalProducts = 0 }) {
  if (!isOpen) return null;

  const isProductShare = !!product;

  const rawImage = isProductShare
    ? ((product?.images && product.images.length > 0) ? product.images[0] : (product?.image || '/assets/jewellery/necklace/1.jpg'))
    : (seller?.logo || '/uploads/avatar.jpg');

  const previewImage = api.getImageUrl(rawImage);

  const storeUrl = `${window.location.origin}/#shop?sellerId=${seller?.id || 'seller-1'}`;
  const targetUrl = isProductShare
    ? `${window.location.origin}/#product/${product.id}`
    : storeUrl;

  const defaultMessage = isProductShare
    ? `✨ Check out this magnificent ${product.name} from ${seller.name} on Ratnaya!\n\n💎 Price: ₹${product.price?.toLocaleString('en-IN')}\n📜 Purity: ${product.purity || '22K BIS Hallmarked'}\n\nView & order directly here: ${targetUrl}`
    : `✨ Explore our exclusive 100% BIS Hallmarked Gold & Diamond Jewellery collection on Ratnaya!\n\n👑 Store: ${seller.name}\n📍 Location: ${seller.city || 'India'}\n💎 Active Pieces: ${totalProducts} Ornaments Listed\n\nBrowse our official digital catalog: ${targetUrl}`;

  const [shareText, setShareText] = useState(defaultMessage);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Encode for URL parameters
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(targetUrl);

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: '💬',
      bgColor: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      url: `https://api.whatsapp.com/send?text=${encodedText}`
    },
    {
      name: 'Facebook',
      icon: '📘',
      bgColor: 'bg-blue-600 hover:bg-blue-700 text-white',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`
    },
    {
      name: 'Twitter / X',
      icon: '🐦',
      bgColor: 'bg-slate-900 hover:bg-black text-white',
      url: `https://twitter.com/intent/tweet?text=${encodedText}`
    },
    {
      name: 'Telegram',
      icon: '✈️',
      bgColor: 'bg-sky-500 hover:bg-sky-600 text-white',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(isProductShare ? product.name : seller.name)}`
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      bgColor: 'bg-indigo-700 hover:bg-indigo-800 text-white',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    },
    {
      name: 'Email',
      icon: '✉️',
      bgColor: 'bg-rose-600 hover:bg-rose-700 text-white',
      url: `mailto:?subject=${encodeURIComponent(`Jewellery Catalog from ${seller.name}`)}&body=${encodedText}`
    }
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: isProductShare ? product.name : `${seller.name} — Luxury Catalog`,
          text: shareText,
          url: targetUrl
        });
      } catch (err) {
        console.log('Native share closed/cancelled:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  // Simple QR Code API generation for store catalog
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedUrl}&color=111111&bgcolor=FAF6F0`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full border border-gold/30 overflow-hidden relative transition-all my-8">
        {/* Header */}
        <div className="bg-[#111111] text-white p-5 border-b border-gold/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
              {isProductShare ? <Package size={20} /> : <Store size={20} />}
            </div>
            <div>
              <span className="text-[0.68rem] text-gold font-bold tracking-widest uppercase block">
                RATNAYA SOCIAL SHARING
              </span>
              <h3 className="font-heading text-lg text-white font-semibold leading-tight">
                {isProductShare ? `Share "${product.name}"` : `Share Store Catalog — ${seller.name}`}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Target Preview Banner */}
          <div className="bg-[#FAF6F0] p-3.5 rounded border border-gold/25 flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-white border border-gray-200 shrink-0 overflow-hidden flex items-center justify-center">
              <img
                src={previewImage}
                alt={isProductShare ? product.name : seller.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/jewellery/necklace/1.jpg';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[0.7rem] text-gold-dark font-bold uppercase tracking-wider block">
                {isProductShare ? 'Jewellery Product Link' : 'Storefront Digital Catalog'}
              </span>
              <p className="text-xs font-bold text-charcoal truncate">
                {isProductShare ? product.name : seller.name}
              </p>
              <p className="text-[0.72rem] text-gray-500 truncate font-mono">
                {targetUrl}
              </p>
            </div>
          </div>

          {/* Customized Promotional Message */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                <Sparkles size={14} className="text-gold-dark" /> Custom Promotional Message
              </label>
              <button
                onClick={() => setShareText(defaultMessage)}
                className="text-[0.7rem] text-gold-dark hover:underline font-medium cursor-pointer"
              >
                Reset Default Text
              </button>
            </div>
            <textarea
              rows={4}
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              className="w-full p-3 text-xs bg-gray-50 border border-gray-300 rounded focus:bg-white focus:border-gold focus:outline-none leading-relaxed text-gray-800"
              placeholder="Write a custom note for your clients..."
            />
          </div>

          {/* One-Click Social Media Grid */}
          <div>
            <label className="text-xs font-bold text-charcoal block mb-2">
              Share directly to Social Media Platforms:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 p-2.5 rounded text-xs font-semibold shadow-2xs transition-all ${item.bgColor} cursor-pointer hover:scale-[1.02]`}
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Copy Direct Link & Native Share */}
          <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                readOnly
                value={targetUrl}
                className="w-full pr-24 pl-3 py-2 bg-gray-100 text-xs text-gray-700 border border-gray-300 rounded font-mono select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`absolute right-1 top-1 bottom-1 px-3 text-xs font-semibold rounded transition-all cursor-pointer flex items-center gap-1 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gold-dark hover:bg-gold text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={13} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={13} /> Copy Link
                  </>
                )}
              </button>
            </div>

            {/* Mobile Native Share Button */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="bg-charcoal hover:bg-black text-white px-4 py-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Share2 size={14} /> More Options
              </button>
            )}

            {/* Toggle QR Code Card */}
            <button
              onClick={() => setShowQr(!showQr)}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <QrCode size={14} /> {showQr ? 'Hide QR Code' : 'Get QR Code'}
            </button>
          </div>

          {/* QR Code Container */}
          {showQr && (
            <div className="bg-[#FAF6F0] p-4 rounded border border-gold/30 text-center animate-fade-in space-y-3">
              <p className="text-xs font-bold text-charcoal">
                📱 Scan QR Code to Open Store Catalog Directly
              </p>
              <div className="inline-block p-3 bg-white rounded border border-gray-200 shadow-sm">
                <img
                  src={qrCodeApiUrl}
                  alt="Store Catalog QR Code"
                  className="w-40 h-40 object-contain mx-auto"
                />
              </div>
              <p className="text-[0.72rem] text-gray-500">
                You can save or print this QR Code to place in your physical retail store, business cards, or WhatsApp status.
              </p>
              <a
                href={qrCodeApiUrl}
                download={`${seller.name}_Store_QR.png`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gold-dark font-semibold hover:underline"
              >
                <Download size={13} /> Download QR Code Image
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
          <span>Ratnaya Digital Commerce Suite</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-charcoal font-semibold rounded cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
