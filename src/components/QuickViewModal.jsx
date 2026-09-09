import React, { useState, useEffect } from 'react';
import { X, Star, Heart, ShoppingBag, Store, ShieldCheck, Check, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onAddToWishlist,
  isWishlisted,
  onViewFullDetail,
  onViewSellerStore
}) {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [adding, setAdding] = useState(false);

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

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[220] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-[#FAF6F0] rounded-sm overflow-hidden shadow-2xl border border-gold/40 relative grid grid-cols-1 sm:grid-cols-2 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-gold hover:text-white transition-colors border-none cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Left Image Section */}
        <div className="bg-white p-6 flex flex-col gap-4">
          <div className="relative aspect-square overflow-hidden rounded-sm bg-[#FAF8F5]">
            <img
              src={api.getImageUrl(product.images ? product.images[selectedImgIndex] : product.image)}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-gold text-white text-xs font-bold px-2.5 py-1 tracking-wider">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`w-14 h-14 rounded-sm overflow-hidden flex-shrink-0 cursor-pointer border p-0 ${
                    selectedImgIndex === idx ? 'border-gold ring-2 ring-gold/30' : 'border-gray-200 opacity-60'
                  }`}
                >
                  <img src={api.getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Product Details */}
        <div className="p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="seller-badge text-gray-500 font-medium flex items-center gap-1">
                <Store size={12} /> {product.sellerName}
              </span>
              <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                In Stock
              </span>
            </div>

            <h2 className="font-heading text-xl sm:text-2xl text-charcoal mb-2">
              {product.name}
            </h2>

            <div className="flex items-center gap-2 mb-4 text-xs text-amber-500">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} stroke="currentColor" />
                ))}
              </div>
              <span className="text-gray-500">({product.reviewsCount} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-gray-200">
              <span className="font-heading text-2xl font-semibold text-charcoal">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="line-through text-gray-400 text-sm">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 border border-gray-200 rounded-sm mb-4">
              <div><strong>Metal:</strong> {product.metal}</div>
              <div><strong>Purity:</strong> {product.purity}</div>
              <div><strong>Weight:</strong> {product.weight}</div>
              <div><strong>Gemstone:</strong> {product.gemstone}</div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-6 line-clamp-3">
              {product.description}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <button
                disabled={adding}
                onClick={async () => {
                  setAdding(true);
                  await new Promise((res) => setTimeout(res, 300));
                  onAddToCart(product);
                  setAdding(false);
                }}
                className="btn-gold flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-80"
              >
                {adding ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-white" /> Adding...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={() => onAddToWishlist(product)}
                className={`w-11 h-11 border rounded-sm flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                  isWishlisted ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-charcoal hover:text-red-500 border-gray-200'
                }`}
                title="Wishlist"
              >
                <Heart
                  size={18}
                  fill={isWishlisted ? '#D93838' : 'none'}
                  stroke={isWishlisted ? '#D93838' : 'currentColor'}
                  strokeWidth={isWishlisted ? 0 : 1.75}
                />
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                onViewFullDetail(product);
              }}
              className="btn-outline w-full py-2.5 text-xs font-semibold text-center"
            >
              View Full Product Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
