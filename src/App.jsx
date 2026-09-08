import React, { useState, useEffect, useRef } from 'react';
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
import { CollectionsPage } from './components/CollectionsPage';
import { ContactPage } from './components/ContactPage';
import { ShippingPolicyPage } from './components/ShippingPolicyPage';
import { TermsPage } from './components/TermsPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { FaqPage } from './components/FaqPage';
import { SearchModal } from './components/SearchModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { AuthModal } from './components/AuthModal';
import { LogoIntroSplash } from './components/LogoIntroSplash';
import { PRODUCTS as INITIAL_PRODUCTS } from './data/marketplaceData';
import { api } from './services/api';

export default function App() {
  // Navigation & View state
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [activeRole, setActiveRole] = useState('BUYER');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ratnaya_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [selectedProduct, setSelectedProduct] = useState(INITIAL_PRODUCTS[0]);
  const [selectedSellerId, setSelectedSellerId] = useState('seller-1');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Live products & sellers from Express Backend API
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  useEffect(() => {
    // Scroll to top on tab change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Sync state when currentUser changes
  useEffect(() => {
    if (currentUser && currentUser.role) {
      setActiveRole(currentUser.role);
    }
  }, [currentUser]);

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

  // Cart & Wishlist state (Default to 0 / empty array until items added)
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Body Scroll Lock effect when drawers or modals are open
  useEffect(() => {
    if (isSearchOpen || isCartOpen || isWishlistOpen || quickViewProduct || isAuthOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSearchOpen, isCartOpen, isWishlistOpen, quickViewProduct, isAuthOpen]);

  const effectiveUserId = currentUser ? currentUser.id || currentUser._id || 'buyer-1' : 'buyer-guest';

  const isCartLoaded = useRef(false);
  const isWishlistLoaded = useRef(false);
  const skipCartSync = useRef(false);
  const skipWishlistSync = useRef(false);

  // Reset loaded flags when effectiveUserId changes
  useEffect(() => {
    isCartLoaded.current = false;
    isWishlistLoaded.current = false;
  }, [effectiveUserId]);

  // Load user's Cart and Wishlist from MongoDB on load or user change
  useEffect(() => {
    let isMounted = true;
    async function loadUserData() {
      try {
        const [cartRes, wishRes] = await Promise.all([
          api.getCart(effectiveUserId),
          api.getWishlist(effectiveUserId)
        ]);

        if (isMounted) {
          if (cartRes && Array.isArray(cartRes.items) && cartRes.items.length > 0) {
            const mappedCart = cartRes.items.map((i) => ({
              id: i.productId,
              name: i.name,
              price: i.price,
              image: i.image,
              sellerName: i.sellerName,
              quantity: i.qty || 1
            }));
            skipCartSync.current = true;
            setCartItems(mappedCart);
          } else {
            skipCartSync.current = true;
            setCartItems([]);
          }

          if (wishRes && Array.isArray(wishRes.items) && wishRes.items.length > 0) {
            const mappedWish = wishRes.items.map((i) => ({
              id: i.productId,
              name: i.name,
              price: i.price,
              image: i.image,
              sellerName: i.sellerName
            }));
            skipWishlistSync.current = true;
            setWishlistItems(mappedWish);
          } else {
            skipWishlistSync.current = true;
            setWishlistItems([]);
          }

          isCartLoaded.current = true;
          isWishlistLoaded.current = true;
        }
      } catch (e) {
        console.warn('Cart & Wishlist MongoDB API load fallback:', e);
      }
    }
    loadUserData();
    return () => {
      isMounted = false;
    };
  }, [effectiveUserId]);

  // Sync Cart with MongoDB whenever cartItems changes after initial load
  useEffect(() => {
    if (!isCartLoaded.current) return;
    if (skipCartSync.current) {
      skipCartSync.current = false;
      return;
    }
    const formattedItems = cartItems.map((item) => ({
      productId: item.id || 'prod-1',
      name: item.name || 'Jewellery Item',
      price: item.price || 0,
      image: item.image || (item.images ? item.images[0] : ''),
      sellerName: item.sellerName || 'Ratnaya Seller',
      qty: item.quantity || 1
    }));
    api.syncCart(effectiveUserId, formattedItems).catch((err) => {
      console.error('Failed to sync cart with MongoDB:', err);
    });
  }, [cartItems, effectiveUserId]);

  // Sync Wishlist with MongoDB whenever wishlistItems changes after initial load
  useEffect(() => {
    if (!isWishlistLoaded.current) return;
    if (skipWishlistSync.current) {
      skipWishlistSync.current = false;
      return;
    }
    const formattedItems = wishlistItems.map((item) => ({
      productId: item.id || 'prod-1',
      name: item.name || 'Jewellery Item',
      price: item.price || 0,
      image: item.images ? item.images[0] : item.image || '',
      sellerName: item.sellerName || 'Ratnaya Seller',
      category: item.category || 'Jewellery'
    }));
    api.syncWishlist(effectiveUserId, formattedItems).catch((err) => {
      console.error('Failed to sync wishlist with MongoDB:', err);
    });
  }, [wishlistItems, effectiveUserId]);

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
    api.removeFromCart(effectiveUserId, id).catch((err) => {
      console.error('Failed to remove item from MongoDB cart:', err);
    });
  };

  const handleToggleWishlist = (product) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        api.removeFromWishlist(effectiveUserId, product.id).catch((err) => {
          console.error('Failed to remove item from MongoDB wishlist:', err);
        });
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActiveTab('product-detail');
  };

  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setActiveTab('shop');
  };

  const handleViewSellerStore = (sellerId) => {
    setSelectedSellerId(sellerId);
    setActiveTab('seller-store');
  };

  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    if (userData && userData.role) {
      setActiveRole(userData.role);
      if (userData.role === 'SELLER') {
        setActiveTab('seller-dashboard');
      } else if (userData.role === 'ADMIN') {
        setActiveTab('admin-dashboard');
      }
    }
    localStorage.setItem('ratnaya_user', JSON.stringify(userData));
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveRole('BUYER');
    localStorage.removeItem('ratnaya_user');
    setActiveTab('home');
  };

  const wishlistIds = wishlistItems.map((item) => item.id);
  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="ratnaya-app-root">
      {/* BRAND VIDEO ANIMATION SPLASH INTRO ON PAGE LOAD */}
      {showIntro && <LogoIntroSplash onFinish={() => setShowIntro(false)} />}
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
        onOpenAuthModal={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* MAIN VIEW SWITCHER */}
      <main className="ratnaya-main-content">
        {activeTab === 'seller-dashboard' ? (
          currentUser && currentUser.role === 'SELLER' ? (
            <SellerDashboardPage currentUser={currentUser} sellerId={currentUser.id} />
          ) : (
            <div style={{ padding: '100px 20px', textAlign: 'center', backgroundColor: '#FAF6F0', minHeight: '60vh' }}>
              <div className="container" style={{ maxWidth: '500px', backgroundColor: '#FFF', padding: '40px', border: '1px solid var(--color-border-gold)', borderRadius: '4px' }}>
                <h2 style={{ fontFamily: "'Marcellus', serif", marginBottom: '12px' }}>Merchant Login Required</h2>
                <p style={{ color: '#777', fontSize: '0.9rem', marginBottom: '24px' }}>
                  Please Sign In or Register your Jeweller Account to access your Merchant Dashboard.
                </p>
                <button onClick={() => setIsAuthOpen(true)} className="btn-gold" style={{ width: '100%', padding: '14px' }}>
                  SIGN IN / REGISTER AS SELLER
                </button>
              </div>
            </div>
          )
        ) : activeTab === 'seller-register' ? (
          <SellerRegisterPage onLoginSuccess={(sellerData) => handleAuthSuccess(sellerData)} />
        ) : activeTab === 'admin-dashboard' ? (
          currentUser && currentUser.role === 'ADMIN' ? (
            <AdminDashboardPage />
          ) : (
            <div style={{ padding: '100px 20px', textAlign: 'center', backgroundColor: '#FAF6F0', minHeight: '60vh' }}>
              <div className="container" style={{ maxWidth: '500px', backgroundColor: '#FFF', padding: '40px', border: '1px solid var(--color-border-gold)', borderRadius: '4px' }}>
                <h2 style={{ fontFamily: "'Marcellus', serif", marginBottom: '12px' }}>Admin Governance Login Required</h2>
                <p style={{ color: '#777', fontSize: '0.9rem', marginBottom: '24px' }}>
                  Please Sign In with your Admin Credentials to access Central Governance.
                </p>
                <button onClick={() => setIsAuthOpen(true)} className="btn-gold" style={{ width: '100%', padding: '14px' }}>
                  SIGN IN AS ADMIN
                </button>
              </div>
            </div>
          )
        ) : activeTab === 'account' ? (
          currentUser ? (
            <BuyerAccountPage
              user={currentUser}
              wishlistItems={wishlistItems}
              onAddToCart={handleAddToCart}
              onNavigateShop={() => setActiveTab('shop')}
            />
          ) : (
            <div style={{ padding: '100px 20px', textAlign: 'center', backgroundColor: '#FAF6F0', minHeight: '60vh' }}>
              <div className="container" style={{ maxWidth: '500px', backgroundColor: '#FFF', padding: '40px', border: '1px solid var(--color-border-gold)', borderRadius: '4px' }}>
                <h2 style={{ fontFamily: "'Marcellus', serif", marginBottom: '12px' }}>Patron Login Required</h2>
                <p style={{ color: '#777', fontSize: '0.9rem', marginBottom: '24px' }}>
                  Please Sign In or Create an Account to view your Patron Profile and Orders.
                </p>
                <button onClick={() => setIsAuthOpen(true)} className="btn-gold" style={{ width: '100%', padding: '14px' }}>
                  SIGN IN / CREATE BUYER ACCOUNT
                </button>
              </div>
            </div>
          )
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
        ) : activeTab === 'collections' ? (
          <CollectionsPage
            onSelectCategory={handleSelectCategory}
            onSelectProduct={handleSelectProduct}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
            onNavigateShop={() => setActiveTab('shop')}
          />
        ) : activeTab === 'contact' ? (
          <ContactPage />
        ) : activeTab === 'shipping-policy' ? (
          <ShippingPolicyPage
            onNavigateShop={() => setActiveTab('shop')}
            onNavigateContact={() => setActiveTab('contact')}
          />
        ) : activeTab === 'terms-conditions' ? (
          <TermsPage
            onNavigateShop={() => setActiveTab('shop')}
            onNavigateContact={() => setActiveTab('contact')}
          />
        ) : activeTab === 'privacy-policy' ? (
          <PrivacyPolicyPage
            onNavigateShop={() => setActiveTab('shop')}
            onNavigateContact={() => setActiveTab('contact')}
          />
        ) : activeTab === 'faq' ? (
          <FaqPage
            onNavigateShop={() => setActiveTab('shop')}
            onNavigateContact={() => setActiveTab('contact')}
          />
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
            onOrderPlaced={() => {
              setCartItems([]);
              api.clearCart(effectiveUserId).catch(() => {});
            }}
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
              setIsAuthOpen(true);
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
        onRemoveWishlist={(id) => {
          setWishlistItems((prev) => prev.filter((i) => i.id !== id));
          api.removeFromWishlist(effectiveUserId, id).catch(() => {});
        }}
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

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
