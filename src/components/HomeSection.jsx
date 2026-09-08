import React, { useState } from 'react';
import { HeroSlider } from './HeroSlider';
import { NewArrivalsSliderSection } from './NewArrivalsSliderSection';
import { BrandStatementSection } from './BrandStatementSection';
import { JewelleryVideoAccordionSection } from './JewelleryVideoAccordionSection';
import { CountdownDeal } from './CountdownDeal';
import { ScrollReveal } from './ScrollReveal';
import {
  CATEGORIES,
  PRODUCTS,
  TESTIMONIALS
} from '../data/marketplaceData';
import {
  ArrowRight,
  Heart,
  Eye,
  ShoppingBag,
  Star,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Lock,
  Store,
  CheckCircle2,
  Mail,
  Sparkles,
  Loader2
} from 'lucide-react';

export function HomeSection({
  onSelectCategory,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  onNavigateShop,
  onNavigateAbout,
  onBecomeSeller,
  onSellerLogin
}) {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const newArrivals = PRODUCTS.slice(0, 8); // 8 Swarna showcase products

  // Curate exactly 10 distinct products across different categories
  const signatureCollection = React.useMemo(() => {
    const categoriesSeen = new Set();
    const curated = [];

    // Pass 1: Select 1 item per unique category
    for (const prod of PRODUCTS) {
      if (!categoriesSeen.has(prod.category) && curated.length < 10) {
        categoriesSeen.add(prod.category);
        curated.push(prod);
      }
    }

    // Pass 2: Fill up to exactly 10 products
    for (const prod of PRODUCTS) {
      if (curated.length >= 10) break;
      if (!curated.some((p) => p.id === prod.id)) {
        curated.push(prod);
      }
    }

    return curated;
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmailInput('');
      }, 4000);
    }
  };

  return (
    <div className="ratnaya-homepage overflow-x-hidden">
      {/* SECTION 1 — HERO SLIDER */}
      <HeroSlider onNavigateShop={onNavigateShop} onSelectCategory={onSelectCategory} />

      {/* SECTION 2 — NEW ARRIVALS ENDLESS CHOICES 8-PRODUCT SLIDER (SWARNA THEME) */}
      <NewArrivalsSliderSection
        onSelectProduct={onSelectProduct}
        onQuickView={onQuickView}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistIds={wishlistIds}
      />

      {/* SECTION 2 — SWARNA STATEMENT & BRAND VALUES (Commented out per user request) */}
      {/* <BrandStatementSection /> */}

      {/* SECTION 3 — 4-COLUMN INTERACTIVE VIDEO ACCORDION */}
      <JewelleryVideoAccordionSection onSelectCategory={onSelectCategory} onNavigateShop={onNavigateShop} />

      {/* SECTION 2 — INTRO / BRAND STORY */}
      <section
        id="section-brand"
        className="py-16 sm:py-24 bg-[#FAF6F0] border-b border-borderGold/20 overflow-hidden"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <ScrollReveal animation="fade-left">
              <div>
                <span className="eyebrow">TIMELESS SOPHISTICATION</span>
                <h2 className="section-title text-2xl sm:text-4xl">"Jewellery Designed to Become Part of Your Story"</h2>
                <p className="text-base sm:text-lg text-brownMuted leading-relaxed mb-4 font-light">
                  Ratnaya brings together centuries of royal Indian goldsmithing, certified diamond craftsmanship, and contemporary elegance under one canopy.
                </p>
                <p className="text-sm sm:text-base text-charcoal leading-relaxed mb-8">
                  Connecting discerning patrons directly with trusted independent jewellers from Jaipur, Mumbai, Hyderabad, and Kolkata, every piece is accompanied by 6-digit HUID BIS hallmarking and international certificates.
                </p>
                <button onClick={onNavigateAbout} className="btn-outline-gold py-3 px-8">
                  KNOW MORE <ArrowRight size={15} />
                </button>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-right">
              <div className="relative">
                <div className="aspect-[4/3] rounded-md overflow-hidden shadow-medium border border-borderGold">
                  <img
                    src="/assets/jewellery/necklace/videoframe_3765.png"
                    alt="Jewellery Story"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="hidden sm:block absolute -top-4 -right-4 w-full h-full border border-gold rounded-md -z-10" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 3 — FEATURE / BENEFITS */}
      <section className="py-12 sm:py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 text-center">
            <div className="p-4 sm:p-6 rounded-lg bg-beige-light/50 border border-borderGold/20 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-gold hover:border-gold/50 cursor-pointer">
              <Store size={32} className="mx-auto mb-3 text-gold-dark transform hover:scale-110 transition-transform duration-300" />
              <h4 className="text-sm sm:text-base font-semibold mb-1">Trusted Sellers</h4>
              <p className="text-xs text-gray-500">Vetted heritage goldsmiths</p>
            </div>
            <div className="p-4 sm:p-6 rounded-lg bg-beige-light/50 border border-borderGold/20 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-gold hover:border-gold/50 cursor-pointer">
              <Award size={32} className="mx-auto mb-3 text-gold-dark transform hover:scale-110 transition-transform duration-300" />
              <h4 className="text-sm sm:text-base font-semibold mb-1">Authentic Jewellery</h4>
              <p className="text-xs text-gray-500">100% BIS Hallmarked</p>
            </div>
            <div className="p-4 sm:p-6 rounded-lg bg-beige-light/50 border border-borderGold/20 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-gold hover:border-gold/50 cursor-pointer">
              <Lock size={32} className="mx-auto mb-3 text-gold-dark transform hover:scale-110 transition-transform duration-300" />
              <h4 className="text-sm sm:text-base font-semibold mb-1">Secure Payments</h4>
              <p className="text-xs text-gray-500">Encrypted UPI & Cards</p>
            </div>
            <div className="p-4 sm:p-6 rounded-lg bg-beige-light/50 border border-borderGold/20 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-gold hover:border-gold/50 cursor-pointer">
              <Truck size={32} className="mx-auto mb-3 text-gold-dark transform hover:scale-110 transition-transform duration-300" />
              <h4 className="text-sm sm:text-base font-semibold mb-1">Fast Shipping</h4>
              <p className="text-xs text-gray-500">Insured express delivery</p>
            </div>
            <div className="p-4 sm:p-6 rounded-lg bg-beige-light/50 border border-borderGold/20 col-span-2 sm:col-span-1 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-gold hover:border-gold/50 cursor-pointer">
              <RotateCcw size={32} className="mx-auto mb-3 text-gold-dark transform hover:scale-110 transition-transform duration-300" />
              <h4 className="text-sm sm:text-base font-semibold mb-1">Easy Returns</h4>
              <p className="text-xs text-gray-500">14-day return guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — JEWELLERY CATEGORIES */}
      <section className="py-16 sm:py-24 bg-[#FAF6F0] border-y border-borderGold/20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-10 sm:mb-14">
              <span className="eyebrow">CURATED SELECTION</span>
              <h2 className="section-title text-2xl sm:text-4xl">Jewellery Categories</h2>
              <p className="section-subtitle text-sm sm:text-base">
                Discover exquisitely designed creations suited for every occasion
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {CATEGORIES.map((cat, idx) => {
              // Alternate direction: Left column from left, Center from bottom, Right column from right!
              const animDirection = idx % 3 === 0 ? 'fade-left' : idx % 3 === 1 ? 'fade-up' : 'fade-right';
              const animDelay = (idx % 3) * 120;

              return (
                <ScrollReveal key={cat.id} animation={animDirection} delay={animDelay}>
                  <div
                    onClick={() => onSelectCategory(cat.id)}
                    className="group relative aspect-[1/1.1] overflow-hidden cursor-pointer rounded-md bg-white border border-gray-200 shadow-sm hover:shadow-gold hover:border-gold/60 transition-all duration-500 hover:-translate-y-2"
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 text-white transition-colors duration-500">
                      <span className="text-xs text-[#E5C888] tracking-widest uppercase font-semibold transform group-hover:translate-x-1 transition-transform duration-300">
                        {cat.count}
                      </span>
                      <h3 className="font-heading text-xl sm:text-2xl text-white mt-1 transform group-hover:-translate-y-0.5 transition-transform duration-300" style={{ color: '#FFFFFF' }}>{cat.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-300 my-1.5 line-clamp-2">{cat.description}</p>
                      <span className="text-xs tracking-wider uppercase text-gold flex items-center gap-1.5 font-semibold group-hover:translate-x-2.5 transition-transform duration-300">
                        Explore Collection →
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5 — NEW ARRIVALS */}
      <section id="section-new-arrivals" className="py-16 sm:py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-10 sm:mb-14">
              <span className="eyebrow">EXCLUSIVE SHOWCASE</span>
              <h2 className="section-title text-2xl sm:text-4xl">Curated Jewellery Collection</h2>
              <p className="section-subtitle text-sm sm:text-base">
                Discover the latest creations handcrafted by our verified jewellers
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((prod, idx) => {
              const animDirection = idx % 4 === 0 ? 'fade-left' : idx % 4 === 3 ? 'fade-right' : 'fade-up';
              const animDelay = (idx % 4) * 90;

              return (
                <ScrollReveal key={prod.id} animation={animDirection} delay={animDelay}>
                  <ProductCard
                    product={prod}
                    onSelectProduct={onSelectProduct}
                    onQuickView={onQuickView}
                    onAddToCart={onAddToCart}
                    onToggleWishlist={onToggleWishlist}
                    isWishlisted={wishlistIds.includes(prod.id)}
                  />
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6 — DEAL / PROMOTIONAL BANNER WITH COUNTDOWN */}
      <CountdownDeal onNavigateShop={onNavigateShop} />

      {/* SECTION 7 — NECKLACE FEATURE */}
      <section className="py-16 sm:py-24 bg-[#FAF6F0] border-b border-borderGold/20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <ScrollReveal animation="fade-left">
              <div className="group aspect-[4/3] rounded-md overflow-hidden border border-borderGold shadow-md cursor-pointer">
                <img src="/assets/jewellery/necklace/1.jpg" alt="Radiate Beauty With Necklaces" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-right">
              <div>
                <span className="eyebrow">ROYAL NECKLACE COLLECTION</span>
                <h2 className="section-title text-2xl sm:text-4xl">Radiate Beauty With Necklaces</h2>
                <h4 className="text-lg sm:text-xl text-gold-dark font-heading mb-4 font-normal">
                  "A Symbol of Love, Beauty and Sophistication"
                </h4>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
                  Adorn your neck with royal Kundan chokers, Basra pearl strands, and glowing Zambian emerald haar crafted for grand wedding celebrations.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={onNavigateAbout} className="btn-outline px-6 py-3">KNOW MORE</button>
                  <button onClick={onNavigateShop} className="btn-gold px-6 py-3">SHOP NOW <ArrowRight size={15} /></button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 8 — BRACELET FEATURE */}
      <section className="py-16 sm:py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <ScrollReveal animation="fade-left">
              <div className="order-2 lg:order-1">
                <span className="eyebrow">WRISTWEAR ESSENTIALS</span>
                <h2 className="section-title text-2xl sm:text-4xl">Unleash Your Style With Our Unique Bracelets</h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
                  From continuous 18K rose gold tennis diamond strands to handcrafted Bengali filigree gold bangles, elevate every gesture with luxury.
                </p>
                <button onClick={onNavigateShop} className="btn-gold px-8 py-3.5">
                  SHOP NOW <ArrowRight size={15} />
                </button>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-right">
              <div className="order-1 lg:order-2 group aspect-[4/3] rounded-md overflow-hidden border border-borderGold shadow-md cursor-pointer">
                <img src="/assets/jewellery/bracelet/1.jpg" alt="Unique Bracelets" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* SECTION 9 — PRODUCT COLLECTION */}
      <section className="py-16 sm:py-24 bg-[#FAF6F0] border-t border-borderGold/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <span className="eyebrow">SIGNATURE SELECTION</span>
            <h2 className="section-title text-2xl sm:text-4xl">Your Style, Our Collection</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {signatureCollection.map((prod) => (
              <ProductCard
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

          <div className="text-center mt-12">
            <button
              onClick={onNavigateShop}
              className="btn-gold py-3.5 px-8 text-xs tracking-widest font-semibold"
            >
              EXPLORE FULL CATALOG <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 10 — TESTIMONIALS */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <span className="eyebrow">HAPPY PATRONS</span>
            <h2 className="section-title text-2xl sm:text-4xl">Joyful Moments, Told</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-[#FAF6F0] p-6 sm:p-8 border border-borderGold/30 rounded-md flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex text-amber-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" stroke="none" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-charcoal leading-relaxed italic mb-6">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-borderGold/20">
                  <h5 className="text-sm font-semibold text-charcoal">{t.name}</h5>
                  <span className="text-xs text-gray-500">{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 11 — NEWSLETTER */}
      <section className="py-16 bg-[#FAF6F0] border-t border-borderGold/20 text-center">
        <div className="container mx-auto px-4 sm:px-6 max-w-xl">
          <Mail size={32} className="mx-auto text-gold-dark mb-3" />
          <span className="eyebrow">JOIN THE CIRCLE</span>
          <h2 className="section-title text-2xl sm:text-3xl">Stay Informed, Always</h2>
          <p className="section-subtitle text-xs sm:text-sm mb-6">
            Discover new collections, exclusive pieces and special offers from Ratnaya.
          </p>

          {subscribed ? (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-md font-medium flex items-center justify-center gap-2 text-sm">
              <CheckCircle2 size={18} /> Thank you for subscribing to Ratnaya updates!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 mt-4">
              <input
                type="email"
                required
                maxLength={70}
                placeholder="Enter your email address..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="input-field flex-1 bg-white text-sm"
              />
              <button type="submit" className="btn-gold py-3 px-6 text-xs whitespace-nowrap">
                SUBSCRIBE
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

function ProductCard({
  product,
  onSelectProduct,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}) {
  const [adding, setAdding] = useState(false);

  return (
    <div className="product-card group rounded-sm bg-white border border-gray-200 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-medium hover:border-gold/50 h-full">
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
          className={`wishlist-btn absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all z-10 shadow-sm border-none cursor-pointer hover:scale-105 ${isWishlisted ? 'text-red-500 bg-white' : 'text-charcoal hover:text-red-500'
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
