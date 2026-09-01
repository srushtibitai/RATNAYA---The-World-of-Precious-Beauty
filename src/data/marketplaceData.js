// RATNAYA — Marketplace Mock Data Store

export const HERO_SLIDES = [
  {
    id: 1,
    eyebrow: 'UNPARALLELED',
    title: 'Jewellery That Defines Your Elegance',
    description: 'Discover timeless pieces created to celebrate your most beautiful moments.',
    cta: 'SHOP NOW',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=2000',
    link: 'shop'
  },
  {
    id: 2,
    eyebrow: 'ROYAL HERITAGE',
    title: 'Crafted With Passion & Authenticity',
    description: 'Bespoke 22K gold and GIA-certified solitaire creations from India’s finest master goldsmiths.',
    cta: 'EXPLORE COLLECTIONS',
    image: '/assets/jewellery/necklace/videoframe_3765.png',
    link: 'shop'
  },
  {
    id: 3,
    eyebrow: 'BRIDAL HEIRLOOMS',
    title: 'Your Moment Deserves Pure Splendor',
    description: 'Handcrafted Nizam Polki, emerald chokers, and uncut diamond treasure for your special day.',
    cta: 'DISCOVER BRIDAL EDIT',
    image: '/assets/jewellery/necklace/8.jpg',
    link: 'shop'
  }
];

export const CATEGORIES = [
  { id: 'earrings', name: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800', description: 'Intricate Chandbalis & Solitaire Studs', count: '185 Pieces' },
  { id: 'rings', name: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800', description: '22K Gold Bands & Engagement Solitaires', count: '142 Pieces' },
  { id: 'bracelets', name: 'Bracelets', image: '/assets/jewellery/bracelet/1.jpg', description: 'Diamond Tennis & Gold Charm Bracelets', count: '94 Pieces' },
  { id: 'pendants', name: 'Pendants', image: '/assets/jewellery/necklace/3.jpg', description: 'Solitaire & Lotus Gemstone Pendants', count: '115 Pieces' },
  { id: 'necklaces', name: 'Necklaces', image: '/assets/jewellery/necklace/1.jpg', description: 'Royal Kundan & Ruby Chokers', count: '210 Pieces' },
  { id: 'bangles', name: 'Bangles', image: '/assets/jewellery/ring/2.jpg', description: 'Filigree & Nakshi Gold Bangle Pairs', count: '76 Pieces' }
];

export const COLLECTIONS = [
  {
    id: 'bridal-edit',
    title: 'Bridal Edit',
    subtitle: 'Royal Kundan & Heritage Polki',
    description: 'Bespoke wedding masterpieces crafted with 22K gold, un-cut diamonds and Zambian emeralds.',
    image: '/assets/jewellery/necklace/videoframe_3765.png',
    link: '/shop?collection=bridal'
  },
  {
    id: 'everyday-elegance',
    title: 'Everyday Elegance',
    subtitle: 'Minimal Luxury Essentials',
    description: 'Subtle 18K gold bands, delicate solitaire pendants, and featherweight diamond hoops.',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800',
    link: '/shop?collection=everyday'
  },
  {
    id: 'statement-jewellery',
    title: 'Statement Jewellery',
    subtitle: 'Artisanal Nizam Treasures',
    description: 'Captivating ruby chokers and grand multi-layered haar designed for royal presence.',
    image: '/assets/jewellery/necklace/7.jpg',
    link: '/shop?collection=statement'
  }
];

export const SELLERS = [
  {
    id: 'seller-1',
    name: 'Kundan Jewels Jaipur',
    owner: 'Vikramaditya Rathore',
    city: 'Jaipur, Rajasthan',
    rating: 4.9,
    reviewsCount: 148,
    productsCount: 64,
    verified: true,
    joinedDate: '2023-04-12',
    logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200',
    about: 'Master artisans of authentic Jadau, Kundan, and Meenakari heritage jewellery from Johari Bazaar, Jaipur for 3 generations.',
    gst: '08AAAAA0000A1Z5',
    pan: 'ABCDE1234F',
    status: 'Approved',
    commissionRate: 10
  },
  {
    id: 'seller-2',
    name: 'Veda Diamonds Mumbai',
    owner: 'Aditi Shah',
    city: 'Mumbai, Maharashtra',
    rating: 5.0,
    reviewsCount: 312,
    productsCount: 92,
    verified: true,
    joinedDate: '2022-11-05',
    logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
    about: 'Contemporary GIA-certified diamond creations, engagement solitaires, and red carpet high jewellery atelier based in BKC Mumbai.',
    gst: '27BBBBB1111B1Z9',
    pan: 'XYZPD9876Q',
    status: 'Approved',
    commissionRate: 10
  },
  {
    id: 'seller-3',
    name: 'Heritage Gold Kolkata',
    owner: 'Subhash Roy',
    city: 'Kolkata, West Bengal',
    rating: 4.8,
    reviewsCount: 95,
    productsCount: 41,
    verified: true,
    joinedDate: '2023-08-20',
    logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200',
    about: 'Intricate Bengali handcrafted 22K light-weight gold filigree & traditional Nakshi work.',
    gst: '19CCCCC2222C1Z3',
    pan: 'KLMNO5432R',
    status: 'Approved',
    commissionRate: 10
  },
  {
    id: 'seller-4',
    name: 'Royal Nizam Polki Hyderabad',
    owner: 'Mirza Baig',
    city: 'Hyderabad, Telangana',
    rating: 4.9,
    reviewsCount: 76,
    productsCount: 38,
    verified: true,
    joinedDate: '2024-01-15',
    logo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200',
    about: 'Authentic Hyderabadi Nizam era un-cut diamond Polki & Basra pearl heirlooms.',
    gst: '36DDDDD3333D1Z1',
    pan: 'PRSTU7890S',
    status: 'Approved',
    commissionRate: 12
  }
];

export const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Gold Bangle Pair',
    category: 'bangles',
    categoryName: 'Bangles',
    sellerId: 'seller-3',
    sellerName: 'Heritage Gold Kolkata',
    sellerRating: 4.9,
    price: 142000,
    originalPrice: 158000,
    discountPercent: 10,
    rating: 4.9,
    reviewsCount: 34,
    isNew: true,
    isBestSeller: true,
    stock: 5,
    sku: 'HGK-BN-101',
    metal: '22K Gold',
    purity: '22K (916 BIS Hallmarked)',
    weight: '42.5 grams',
    gemstone: 'Pure Solid Gold',
    material: 'Yellow Gold',
    color: 'Warm 22K Gold',
    size: '2.6 Size',
    images: [
      '/assets/jewellery/ring/2.jpg',
      '/assets/jewellery/bracelet/1.jpg',
      '/assets/jewellery/bracelet/1-1.jpg'
    ],
    description: 'Iconic 22K solid gold bangles with intricate Nakshi wirework filigree.',
    specifications: [
      { label: 'Gold Purity', value: '22K BIS Hallmarked' },
      { label: 'Weight', value: '42.50 grams' }
    ],
    approvalStatus: 'Approved'
  },
  {
    id: 'prod-2',
    name: 'Adjustable Gold Chain',
    category: 'necklaces',
    categoryName: 'Necklaces',
    sellerId: 'seller-1',
    sellerName: 'Kundan Jewels Jaipur',
    sellerRating: 4.9,
    price: 68000,
    originalPrice: 75000,
    discountPercent: 9,
    rating: 4.8,
    reviewsCount: 29,
    isNew: true,
    isBestSeller: false,
    stock: 8,
    sku: 'KJJ-CH-202',
    metal: '22K Gold',
    purity: '22K Gold',
    weight: '16.2 grams',
    gemstone: 'None',
    material: 'Yellow Gold',
    color: 'Yellow Gold',
    size: '18 - 22 Inch Adjustable',
    images: [
      '/assets/jewellery/necklace/1.jpg',
      '/assets/jewellery/necklace/1-1.jpg'
    ],
    description: 'Versatile handcrafted 22K gold rope chain with adjustable ball clasp.',
    approvalStatus: 'Approved'
  },
  {
    id: 'prod-3',
    name: 'Couple Ring Set',
    category: 'rings',
    categoryName: 'Rings',
    sellerId: 'seller-2',
    sellerName: 'Veda Diamonds Mumbai',
    sellerRating: 5.0,
    price: 115000,
    originalPrice: 130000,
    discountPercent: 12,
    rating: 5.0,
    reviewsCount: 45,
    isNew: true,
    isBestSeller: true,
    stock: 4,
    sku: 'VDM-RG-303',
    metal: '18K White & Rose Gold',
    purity: '18K 750 Hallmarked',
    weight: '9.4 grams pair',
    gemstone: '0.5 Ct Pavé Diamonds',
    material: 'Dual Tone Gold & Diamonds',
    color: 'Platinum White & Rose',
    size: 'His 18 & Her 14',
    images: [
      '/assets/jewellery/ring/1.jpg',
      '/assets/jewellery/ring/1-1.jpg'
    ],
    description: 'Matching dual-tone couple bands featuring continuous pavé diamonds.',
    approvalStatus: 'Approved'
  },
  {
    id: 'prod-4',
    name: 'Lightweight Chain',
    category: 'necklaces',
    categoryName: 'Necklaces',
    sellerId: 'seller-3',
    sellerName: 'Heritage Gold Kolkata',
    sellerRating: 4.8,
    price: 42000,
    originalPrice: 48000,
    discountPercent: 13,
    rating: 4.7,
    reviewsCount: 18,
    isNew: true,
    isBestSeller: false,
    stock: 10,
    sku: 'HGK-CH-404',
    metal: '18K Yellow Gold',
    purity: '18K BIS',
    weight: '8.5 grams',
    gemstone: 'None',
    material: 'Yellow Gold',
    color: 'Champagne Gold',
    size: '18 Inch',
    images: [
      '/assets/jewellery/necklace/6.jpg',
      '/assets/jewellery/necklace/6-1.jpg'
    ],
    description: 'Featherweight 18K gold snake link chain suitable for daily wear.',
    approvalStatus: 'Approved'
  },
  {
    id: 'prod-5',
    name: 'Classic Gold Hoops',
    category: 'earrings',
    categoryName: 'Earrings',
    sellerId: 'seller-1',
    sellerName: 'Kundan Jewels Jaipur',
    sellerRating: 4.9,
    price: 36000,
    originalPrice: 42000,
    discountPercent: 14,
    rating: 4.9,
    reviewsCount: 52,
    isNew: true,
    isBestSeller: true,
    stock: 12,
    sku: 'KJJ-ER-505',
    metal: '22K Gold',
    purity: '22K BIS 916',
    weight: '6.8 grams',
    gemstone: 'None',
    material: 'Yellow Gold',
    color: 'High Polish Gold',
    size: '1.2 Inch Diameter',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
      '/assets/jewellery/necklace/5.jpg'
    ],
    description: 'Timeless polished 22K gold hollow hoop earrings with snap closure.',
    approvalStatus: 'Approved'
  },
  {
    id: 'prod-6',
    name: 'Pearl Bird Necklace',
    category: 'necklaces',
    categoryName: 'Necklaces',
    sellerId: 'seller-4',
    sellerName: 'Royal Nizam Polki Hyderabad',
    sellerRating: 4.9,
    price: 245000,
    originalPrice: 280000,
    discountPercent: 12,
    rating: 4.9,
    reviewsCount: 22,
    isNew: true,
    isBestSeller: true,
    stock: 3,
    sku: 'RNP-NK-606',
    metal: '22K Gold',
    purity: '22K Gold',
    weight: '68.0 grams',
    gemstone: 'South Sea Pearl & Ruby',
    material: 'Gold, Pearl & Ruby',
    color: 'Gold & Ivory Pearl',
    size: '18 Inch Choker',
    images: [
      '/assets/jewellery/necklace/3.jpg',
      '/assets/jewellery/necklace/4.jpg'
    ],
    description: 'Ornate peacock bird motif linked with natural South Sea pearls and rubies.',
    approvalStatus: 'Approved'
  },
  {
    id: 'prod-7',
    name: 'Pearl Earrings',
    category: 'earrings',
    categoryName: 'Earrings',
    sellerId: 'seller-4',
    sellerName: 'Royal Nizam Polki Hyderabad',
    sellerRating: 4.9,
    price: 58000,
    originalPrice: 65000,
    discountPercent: 11,
    rating: 4.8,
    reviewsCount: 16,
    isNew: true,
    isBestSeller: false,
    stock: 7,
    sku: 'RNP-ER-707',
    metal: '18K Yellow Gold',
    purity: '18K Hallmarked',
    weight: '11.2 grams',
    gemstone: 'Cultured Freshwater Pearls',
    material: 'Gold & Pearl',
    color: 'Pearl White & Gold',
    size: '1.5 Inch Drop',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Lustrous freshwater pearl drops framed in solid 18K yellow gold.',
    approvalStatus: 'Approved'
  },
  {
    id: 'prod-8',
    name: 'Crystal Heart Necklace',
    category: 'pendants',
    categoryName: 'Pendants',
    sellerId: 'seller-2',
    sellerName: 'Veda Diamonds Mumbai',
    sellerRating: 5.0,
    price: 89000,
    originalPrice: 98000,
    discountPercent: 9,
    rating: 5.0,
    reviewsCount: 38,
    isNew: true,
    isBestSeller: true,
    stock: 6,
    sku: 'VDM-PD-808',
    metal: '18K Rose Gold',
    purity: '18K Hallmarked',
    weight: '9.8 grams',
    gemstone: '0.8 Ct Heart Solitaire',
    material: 'Rose Gold & Diamond',
    color: 'Rose Gold Sparkle',
    size: '18 Inch Chain Included',
    images: [
      '/assets/jewellery/necklace/6.jpg',
      '/assets/jewellery/necklace/6-1.jpg'
    ],
    description: 'Heart-cut solitaire diamond encased in 18K rose gold lotus prongs.',
    approvalStatus: 'Approved'
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Radhika Merchant',
    location: 'Delhi',
    rating: 5,
    comment: 'Every piece feels incredibly special. Ratnaya has completely changed the way I shop for jewellery online.',
    itemPurchased: 'Royal Maharani Kundan Haar'
  },
  {
    id: 2,
    name: 'Ananya Singhania',
    location: 'Mumbai',
    rating: 5,
    comment: 'Ratnaya brings together India’s finest boutique jewellers on one elegant platform. Certified diamond solitaire quality is unmatched.',
    itemPurchased: 'Couple Ring Set'
  },
  {
    id: 3,
    name: 'Gayatri Devi',
    location: 'Jaipur',
    rating: 5,
    comment: 'The Pearl Bird Necklace exceeded all expectations. Packaging was royal white velvet box with personalized care instructions.',
    itemPurchased: 'Pearl Bird Necklace'
  }
];

export const BLOG_POSTS = [
  {
    id: 'blog-1',
    title: 'Bridal Jewellery Trends 2026: The Return of Heritage Polki & Emeralds',
    category: 'Bridal Jewellery',
    date: 'August 28, 2026',
    author: 'Ratnaya Editorial',
    image: '/assets/jewellery/necklace/videoframe_3765.png',
    excerpt: 'Explore how modern brides are marrying ancient Nizam Polki techniques with contemporary lightweight emerald haar.',
    content: 'Indian bridal fashion in 2026 is experiencing a royal renaissance. Connoisseurs are moving away from machine-cut stones towards authentic 22K gold Jadau foil setting, Zambian emerald droplets, and un-cut Syndicate Polki.'
  },
  {
    id: 'blog-2',
    title: 'Understanding 22K vs 18K BIS Hallmark Certification & HUID',
    category: 'Gold Jewellery',
    date: 'August 20, 2026',
    author: 'Gold Compliance Team',
    image: '/assets/jewellery/necklace/8.jpg',
    excerpt: 'Everything you must know about 6-digit HUID hallmarking, purity verification, and buyback guarantees.',
    content: 'When purchasing fine gold jewellery in India, checking the 6-digit HUID alphanumeric code laser-etched alongside the BIS hallmark symbol ensures 100% certified gold purity.'
  },
  {
    id: 'blog-3',
    title: 'Solitaire Diamond Buying Guide: EF VVS vs Cut Quality',
    category: 'Diamond Jewellery',
    date: 'August 12, 2026',
    author: 'Aditi Shah (GIA Gemologist)',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800',
    excerpt: 'How to select the perfect engagement solitaire using the 4Cs — Color, Clarity, Cut, and Carat weight.',
    content: 'A solitaire diamond’s fire and brilliance depend primarily on its Cut Grade. An Ideal Triple Excellent cut diamond reflects maximum light.'
  }
];

export const MOCK_ORDERS = [
  {
    id: 'RAT-ORD-88219',
    date: '2026-08-28',
    buyerName: 'Priya Malhotra',
    buyerEmail: 'priya.m@gmail.com',
    buyerPhone: '+91 98201 44510',
    totalAmount: 245000,
    status: 'Shipped',
    trackingNumber: 'BLUEDART-8891230',
    items: [
      { productId: 'prod-1', name: 'Gold Bangle Pair', price: 142000, qty: 1, sellerName: 'Heritage Gold Kolkata' }
    ],
    paymentMethod: 'UPI (GPay)',
    address: 'Flat 402, Sea Pearl Towers, Worli, Mumbai 400018'
  }
];

export const MOCK_PENDING_SELLERS = [
  {
    id: 'seller-req-101',
    businessName: 'Zaveri & Sons Heritage',
    ownerName: 'Harish Zaveri',
    email: 'contact@zaveriheritage.com',
    phone: '+91 98210 55443',
    city: 'Ahmedabad, Gujarat',
    gst: '24AAAAZ9999Z1Z8',
    pan: 'AZAPZ1234M',
    category: 'Gold & Kundan Jewellery',
    appliedDate: '2026-08-30',
    kycStatus: 'Pending Verification',
    kycDocuments: ['GST_Certificate.pdf', 'PAN_Card.jpg', 'BIS_Hallmark_License.pdf']
  }
];

export const MOCK_PENDING_PRODUCTS = [
  {
    id: 'prod-req-201',
    name: 'Nawabi Sapphire & Diamond Choker',
    sellerName: 'Royal Nizam Polki Hyderabad',
    category: 'Necklaces',
    price: 360000,
    metal: '18K White Gold',
    purity: '18K Hallmarked',
    submittedDate: '2026-08-31',
    image: '/assets/jewellery/necklace/7.jpg',
    status: 'Pending Approval'
  }
];

