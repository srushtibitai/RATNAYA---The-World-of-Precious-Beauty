import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Trash2, Loader2 } from 'lucide-react';

export function WishlistDrawer({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveWishlist,
  onAddToCart
}) {
  const [movingId, setMovingId] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[210] flex justify-end">
      <div className="w-full sm:w-[440px] h-full bg-[#FAF6F0] flex flex-col shadow-drawer animate-slideLeft">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <Heart size={20} fill="#D93838" stroke="#D93838" strokeWidth={0} />
            <h3 className="font-heading text-lg sm:text-xl">Your Wishlist</h3>
            <span className="text-xs bg-[#F5E7D6] text-gold-dark px-2.5 py-0.5 rounded-full font-semibold">
              {wishlistItems.length}
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-charcoal hover:text-gold transition-colors border-none bg-transparent cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 p-5 overflow-y-auto">
          {wishlistItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
              <Heart size={48} strokeWidth={1} className="text-gold mb-4" />
              <h4 className="font-heading text-xl mb-2 text-charcoal">Your Wishlist is Empty</h4>
              <p className="text-xs sm:text-sm max-w-xs mb-6">
                Save your favorite luxury pieces by tapping the heart icon while browsing.
              </p>
              <button onClick={onClose} className="btn-gold text-xs py-3 px-6">
                EXPLORE COLLECTIONS
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3.5 border border-gray-200 rounded-sm flex gap-3.5 items-center"
                >
                  <img
                    src={item.images ? item.images[0] : item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-sm border border-gray-100 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="text-[0.68rem] text-gold-dark uppercase font-medium truncate">
                      {item.sellerName}
                    </div>
                    <h4 className="text-xs sm:text-sm font-normal text-charcoal truncate mb-1">
                      {item.name}
                    </h4>
                    <div className="font-semibold text-sm text-charcoal mb-2">
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        disabled={movingId === item.id}
                        onClick={async () => {
                          setMovingId(item.id);
                          await new Promise((r) => setTimeout(r, 450));
                          onAddToCart(item);
                          onRemoveWishlist(item.id);
                          setMovingId(null);
                        }}
                        className="bg-gold hover:bg-gold-dark text-white py-1.5 px-3 text-[0.68rem] uppercase font-semibold tracking-wider flex items-center gap-1.5 rounded-sm border-none cursor-pointer transition-colors shadow-none disabled:opacity-75"
                      >
                        {movingId === item.id ? (
                          <>
                            <Loader2 size={12} className="animate-spin" /> Moving...
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={12} /> Move to Bag
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onRemoveWishlist(item.id)}
                        className="p-1 text-gray-400 hover:text-red-600 border-none bg-transparent cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
