import React, { useState } from 'react';
import { SELLERS, PRODUCTS } from '../data/marketplaceData';
import ImageModal from './ImageModal';
import {
  Star,
  Heart,
  ShoppingBag,
  Store,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Plus,
  Minus,
  Share2,
  Loader2,
  ZoomIn
} from 'lucide-react';

export function ProductDetailPage({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onCheckoutDirect,
  onViewSellerStore,
  onSelectProduct
}) {
  if (!product) return null;

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToast, setAddedToast] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const seller = SELLERS.find((s) => s.id === product.sellerId) || {
    name: product.sellerName,
    city: 'Jaipur, Rajasthan',
    rating: product.sellerRating || 4.9,
    verified: true
  };

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const [addingCart, setAddingCart] = useState(false);

  const handleAddToCart = async () => {
    setAddingCart(true);
    await new Promise((res) => setTimeout(res, 300));
    onAddToCart({ ...product, quantity });
    setAddingCart(false);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div className="bg-[#FAF6F0] pb-24 min-h-[80vh]">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 bg-charcoal text-white p-4 rounded-md shadow-2xl z-50 flex items-center gap-3 border border-gold animate-fadeIn">
          <CheckCircle2 className="text-gold" size={20} />
          <div>
            <strong className="block text-sm">Added to Shopping Bag</strong>
            <span className="text-xs text-gray-300">{product.name} ({quantity} qty)</span>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 flex-wrap">
            <span>Home</span> <ChevronRight size={12} />
            <span>Shop</span> <ChevronRight size={12} />
            <span>{product.categoryName}</span> <ChevronRight size={12} />
            <span className="text-charcoal font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 bg-white p-6 sm:p-10 border border-gray-200 rounded-sm shadow-subtle">
          {/* LEFT: GALLERY */}
          <div>
            <div
              className="relative aspect-square rounded-sm overflow-hidden bg-[#FAF8F5] mb-4 border border-gray-200 group cursor-pointer"
              onClick={() => setIsImageModalOpen(true)}
              title="Click for fullscreen view (Esc to close)"
            >
              <img
                src={images[selectedImageIdx]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                <span className="bg-black/75 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium shadow-lg backdrop-blur-sm">
                  <ZoomIn size={16} /> Click to Enlarge
                </span>
              </div>

              {product.discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-gold text-white text-xs font-bold px-3 py-1 tracking-wider">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Gallery Row */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-sm overflow-hidden flex-shrink-0 cursor-pointer border p-0 transition-all ${
                      selectedImageIdx === idx ? 'border-gold ring-2 ring-gold/30' : 'border-gray-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS */}
          <div>
            {/* SKU & Stock Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="eyebrow mb-0">SKU: {product.sku}</span>
              <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold">
                In Stock ({product.stock} left)
              </span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl text-charcoal mb-3 leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} stroke="currentColor" />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-gray-500">
                {product.rating} ({product.reviewsCount} customer reviews)
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline flex-wrap gap-3 pb-5 border-b border-gray-200 mb-6">
              <span className="font-heading text-3xl sm:text-4xl font-semibold text-charcoal">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="line-through text-gray-400 text-lg">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs text-gold-dark font-semibold w-full sm:w-auto">
                (Inclusive of GST & Insured Shipping)
              </span>
            </div>

            {/* Seller Information Card */}
            <div className="bg-[#FAF6F0] border border-gold/30 p-4 rounded-sm mb-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Store size={22} className="text-gold-dark shrink-0" />
                <div>
                  <div className="text-[0.68rem] uppercase text-brownMuted tracking-wider font-semibold">
                    Authentic Merchant
                  </div>
                  <div className="text-sm font-semibold text-charcoal flex items-center gap-1.5">
                    {product.sellerName} <ShieldCheck size={14} className="text-gold" />
                  </div>
                </div>
              </div>
              <button
                onClick={() => onViewSellerStore(product.sellerId)}
                className="btn-outline-gold py-1.5 px-3 text-xs whitespace-nowrap"
              >
                View Store
              </button>
            </div>

            {/* Product Specifications Summary */}
            <div className="grid grid-cols-2 gap-3 bg-white p-4 border border-gray-200 rounded-sm mb-6 text-xs sm:text-sm">
              <div><strong>Metal Type:</strong> {product.metal}</div>
              <div><strong>Purity:</strong> {product.purity}</div>
              <div><strong>Gross Weight:</strong> {product.weight}</div>
              <div><strong>Gemstone:</strong> {product.gemstone}</div>
              <div><strong>Size/Fit:</strong> {product.size}</div>
              <div><strong>Color:</strong> {product.color}</div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs uppercase tracking-wider font-semibold text-charcoal">
                Quantity:
              </span>
              <div className="flex items-center border border-gray-300 rounded-sm bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-charcoal hover:bg-gray-100 border-none bg-transparent cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-charcoal hover:bg-gray-100 border-none bg-transparent cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                disabled={addingCart}
                onClick={handleAddToCart}
                className="btn-gold flex-1 py-3.5 text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-80"
              >
                {addingCart ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-white" /> ADDING...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> ADD TO CART
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  onAddToCart({ ...product, quantity });
                  onCheckoutDirect();
                }}
                className="btn-dark flex-1 py-3.5 text-xs font-semibold"
              >
                BUY NOW
              </button>

              <button
                onClick={() => onToggleWishlist(product)}
                className={`w-12 h-12 border border-gray-300 rounded-sm flex items-center justify-center transition-colors cursor-pointer self-center sm:self-auto shrink-0 ${
                  isWishlisted ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-charcoal hover:text-red-500'
                }`}
                title="Wishlist"
              >
                <Heart
                  size={20}
                  fill={isWishlisted ? '#D93838' : 'none'}
                  stroke={isWishlisted ? '#D93838' : 'currentColor'}
                  strokeWidth={isWishlisted ? 0 : 1.75}
                />
              </button>
            </div>

            {/* Authenticity Info Cards */}
            <div className="grid grid-cols-3 gap-2 pt-5 border-t border-gray-200 text-[0.72rem] sm:text-xs text-gray-500 text-center">
              <div className="p-2">
                <Award size={18} className="mx-auto text-gold-dark mb-1" />
                <div>BIS 22K/18K Hallmark</div>
              </div>
              <div className="p-2">
                <Truck size={18} className="mx-auto text-gold-dark mb-1" />
                <div>Insured Free Shipping</div>
              </div>
              <div className="p-2">
                <RotateCcw size={18} className="mx-auto text-gold-dark mb-1" />
                <div>14-Day Return Policy</div>
              </div>
            </div>
          </div>
        </div>

        {/* TABBED DETAILS & SPECS */}
        <div className="mt-12 bg-white border border-gray-200 rounded-sm overflow-hidden shadow-subtle">
          {/* Tab Headers */}
          <div className="flex overflow-x-auto border-b border-gray-200 bg-[#FAF6F0] no-scrollbar">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications & Purity' },
              { id: 'seller', label: 'Seller & Creator Info' },
              { id: 'shipping', label: 'Shipping & Authenticity' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-sans text-xs sm:text-sm font-medium uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-gold bg-white text-gold-dark font-semibold'
                    : 'border-transparent text-charcoal hover:text-gold bg-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Body */}
          <div className="p-6 sm:p-10">
            {activeTab === 'description' && (
              <div>
                <h3 className="font-heading text-xl mb-4">Craftsmanship & Story</h3>
                <p className="text-sm sm:text-base text-charcoal leading-relaxed max-w-3xl">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="max-w-2xl">
                <h3 className="font-heading text-xl mb-4">Technical Metal & Gemstone Specs</h3>
                <div className="flex flex-col gap-2">
                  {product.specifications?.map((spec, i) => (
                    <div
                      key={i}
                      className={`flex justify-between p-3 border border-gray-200 text-xs sm:text-sm ${
                        i % 2 === 0 ? 'bg-[#FAF6F0]' : 'bg-white'
                      }`}
                    >
                      <span className="font-medium text-charcoal">{spec.label}</span>
                      <span className="text-gray-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'seller' && (
              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={seller.logo}
                    alt={seller.name}
                    className="w-16 h-16 rounded-full object-cover border border-gold/30"
                  />
                  <div>
                    <h3 className="font-heading text-xl">{seller.name}</h3>
                    <p className="text-xs text-gray-500">
                      {seller.city} • Verified Jewellery Artisan
                    </p>
                    <div className="flex items-center gap-1 text-xs text-amber-500 mt-0.5 font-semibold">
                      <Star size={14} fill="currentColor" /> {seller.rating} rating
                    </div>
                  </div>
                </div>
                <p className="text-sm text-charcoal leading-relaxed">
                  {seller.about || 'Specialized in hand-crafted gold, diamond, and Kundan creations with certified authenticity.'}
                </p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-2xl">
                <h3 className="font-heading text-xl mb-4">Guaranteed Authenticity & Insured Transit</h3>
                <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                  <li>All gold jewellery items are BIS 916 (22K) or 750 (18K) hallmarked with unique HUID codes.</li>
                  <li>Solitaire diamonds and precious gemstones come accompanied by GIA, IGI, or SGL certificates.</li>
                  <li>Shipments are fully insured against transit damage or loss, packaged in tamper-proof video-recorded security bags.</li>
                  <li>Free 14-day return window with full refund or store exchange.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl mb-6">
              You May Also Admire
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="product-card group rounded-sm bg-white border border-gray-200 overflow-hidden cursor-pointer shadow-sm hover:shadow-medium transition-all"
                >
                  <div className="product-image-wrap aspect-square overflow-hidden bg-[#FAF8F5]">
                    <img src={p.images ? p.images[0] : p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-gold-dark uppercase tracking-wider mb-1">
                      {p.sellerName}
                    </div>
                    <h4 className="text-sm font-normal text-charcoal line-clamp-1 mb-1">{p.name}</h4>
                    <div className="font-semibold text-sm">₹{p.price.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Modal Lightbox */}
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          images={images}
          initialIndex={selectedImageIdx}
          title={product.name}
        />
      </div>
    </div>
  );
}
