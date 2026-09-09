import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onCheckout
}) {
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.03); // 3% GST on jewellery
  const total = subtotal + gst;

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[210] flex justify-end">
      <div className="w-full sm:w-[460px] h-full bg-[#FAF6F0] flex flex-col shadow-drawer animate-slideLeft">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={20} className="text-gold-dark" />
            <h3 className="font-heading text-lg sm:text-xl">Your Shopping Bag</h3>
            <span className="text-xs bg-[#F5E7D6] text-gold-dark px-2.5 py-0.5 rounded-full font-semibold">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-charcoal hover:text-gold transition-colors border-none bg-transparent cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Content List */}
        <div className="flex-1 p-5 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
              <ShoppingBag size={48} strokeWidth={1} className="text-gold mb-4" />
              <h4 className="font-heading text-xl mb-2 text-charcoal">Your Shopping Bag is Empty</h4>
              <p className="text-xs sm:text-sm max-w-xs mb-6">
                Explore our handpicked collection of royal gold, diamond, and Kundan creations.
              </p>
              <button onClick={onClose} className="btn-gold text-xs py-3 px-6">
                EXPLORE JEWELLERY
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3.5 border border-gray-200 rounded-sm flex gap-3.5 items-center"
                >
                  <img
                    src={api.getImageUrl(item.image)}
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

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 rounded-sm bg-[#FAF6F0]">
                        <button
                          onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-charcoal border-none bg-transparent cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2.5 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-charcoal border-none bg-transparent cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-600 p-1 border-none bg-transparent cursor-pointer"
                        title="Remove item"
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

        {/* Footer Checkout Summary */}
        {cartItems.length > 0 && (
          <div className="p-5 bg-white border-t border-gray-200 shadow-sm">
            <div className="flex flex-col gap-2 mb-4 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated GST (3%)</span>
                <span>₹{gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Insured Express Shipping</span>
                <span className="text-emerald-700 font-medium">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-base text-charcoal pt-2 border-t border-gray-100">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[0.7rem] text-gray-500 bg-[#FAF6F0] p-2.5 rounded-sm mb-4">
              <ShieldCheck size={16} className="text-gold-dark shrink-0" />
              <span>100% BIS Hallmarked & Insured Transit Guarantee</span>
            </div>

            <button
              disabled={isCheckoutLoading}
              onClick={async () => {
                setIsCheckoutLoading(true);
                await new Promise((resolve) => setTimeout(resolve, 300));
                setIsCheckoutLoading(false);
                onClose();
                onCheckout();
              }}
              className="btn-gold w-full py-3.5 text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-80"
            >
              {isCheckoutLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span>PROCEEDING...</span>
                </>
              ) : (
                <>
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
