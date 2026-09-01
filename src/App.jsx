import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeSection } from './components/HomeSection';
import { ShopPage } from './components/ShopPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { SellerStorePage } from './components/SellerStorePage';
import { CheckoutPage } from './components/CheckoutPage';
import { BuyerAccountPage } from './components/BuyerAccountPage';
import { SellerRegisterPage } from './components/SellerRegisterPage';
import { SellerDashboardPage } from './components/SellerDashboardPage';
import { AdminDashboardPage } from './components/AdminDashboardPage';
import { AboutPage } from './components/AboutPage';
import { BlogPage } from './components/BlogPage';
import { ContactPage } from './components/ContactPage';
import { SearchModal } from './components/SearchModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { PRODUCTS as INITIAL_PRODUCTS } from './data/marketplaceData';
import { api } from './services/api';

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState('home');
  const [activeRole, setActiveRole] = useState('BUYER');
  const [selectedProduct, setSelectedProduct] = useState(INITIAL_PRODUCTS[0]);
  const [selectedSellerId, setSelectedSellerId] = useState('seller-1');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Live products & sellers from Express Backend API
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  useEffect(() => {
    async function loadBackendData() {
      const res = await api.getProducts();
      if (res.success && res.data.length > 0) {
        setProducts(res.data);
        setSelectedProduct(res.data[0]);
      }
    }
    loadBackendData();
  }, []);

  // Interactive Drawer & Modal states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Cart & Wishlist state
  const [cartItems, setCartItems] = useState([
    {
      id: INITIAL_PRODUCTS[0].id,
      name: INITIAL_PRODUCTS[0].name,
      price: INITIAL_PRODUCTS[0].price,
      quantity: 1,
      image: INITIAL_PRODUCTS[0].images[0],
      sellerName: INITIAL_PRODUCTS[0].sellerName
    }
  ]);
  const [wishlistItems, setWishlistItems] = useState([INITIAL_PRODUCTS[1]]);

  // Handlers
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: product.quantity || 1,
          image: product.images ? product.images[0] : product.image,
          sellerName: product.sellerName
        }
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleRemoveCartItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActiveTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewSellerStore = (sellerId) => {
    setSelectedSellerId(sellerId);
    setActiveTab('seller-store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const wishlistIds = wishlistItems.map((item) => item.id);
  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="ratnaya-app-root">
      {/* HEADER */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        wishlistCount={wishlistItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        onNavigateCategory={handleSelectCategory}
      />

      {/* MAIN VIEW SWITCHER */}
      <main className="ratnaya-main-content">
        {activeRole === 'SELLER' && activeTab === 'seller-dashboard' ? (
          <SellerDashboardPage sellerId={selectedSellerId} />
        ) : activeRole === 'SELLER' && activeTab === 'seller-register' ? (
          <SellerRegisterPage onLoginSuccess={() => setActiveTab('seller-dashboard')} />
        ) : activeRole === 'ADMIN' && activeTab === 'admin-dashboard' ? (
          <AdminDashboardPage />
        ) : activeTab === 'about' ? (
          <AboutPage
            onNavigateShop={() => setActiveTab('shop')}
            onBecomeSeller={() => {
              setActiveRole('SELLER');
              setActiveTab('seller-register');
            }}
          />
        ) : activeTab === 'blog' ? (
          <BlogPage />
        ) : activeTab === 'contact' ? (
          <ContactPage />
        ) : activeTab === 'shop' ? (
          <ShopPage
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            productsList={products}
          />
        ) : activeTab === 'product-detail' ? (
          <ProductDetailPage
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlistIds.includes(selectedProduct?.id)}
            onCheckoutDirect={() => setActiveTab('checkout')}
            onViewSellerStore={handleViewSellerStore}
            onSelectProduct={handleSelectProduct}
          />
        ) : activeTab === 'seller-store' ? (
          <SellerStorePage
            sellerId={selectedSellerId}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
          />
        ) : activeTab === 'checkout' ? (
          <CheckoutPage
            cartItems={cartItems}
            onOrderPlaced={() => setCartItems([])}
            onNavigateShop={() => setActiveTab('shop')}
          />
        ) : activeTab === 'account' ? (
          <BuyerAccountPage
            wishlistItems={wishlistItems}
            onAddToCart={handleAddToCart}
            onNavigateShop={() => setActiveTab('shop')}
          />
        ) : (
          /* DEFAULT: HOMEPAGE */
          <HomeSection
            onSelectCategory={handleSelectCategory}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onNavigateShop={() => setActiveTab('shop')}
            onNavigateAbout={() => setActiveTab('about')}
            onBecomeSeller={() => {
              setActiveRole('SELLER');
              setActiveTab('seller-register');
            }}
            onSellerLogin={() => {
              setActiveRole('SELLER');
              setActiveTab('seller-dashboard');
            }}
          />
        )}
      </main>

      {/* FOOTER */}
      <Footer
        setActiveTab={setActiveTab}
        setActiveRole={setActiveRole}
        onSelectCategory={handleSelectCategory}
      />

      {/* OVERLAY MODALS & DRAWERS */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
        onNavigateShop={() => setActiveTab('shop')}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => setActiveTab('checkout')}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveWishlist={(id) =>
          setWishlistItems((prev) => prev.filter((i) => i.id !== id))
        }
        onAddToCart={handleAddToCart}
      />

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onViewFullDetail={handleSelectProduct}
        onViewSellerStore={handleViewSellerStore}
      />
    </div>
  );
}
