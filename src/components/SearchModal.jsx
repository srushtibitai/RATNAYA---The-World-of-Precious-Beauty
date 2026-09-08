import React, { useState } from 'react';
import { Search, X, ArrowRight, Store } from 'lucide-react';
import { PRODUCTS } from '../data/marketplaceData';

export function SearchModal({ isOpen, onClose, onSelectProduct, onNavigateShop }) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredProducts = query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(query.toLowerCase()) ||
          p.sellerName.toLowerCase().includes(query.toLowerCase()) ||
          p.material.toLowerCase().includes(query.toLowerCase()) ||
          p.gemstone.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const popularSearches = ['Kundan Haar', 'Solitaire Ring', 'Emerald Choker', 'Basra Pearl', '22K Gold Bangle'];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[200] flex flex-col items-center pt-12 sm:pt-20 px-4 animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#FAF6F0] rounded-sm shadow-2xl overflow-hidden border border-gold/40">
        {/* Search Header Input Bar */}
        <div className="p-4 sm:p-5 flex items-center gap-3 border-b border-gray-200 bg-white">
          <Search size={22} className="text-gold-dark shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by jewellery name, category, seller..."
            autoFocus
            className="flex-1 border-none outline-none font-heading text-base sm:text-lg text-charcoal bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-gray-400 p-1 hover:text-charcoal border-none bg-transparent cursor-pointer"
            >
              CLEAR
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-charcoal rounded-full bg-[#FAF6F0] hover:bg-gold hover:text-white transition-colors border-none cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[65vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-3">
                POPULAR SEARCHES
              </span>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="py-1.5 px-3 bg-white border border-gray-200 rounded-full text-xs text-charcoal hover:border-gold hover:text-gold-dark transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No luxury creations match "{query}"</p>
              <button
                onClick={() => {
                  onClose();
                  onNavigateShop();
                }}
                className="btn-gold mt-4 text-xs py-2 px-4"
              >
                Browse All Catalogue →
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <span className="text-xs text-gray-500 mb-1">
                Found {filteredProducts.length} matching item(s):
              </span>
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onClose();
                    onSelectProduct(p);
                  }}
                  className="flex items-center gap-3.5 p-3 bg-white border border-gray-200 rounded-sm hover:border-gold/50 cursor-pointer transition-all"
                >
                  <img
                    src={p.images ? p.images[0] : p.image}
                    alt={p.name}
                    className="w-14 h-14 object-cover rounded-sm border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[0.68rem] text-gold-dark uppercase font-medium block">
                      {p.sellerName}
                    </span>
                    <h4 className="text-xs sm:text-sm font-normal text-charcoal truncate">
                      {p.name}
                    </h4>
                    <span className="text-xs font-semibold text-charcoal">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <ArrowRight size={16} className="text-gold-dark shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
