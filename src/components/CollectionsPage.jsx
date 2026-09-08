import React, { useState, useMemo } from 'react';
import { Heart, Eye, ShoppingBag, ArrowRight, Sparkles, ShieldCheck, Award, ExternalLink } from 'lucide-react';
import { PRODUCTS } from '../data/marketplaceData';

export function CollectionsPage({
  onSelectCategory,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds = [],
  onNavigateShop
}) {
  const [selectedCollection, setSelectedCollection] = useState('all');

  const collectionsData = [
    {
      id: 'nizam-polki',
      title: 'Nizam Royal Polki',
      subtitle: 'Uncut Syndicate Diamonds & Zambian Emeralds',
      image: '/assets/jewellery/necklace/8.jpg',
      count: '12 Heirloom Masterpieces',
      tag: 'HERITAGE ROYALTY',
      categoryMatch: 'Necklaces'
    },
    {
      id: 'kolkata-filigree',
      title: 'Kolkata Filigree & Nakshi',
      subtitle: '22K Handwoven Lace Wirework & Chased Bangles',
      image: '/assets/jewellery/bracelet/1.jpg',
      count: '15 Handcrafted Bangles',
      tag: 'CENTURY-OLD TECHNIQUE',
      categoryMatch: 'Bangles'
    },
    {
      id: 'deccan-solitaire',
      title: 'Deccan Certified Solitaires',
      subtitle: 'EF VVS Excellent Cut GIA Certified Solitaires',
      image: '/assets/jewellery/ring/1.jpg',
      count: '18 Certified Creations',
      tag: 'EXCELLENT CUT FIRE',
      categoryMatch: 'Rings'
    },
    {
      id: 'temple-gold',
      title: 'Sacred Temple 22K Gold',
      subtitle: 'Divine Iconography & Sculpted Antique Gold Haars',
      image: '/assets/jewellery/necklace/1.jpg',
      count: '10 Divine Creations',
      tag: 'BIS 916 HALLMARKED',
      categoryMatch: 'Pendants'
    },
    {
      id: 'rose-gold-minimal',
      title: 'Modern Rose Gold Stacks',
      subtitle: 'Everyday Minimalist Solitaire Chains & Tennis Bands',
      image: '/assets/jewellery/earrings/1.jpg',
      count: '14 Modern Stacks',
      tag: 'CONTEMPORARY LUXURY',
      categoryMatch: 'Earrings'
    },
    {
      id: 'kundan-meenakari',
      title: 'Vintage Kundan & Meenakari',
      subtitle: '360° Reversible Hand-Enamel Jaipur Chokers',
      image: '/assets/jewellery/necklace/videoframe_3765.png',
      count: '9 Reversible Sets',
      tag: 'ATELIER SPECIALTY',
      categoryMatch: 'Necklaces'
    }
  ];

  // Smooth scroll down to products grid when collection is clicked
  const handleCollectionSelect = (id) => {
    setSelectedCollection(id);
    setTimeout(() => {
      const gridElement = document.getElementById('collection-products-grid');
      if (gridElement) {
        gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Direct navigation to Shop Page pre-filtered by category
  const handleDirectShopNavigate = (categoryName, e) => {
    if (e) e.stopPropagation();
    if (onSelectCategory) {
      onSelectCategory(categoryName.toLowerCase());
    } else if (onNavigateShop) {
      onNavigateShop();
    }
  };

  // Filter products based on selected collection tab
  const filteredProducts = useMemo(() => {
    if (selectedCollection === 'all') {
      return PRODUCTS.slice(0, 12);
    }
    const current = collectionsData.find((c) => c.id === selectedCollection);
    if (!current) return PRODUCTS.slice(0, 12);

    const matches = PRODUCTS.filter(
      (p) => p.category.toLowerCase() === current.categoryMatch.toLowerCase()
    );
    return matches.length > 0 ? matches : PRODUCTS.slice(0, 8);
  }, [selectedCollection]);

  return (
    <div className="bg-[#FAF6F0] pb-24 min-h-[80vh]">
      {/* Banner Header */}
      <div className="bg-[#111111] text-white py-12 sm:py-16 text-center border-b border-gold/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-xs text-gold tracking-widest uppercase mb-2">
            Home / Luxury Collections
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl text-white" style={{ color: '#FFFFFF' }}>
            The Royal Heritage Collections
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto mt-3 font-light leading-relaxed">
            Explore curated ateliers of 22K hallmarked gold, uncut Nizam Polki, certified solitaires, and ancient temple filigree artistry.
          </p>
        </div>
      </div>

      {/* Main Container with Generous Top Spacing */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-16">
        
        {/* Section 1: Featured 6 Collection Showcase Grid */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <span className="eyebrow">CURATED ATELIERS</span>
            <h2 className="section-title text-2xl sm:text-4xl">Signature Collections</h2>
            <p className="section-subtitle text-xs sm:text-sm max-w-md mx-auto">
              Click any collection below to view products immediately or jump directly to the Shop Catalog.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {collectionsData.map((col) => (
              <div
                key={col.id}
                onClick={() => handleCollectionSelect(col.id)}
                className={`group relative aspect-[4/3] rounded-sm overflow-hidden cursor-pointer border transition-all duration-500 ${
                  selectedCollection === col.id
                    ? 'border-gold shadow-lg ring-2 ring-gold/40'
                    : 'border-gray-200 hover:border-gold/60 shadow-sm hover:shadow-medium'
                }`}
              >
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[0.65rem] text-[#E5C888] tracking-widest uppercase font-bold mb-1">
                    {col.tag}
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl text-white" style={{ color: '#FFFFFF' }}>
                    {col.title}
                  </h3>
                  <p className="text-xs text-gray-300 mt-1 line-clamp-1 font-light">
                    {col.subtitle}
                  </p>

                  <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                    <span className="font-medium text-gold">{col.count}</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleDirectShopNavigate(col.categoryMatch, e)}
                        className="text-white hover:text-gold flex items-center gap-1 text-[0.7rem] bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded border border-white/30 transition-colors"
                        title="Open in Shop Page"
                      >
                        Shop Catalog <ExternalLink size={11} />
                      </button>
                      <span className="text-gold font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View Products ↓
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Collection Filter Tabs & Anchor Target */}
        <div id="collection-products-grid" className="border-t border-gold/20 pt-12 scroll-mt-24">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <span className="eyebrow">EXQUISITE CREATIONS</span>
              <h2 className="section-title text-xl sm:text-3xl">
                {selectedCollection === 'all'
                  ? 'All Collection Showcase'
                  : collectionsData.find((c) => c.id === selectedCollection)?.title}
              </h2>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCollection('all')}
                className={`py-2 px-4 rounded-full text-xs font-sans transition-all border cursor-pointer ${
                  selectedCollection === 'all'
                    ? 'bg-gold text-white font-semibold border-gold shadow-sm'
                    : 'bg-white text-charcoal hover:bg-gray-100 border-gray-200'
                }`}
              >
                All Collections
              </button>
              {collectionsData.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setSelectedCollection(col.id)}
                  className={`py-2 px-4 rounded-full text-xs font-sans transition-all border cursor-pointer ${
                    selectedCollection === col.id
                      ? 'bg-gold text-white font-semibold border-gold shadow-sm'
                      : 'bg-white text-charcoal hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  {col.title}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);

              return (
                <div
                  key={product.id}
                  className="product-card group rounded-sm bg-white border border-gray-200 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-medium hover:border-gold/50"
                >
                  <div className="product-image-wrap relative aspect-[1/1.15] overflow-hidden bg-[#FAF8F5]">
                    <img
                      src={product.images ? product.images[0] : product.image}
                      alt={product.name}
                      className="product-image-primary w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {product.images && product.images.length > 1 && (
                      <img
                        src={product.images[1]}
                        alt={product.name}
                        className="product-image-secondary absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    )}

                    {/* Wishlist Heart Icon (Top-Right) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                      }}
                      className={`wishlist-btn absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all z-10 shadow-sm border-none cursor-pointer hover:scale-105 ${
                        isWishlisted ? 'text-red-500 bg-white' : 'text-charcoal hover:text-red-500'
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

                    {/* Bottom Floating Glassmorphism Action Pill on Hover */}
                    <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none">
                      <div className="flex items-center gap-3 bg-black/85 backdrop-blur-md px-4 py-2 rounded-full text-white shadow-2xl pointer-events-auto transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickView(product);
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
                            onAddToCart(product);
                          }}
                          className="flex items-center gap-1.5 text-xs font-medium text-white hover:text-gold transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"
                          title="Add to Cart"
                        >
                          <ShoppingBag size={14} /> <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[0.7rem] text-gold uppercase tracking-wider font-semibold">
                        {product.category}
                      </div>
                      <h4
                        onClick={() => onSelectProduct(product)}
                        className="font-heading text-sm text-charcoal my-1 cursor-pointer hover:text-gold transition-colors line-clamp-1"
                      >
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{product.shortDesc || product.sellerName}</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="text-sm font-semibold text-charcoal">
                        ₹{(product.price || 0).toLocaleString('en-IN')}
                      </div>
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="text-xs text-gold-dark font-medium hover:underline bg-transparent border-none cursor-pointer"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={onNavigateShop}
              className="btn-gold py-3.5 px-8 text-xs tracking-widest font-semibold"
            >
              BROWSE FULL CATALOG <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Section 4: Heritage Trust Badges */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <ShieldCheck size={32} className="mx-auto text-gold mb-3" />
            <h4 className="font-heading text-lg text-charcoal mb-1">100% BIS Hallmarked 22K Gold</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              Every creation carries a 6-digit laser-etched HUID purity code verified by Indian government assay centers.
            </p>
          </div>
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <Award size={32} className="mx-auto text-gold mb-3" />
            <h4 className="font-heading text-lg text-charcoal mb-1">Certified Natural Gemstones</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              All solitaires, rubies, and emeralds are accompanied by official GIA / IGI certificates of authenticity.
            </p>
          </div>
          <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
            <Sparkles size={32} className="mx-auto text-gold mb-3" />
            <h4 className="font-heading text-lg text-charcoal mb-1">Insured Royal Delivery</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              Shipped in double-sealed tamper-evident velvet boxes with 100% transit insurance coverage to your door.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
