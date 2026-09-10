import React, { useState } from 'react';
import { SELLERS, PRODUCTS } from '../data/marketplaceData';
import { ShieldCheck, Star, MapPin, Calendar, Heart, Eye, ShoppingBag, Store, Check } from 'lucide-react';
import { api } from '../services/api';

export function SellerStorePage({
  sellerId,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds
}) {
  const seller = SELLERS.find((s) => s.id === sellerId) || SELLERS[0];
  const sellerProducts = PRODUCTS.filter((p) => p.sellerId === seller.id);
  const [activeTab, setActiveTab] = useState('all');
  const [isFollowing, setIsFollowing] = useState(false);

  const displayedProducts = sellerProducts.filter((p) => {
    if (activeTab === 'all') return true;
    return p.category === activeTab;
  });

  return (
    <div className="bg-[#FAF6F0] pb-24 min-h-[80vh]">
      {/* Seller Header Hero Banner */}
      <div
        className="relative h-48 sm:h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${api.getImageUrl(seller.banner || '/uploads/banner.jpg')})` }}
      >
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Seller Info Header Card */}
        <div className="bg-white border border-gold/40 rounded-sm p-6 sm:p-8 shadow-medium flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <img
              src={api.getImageUrl(seller.logo || '/uploads/avatar.jpg')}
              alt={seller.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-md shrink-0"
            />

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-heading text-2xl sm:text-3xl text-charcoal">{seller.name}</h1>
                {seller.verified && (
                  <span className="badge-gold text-xs flex items-center gap-1">
                    <ShieldCheck size={12} className="text-gold-dark" /> Verified Jeweller
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 mt-2 text-xs sm:text-sm text-gray-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {seller.city}
                </span>
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star size={14} fill="currentColor" /> {seller.rating} ({seller.reviewsCount} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> Member since {seller.joinedDate}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-xl">
                {seller.about}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`py-2.5 px-6 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all border-none cursor-pointer ${
              isFollowing
                ? 'bg-emerald-800 text-white'
                : 'btn-gold'
            }`}
          >
            {isFollowing ? '✓ Following Jeweller' : '+ Follow Merchant'}
          </button>
        </div>

        {/* Store Catalogue Grid */}
        <div className="mt-10">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
            <h2 className="font-heading text-xl sm:text-2xl">
              Merchant Catalogue ({displayedProducts.length})
            </h2>

            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {['all', 'necklaces', 'rings', 'bracelets', 'earrings'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-wider rounded-full transition-colors cursor-pointer border-none ${
                    activeTab === cat
                      ? 'bg-gold text-white font-semibold'
                      : 'bg-white text-gray-600 hover:text-charcoal'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((prod) => (
              <div
                key={prod.id}
                className="product-card group rounded-sm bg-white border border-gray-200 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-medium hover:border-gold/50"
              >
                <div className="product-image-wrap relative aspect-[1/1.15] overflow-hidden bg-[#FAF8F5]">
                  <img
                    src={prod.images ? prod.images[0] : prod.image}
                    alt={prod.name}
                    className="product-image-primary w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Wishlist Heart Icon (Top-Right) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(prod);
                    }}
                    className={`wishlist-btn absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all z-10 shadow-sm border-none cursor-pointer hover:scale-105 ${
                      wishlistIds.includes(prod.id) ? 'text-red-500 bg-white' : 'text-charcoal hover:text-red-500'
                    }`}
                    title="Wishlist"
                  >
                    <Heart
                      size={18}
                      fill={wishlistIds.includes(prod.id) ? '#D93838' : 'none'}
                      stroke={wishlistIds.includes(prod.id) ? '#D93838' : 'currentColor'}
                      strokeWidth={wishlistIds.includes(prod.id) ? 0 : 1.75}
                    />
                  </button>

                  {/* Bottom Floating Glassmorphism Action Pill on Hover */}
                  <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none">
                    <div className="flex items-center gap-3 bg-black/85 backdrop-blur-md px-4 py-2 rounded-full text-white shadow-2xl pointer-events-auto transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickView(prod);
                        }}
                        className="flex items-center gap-1.5 text-xs font-medium text-white hover:text-gold transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"
                        title="Quick View"
                      >
                        <Eye size={14} /> <span>Quick View</span>
                      </button>
                      <span className="text-white/30 font-light select-none">|</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(prod);
                        }}
                        className="flex items-center gap-1.5 text-xs font-medium text-white hover:text-gold transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"
                        title="Add to Cart"
                      >
                        <ShoppingBag size={14} /> <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between gap-2">
                  <div>
                    <h3
                      onClick={() => onSelectProduct(prod)}
                      className="text-sm font-normal text-charcoal hover:text-gold cursor-pointer line-clamp-2 leading-snug"
                    >
                      {prod.name}
                    </h3>
                  </div>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-base font-semibold text-charcoal">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
