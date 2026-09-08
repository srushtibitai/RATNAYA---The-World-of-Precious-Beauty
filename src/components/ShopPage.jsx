import React, { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES, SELLERS } from '../data/marketplaceData';
import { Filter, SlidersHorizontal, Star, Heart, Eye, ShoppingBag, Store, X, Loader2 } from 'lucide-react';

export function ShopPage({
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  productsList = PRODUCTS
}) {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState(selectedCategory || 'all');
  const [selectedSeller, setSelectedSeller] = useState('all');
  const [selectedMetal, setSelectedMetal] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [maxPrice, setMaxPrice] = useState(400000);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      if (activeCategoryFilter !== 'all' && p.category !== activeCategoryFilter) return false;
      if (selectedSeller !== 'all' && p.sellerId !== selectedSeller) return false;
      if (selectedMetal !== 'all' && !p.metal.toLowerCase().includes(selectedMetal.toLowerCase())) return false;
      if (selectedSize !== 'all') {
        const hasSize = (p.availableSizes && p.availableSizes.includes(selectedSize)) ||
                       (p.size && p.size.toString().includes(selectedSize));
        if (!hasSize) return false;
      }
      if (p.price > maxPrice) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return b.isNew ? 1 : -1;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });
  }, [activeCategoryFilter, selectedSeller, selectedMetal, selectedSize, maxPrice, sortBy, productsList]);

  // Reset pagination on filter change
  const handleCategoryChange = (catId) => {
    setActiveCategoryFilter(catId);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const startIndex = filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredProducts.length);

  const filterContent = (
    <div className="flex flex-col gap-6 text-sm">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <h3 className="font-heading text-lg text-charcoal flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-gold-dark" /> Refine Search
        </h3>
        {(activeCategoryFilter !== 'all' || selectedSeller !== 'all' || selectedMetal !== 'all' || selectedSize !== 'all') && (
          <button
            onClick={() => {
              setActiveCategoryFilter('all');
              setSelectedSeller('all');
              setSelectedMetal('all');
              setSelectedSize('all');
              setMaxPrice(400000);
              setCurrentPage(1);
            }}
            className="text-xs text-gold-dark font-semibold hover:underline bg-transparent border-none cursor-pointer"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-3">
          Jewellery Category
        </h4>
        <div className="flex flex-col gap-2 text-xs sm:text-sm">
          <label className="cursor-pointer flex items-center gap-2 text-charcoal hover:text-gold">
            <input
              type="radio"
              name="cat"
              checked={activeCategoryFilter === 'all'}
              onChange={() => handleCategoryChange('all')}
              className="accent-gold"
            />
            All Categories
          </label>
          {CATEGORIES.map((cat) => (
            <label key={cat.id} className="cursor-pointer flex items-center gap-2 text-charcoal hover:text-gold">
              <input
                type="radio"
                name="cat"
                checked={activeCategoryFilter === cat.id}
                onChange={() => handleCategoryChange(cat.id)}
                className="accent-gold"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-3">
          Jewellery Size
        </h4>
        <select
          value={selectedSize}
          onChange={(e) => {
            setSelectedSize(e.target.value);
            setCurrentPage(1);
          }}
          className="input-field text-xs sm:text-sm py-2 px-3 bg-white"
        >
          <option value="all">All Sizes</option>
          <optgroup label="Ring Sizes">
            <option value="12">Size 12</option>
            <option value="14">Size 14</option>
            <option value="16">Size 16</option>
            <option value="18">Size 18</option>
          </optgroup>
          <optgroup label="Bangle / Bracelet Sizes">
            <option value="2.4 Size">2.4 Size</option>
            <option value="2.6 Size">2.6 Size</option>
            <option value="2.8 Size">2.8 Size</option>
          </optgroup>
          <optgroup label="Necklace Chain Sizes">
            <option value="16 Inch">16 Inch</option>
            <option value="18 Inch">18 Inch</option>
            <option value="20 Inch">20 Inch</option>
          </optgroup>
        </select>
      </div>

      {/* Price Filter */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
          Max Price: ₹{maxPrice.toLocaleString('en-IN')}
        </h4>
        <input
          type="range"
          min="50000"
          max="400000"
          step="10000"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="w-full accent-gold cursor-pointer"
        />
      </div>

      {/* Metal Filter */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-3">
          Metal Type
        </h4>
        <select
          value={selectedMetal}
          onChange={(e) => {
            setSelectedMetal(e.target.value);
            setCurrentPage(1);
          }}
          className="input-field text-xs sm:text-sm py-2 px-3 bg-white"
        >
          <option value="all">All Metals</option>
          <option value="22K Gold">22K Yellow Gold</option>
          <option value="18K White Gold">18K White Gold</option>
          <option value="18K Rose Gold">18K Rose Gold</option>
        </select>
      </div>

      {/* Seller Filter */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-3">
          Filter by Jeweller / Seller
        </h4>
        <select
          value={selectedSeller}
          onChange={(e) => {
            setSelectedSeller(e.target.value);
            setCurrentPage(1);
          }}
          className="input-field text-xs sm:text-sm py-2 px-3 bg-white"
        >
          <option value="all">All Verified Jewellers</option>
          {SELLERS.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FAF6F0] pb-24 min-h-[80vh]">
      {/* Shop Banner Header */}
      <div className="bg-[#111111] text-white py-12 sm:py-16 text-center border-b border-gold/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-xs text-gold tracking-widest uppercase mb-2">
            Home / Shop Jewellery
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl text-white" style={{ color: '#FFFFFF' }}>
            The Luxury Jewellery Catalog
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mt-3 font-light">
            Explore 100% hallmarked gold, certified solitaires, and authentic Nizam Polki creations.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-16">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden btn-outline-gold py-2 px-4 text-xs flex items-center gap-2"
          >
            <Filter size={15} /> Filters & Sorting
          </button>

          <div className="text-xs sm:text-sm text-gray-600">
            Showing <strong className="text-charcoal">{startIndex}–{endIndex}</strong> of <strong className="text-charcoal">{filteredProducts.length}</strong> luxury creations
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="py-2 px-3 border border-gray-200 bg-white rounded-sm text-xs sm:text-sm text-charcoal focus:outline-none focus:border-gold"
            >
              <option value="featured">Featured Collection</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Best Rated</option>
            </select>
          </div>
        </div>

        {/* Main Grid with Sidebar Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* Left Desktop Sidebar Filter */}
          <aside className="hidden lg:block">
            <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm sticky top-28">
              {filterContent}
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {isMobileFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsMobileFilterOpen(false)}
              />
              <div className="relative w-4/5 max-w-xs bg-white h-full shadow-drawer p-6 overflow-y-auto z-10">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                  <h3 className="font-heading text-lg">Filter Products</h3>
                  <button onClick={() => setIsMobileFilterOpen(false)} className="p-1">
                    <X size={20} />
                  </button>
                </div>
                {filterContent}
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="btn-gold w-full mt-6 py-3 text-xs"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Right Product Grid */}
          <main className="flex flex-col justify-between">
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-12 text-center border border-gray-200 rounded-sm my-6">
                <h3 className="font-heading text-xl mb-3">
                  No Products Match Your Filter Criteria
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Try resetting your size filter or price slider.
                </p>
                <button
                  onClick={() => {
                    setActiveCategoryFilter('all');
                    setSelectedSeller('all');
                    setSelectedMetal('all');
                    setSelectedSize('all');
                    setMaxPrice(400000);
                    setCurrentPage(1);
                  }}
                  className="btn-gold py-3 px-6 text-xs"
                >
                  RESET ALL FILTERS
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProducts.map((prod) => (
                    <ShopProductCard
                      key={prod.id}
                      product={prod}
                      onSelectProduct={onSelectProduct}
                      onQuickView={onQuickView}
                      onAddToCart={onAddToCart}
                      onToggleWishlist={onToggleWishlist}
                      isWishlisted={wishlistIds.includes(prod.id)}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-gray-200">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => {
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 border border-gray-200 bg-white text-xs text-charcoal disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                    >
                      &laquo; Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 350, behavior: 'smooth' });
                        }}
                        className={`w-9 h-9 border rounded-sm text-xs font-medium transition-colors ${
                          pageNum === currentPage
                            ? 'border-gold bg-charcoal text-white font-semibold'
                            : 'border-gray-200 bg-white text-charcoal hover:border-gold'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => {
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                      }}
                      className="px-4 py-2 border border-gray-200 bg-white text-xs text-charcoal disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                    >
                      Next &raquo;
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function ShopProductCard({
  product,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}) {
  const [adding, setAdding] = useState(false);

  return (
    <div className="product-card group rounded-sm bg-white border border-gray-200 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-medium hover:border-gold/50">
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
              onClick={async (e) => {
                e.stopPropagation();
                setAdding(true);
                await new Promise((res) => setTimeout(res, 300));
                onAddToCart(product);
                setAdding(false);
              }}
              disabled={adding}
              className="flex items-center gap-1.5 text-xs font-medium text-white hover:text-gold transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap"
              title="Add to Cart"
            >
              {adding ? (
                <>
                  <Loader2 size={14} className="animate-spin text-gold" /> <span>Adding...</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={14} /> <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between gap-2">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="seller-badge text-gray-500 font-medium flex items-center gap-1">
              <Store size={11} /> {product.sellerName}
            </span>
            <div className="flex items-center gap-0.5 text-amber-500 text-xs font-semibold">
              <Star size={12} fill="currentColor" /> {product.rating}
            </div>
          </div>
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-sm font-normal text-charcoal hover:text-gold cursor-pointer line-clamp-2 leading-snug min-h-[2.5rem] flex items-start"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-base font-semibold text-charcoal">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span className="line-through text-xs text-gray-400">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
