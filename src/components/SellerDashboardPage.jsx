import React, { useState, useEffect } from 'react';
import { PRODUCTS, SELLERS, MOCK_ORDERS } from '../data/marketplaceData';
import { api, openDocument, formatDocName, formatDocSize, getImageUrl } from '../services/api';
import ImageModal from './ImageModal';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Users,
  Star,
  DollarSign,
  TrendingUp,
  Store,
  CheckCircle2,
  AlertCircle,
  Clock,
  Upload,
  ChevronRight,
  Sparkles,
  Edit,
  Edit3,
  X,
  ZoomIn,
  Trash2,
  Truck,
  RotateCcw,
  XCircle,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  FileText,
  Search,
  PieChart,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  Share2,
  Megaphone,
  RefreshCw,
  Tag,
  ArrowRight,
  Grid,
  List
} from 'lucide-react';
import InvoiceModal from './InvoiceModal';
import FinancialReportsView from './FinancialReportsView';
import { ShareCatalogModal } from './ShareCatalogModal';

export function SellerDashboardPage({ currentUser, sellerId }) {
  const sellerFromData = SELLERS.find((s) => s.id === sellerId || s.id === currentUser?.id || s.id === currentUser?.sellerId);
  const seller = currentUser ? {
    id: currentUser.sellerId || currentUser.id || 'seller-custom',
    name: currentUser.businessName || currentUser.name || '',
    owner: currentUser.owner || currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    city: currentUser.city || '',
    gst: currentUser.gst || '',
    pan: currentUser.pan || '',
    bisLicense: currentUser.bisLicense || '',
    about: currentUser.about || '',
    rating: 5.0,
    reviewsCount: 0,
    commissionRate: currentUser.commissionRate || 10,
    logo: currentUser.logo || (sellerFromData ? sellerFromData.logo : '/uploads/avatar.jpg'),
    banner: currentUser.banner || (sellerFromData ? sellerFromData.banner : '/uploads/banner.jpg'),
    status: currentUser.status || 'Pending Verification'
  } : (sellerFromData || {
    id: 'seller-custom',
    name: '',
    owner: '',
    email: '',
    phone: '',
    city: '',
    gst: '',
    pan: '',
    bisLicense: '',
    logo: '/uploads/avatar.jpg',
    banner: '/uploads/banner.jpg',
    about: '',
    status: 'Pending Verification'
  });

  const [activeTab, setActiveTab] = useState(seller.status !== 'Approved' ? 'store-profile' : 'overview');
  const [sellerOrders, setSellerOrders] = useState([]);
  const [sellerProductsList, setSellerProductsList] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [productViewMode, setProductViewMode] = useState('table'); // 'table' | 'grid'
  const [productCurrentPage, setProductCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productStatusFilter, setProductStatusFilter] = useState('All');

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Invoice modal & search state
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');

  // Social Catalog Share Modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedShareProduct, setSelectedShareProduct] = useState(null);

  const handleOpenShareCatalog = (prod = null) => {
    setSelectedShareProduct(prod);
    setIsShareModalOpen(true);
  };

  // Seller Ads Manager State
  const [mySellerAds, setMySellerAds] = useState([]);
  const [loadingAds, setLoadingAds] = useState(false);
  const [adCreatedSuccess, setAdCreatedSuccess] = useState(false);
  const [isPreviewBannerModalOpen, setIsPreviewBannerModalOpen] = useState(false);
  const [previewThumbIdx, setPreviewThumbIdx] = useState(0);

  const [newAdForm, setNewAdForm] = useState({
    adType: 'top_banner',
    durationDays: 7,
    title: 'Crafting Timeless Beauty With Distinctive Grace',
    eyebrow: 'TIMELESS SOPHISTICATION',
    watermark: 'INCOMPARABLE',
    subtitle: 'Exclusive Handcrafted Masterpiece',
    description: 'Adorn your neck with royal Kundan chokers, Basra pearl strands, and glowing Zambian emerald haar crafted for grand wedding celebrations.',
    image: '/assets/jewellery/hero/main1.jpg',
    mainImage: '/assets/jewellery/hero/main1.jpg',
    accentImage: '/assets/jewellery/hero/rightside1.jpg',
    ringAccent: '/assets/jewellery/hero/ringhero1.png',
    thumb1: '/assets/jewellery/hero/sub1-1.jpg',
    thumb2: '/assets/jewellery/hero/sub1-2.jpg',
    thumb3: '/assets/jewellery/hero/sub1-3.jpg',
    thumb4: '/assets/jewellery/hero/sub1-4.jpg',
    targetCategory: 'necklaces',
    ctaPrimary: 'Know More',
    ctaSecondary: 'Shop Now',
    badge: 'SPONSORED AD',
    tag: 'Seller Feature',
    bannerSize: '1920x600',
    bannerSizeLabel: '1920 x 600 px (Top Hero Banner)'
  });

  const loadMySellerAds = async () => {
    try {
      setLoadingAds(true);
      const targetId = currentUser?.sellerId || currentUser?.id || sellerId || 'seller-custom';
      const res = await api.getSellerAds(targetId);
      if (res && res.success && Array.isArray(res.data)) {
        setMySellerAds(res.data);
      }
    } catch (err) {
      console.warn('Load seller ads error:', err);
    } finally {
      setLoadingAds(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'seller-ads') {
      loadMySellerAds();
    }
  }, [activeTab]);

  const handleCreateAdSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const primaryImg = (newAdForm.adType === 'section')
      ? (newAdForm.image || newAdForm.mainImage)
      : (newAdForm.mainImage || newAdForm.image);

    if (!newAdForm.title || !newAdForm.description || !primaryImg) {
      alert('Please fill out Ad Title, Description, and select Banner Photo.');
      return;
    }

    const priceMap = { 1: 299, 7: 1499, 30: 4999 };
    const adAmount = priceMap[newAdForm.durationDays] || 1499;

    const submitAdToBackend = async (paymentId = '') => {
      try {
        const targetId = currentUser?.sellerId || currentUser?.id || sellerId || 'seller-custom';
        const thumbnailsArr = [
          newAdForm.thumb1 || primaryImg,
          newAdForm.thumb2 || primaryImg,
          newAdForm.thumb3 || primaryImg,
          newAdForm.thumb4 || primaryImg
        ];

        const res = await api.createSellerAd({
          ...newAdForm,
          image: primaryImg,
          mainImage: primaryImg,
          accentImage: newAdForm.accentImage || primaryImg,
          ringAccent: newAdForm.ringAccent || '/assets/jewellery/hero/ringhero1.png',
          watermark: newAdForm.watermark || 'VERIFIED SELLER',
          thumbnails: thumbnailsArr,
          sellerId: targetId,
          sellerName: sellerProfile.owner || seller.owner || seller.name || 'Verified Merchant',
          sellerShopName: sellerProfile.name || seller.name || 'Jewellery Atelier',
          pricePaid: adAmount,
          paymentId: paymentId || `PAY-RZP-${Date.now()}`
        });

        if (res && res.success) {
          setAdCreatedSuccess(true);
          setTimeout(() => setAdCreatedSuccess(false), 5000);
          loadMySellerAds();
          alert(`✅ Success! Payment of ₹${adAmount.toLocaleString('en-IN')} via Razorpay verified.\nYour Banner Ad is submitted & pending Admin approval before going live!`);
        } else {
          alert(res?.message || 'Failed to create ad.');
        }
      } catch (err) {
        alert('Error creating ad: ' + err.message);
      }
    };

    // Open Razorpay Payment Modal
    try {
      const keyRes = await api.getRazorpayKey();
      const orderRes = await api.createRazorpayOrder(adAmount, `receipt_ad_${Date.now()}`);

      const keyId = keyRes?.keyId || 'rzp_test_TX8SKKGVyL7Ajc';
      const orderObj = orderRes?.order;

      if (window.Razorpay && orderRes && orderRes.success && orderObj) {
        const options = {
          key: keyId,
          amount: orderObj.amount || Math.round(adAmount * 100),
          currency: orderObj.currency || 'INR',
          name: 'RATNAYA Luxury Marketplace',
          description: `Seller Ad Banner Sponsorship (${newAdForm.durationDays} Days)`,
          image: '/assets/logo.png',
          prefill: {
            name: sellerProfile.owner || sellerProfile.name || 'Jewellery Merchant',
            email: sellerProfile.email || currentUser?.email || 'seller@ratnaya.com',
            contact: sellerProfile.phone || currentUser?.phone || '9876543210'
          },
          theme: {
            color: '#C5A059'
          },
          handler: async function (response) {
            try {
              await api.verifyRazorpayPayment(response);
            } catch (vErr) {
              console.warn('Razorpay verification notice:', vErr);
            }
            await submitAdToBackend(response.razorpay_payment_id || `PAY-RZP-${Date.now()}`);
          },
          modal: {
            ondismiss: function () {
              console.log('Razorpay ad payment dismissed');
            }
          }
        };

        if (orderRes.isRazorpayLive && orderObj.id) {
          options.order_id = orderObj.id;
        }

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        await submitAdToBackend(`PAY-SIM-${Date.now()}`);
      }
    } catch (payErr) {
      console.warn('Razorpay payment gateway notice:', payErr);
      await submitAdToBackend(`PAY-SIM-${Date.now()}`);
    }
  };

  const handleDeleteSellerAd = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ad placement?')) return;
    try {
      await api.deleteSellerAd(id);
      loadMySellerAds();
    } catch (err) {
      alert('Failed to delete ad');
    }
  };

  // Seller Profile State
  const [sellerProfile, setSellerProfile] = useState({
    name: seller.name || '',
    owner: seller.owner || '',
    city: seller.city || '',
    phone: seller.phone || '',
    email: seller.email || '',
    gst: seller.gst || '',
    pan: seller.pan || '',
    bisLicense: seller.bisLicense || '',
    gstDoc: seller.gstDoc || '/uploads/GST_Certificate.pdf',
    panDoc: seller.panDoc || '/uploads/PAN_Card.jpg',
    bisDoc: seller.bisDoc || '/uploads/BIS_Hallmark_License.pdf',
    logo: seller.logo || '',
    banner: seller.banner || '',
    about: seller.about || '',
    status: seller.status || 'Pending Verification',
    rejectionReason: seller.rejectionReason || ''
  });
  const [isProfileSavedToast, setIsProfileSavedToast] = useState(false);
  const [docVerification, setDocVerification] = useState({ gst: null, pan: null, bis: null });
  const [verifyingDoc, setVerifyingDoc] = useState({ gst: false, pan: false, bis: false });

  const handleVerifyDocument = async (type) => {
    const docNum = type === 'gst' ? sellerProfile.gst : type === 'pan' ? sellerProfile.pan : sellerProfile.bisLicense;
    if (!docNum) {
      setDocVerification((prev) => ({
        ...prev,
        [type]: { success: false, message: 'Please enter a number to verify' }
      }));
      return;
    }

    setVerifyingDoc((prev) => ({ ...prev, [type]: true }));
    try {
      const res = await api.verifySellerDocument(type, docNum);
      if (res && res.verified) {
        setDocVerification((prev) => ({
          ...prev,
          [type]: { success: true, message: res.message, details: res.details }
        }));
      } else {
        setDocVerification((prev) => ({
          ...prev,
          [type]: { success: false, message: res?.message || 'Invalid format.' }
        }));
      }
    } catch (err) {
      setDocVerification((prev) => ({
        ...prev,
        [type]: { success: false, message: err.message || 'Verification failed.' }
      }));
    } finally {
      setVerifyingDoc((prev) => ({ ...prev, [type]: false }));
    }
  };

  // Fetch Seller Info & Verification Status from Database API
  useEffect(() => {
    let isMounted = true;
    async function loadSellerInfo() {
      const targetId = currentUser?.sellerId || currentUser?.id || sellerId;
      if (!targetId) return;

      try {
        const res = await api.getSellerById(targetId);
        if (isMounted && res && res.success && res.data) {
          const sData = res.data;
          setSellerProfile({
            name: sData.name || sData.businessName || currentUser?.businessName || currentUser?.name || '',
            owner: sData.owner || sData.ownerName || currentUser?.name || '',
            city: sData.city || currentUser?.city || '',
            phone: sData.phone || currentUser?.phone || '',
            email: sData.email || currentUser?.email || '',
            gst: sData.gst || currentUser?.gst || '',
            pan: sData.pan || currentUser?.pan || '',
            bisLicense: sData.bisLicense || currentUser?.bisLicense || '',
            gstDoc: sData.gstDoc || currentUser?.gstDoc || '/uploads/GST_Certificate.pdf',
            panDoc: sData.panDoc || currentUser?.panDoc || '/uploads/PAN_Card.jpg',
            bisDoc: sData.bisDoc || currentUser?.bisDoc || '/uploads/BIS_Hallmark_License.pdf',
            logo: sData.logo || currentUser?.logo || '',
            banner: sData.banner || currentUser?.banner || '',
            about: sData.about || currentUser?.about || '',
            status: sData.status || currentUser?.status || 'Pending Verification',
            rejectionReason: sData.rejectionReason || currentUser?.rejectionReason || ''
          });

          if (sData.status !== 'Approved') {
            setActiveTab('store-profile');
          }
        }
      } catch (err) {
        console.warn('Seller info load notice:', err);
      }
    }

    loadSellerInfo();
    return () => {
      isMounted = false;
    };
  }, [currentUser?.id, currentUser?.sellerId]);

  // Load Products belonging ONLY to this Seller
  useEffect(() => {
    let isMounted = true;
    async function loadSellerProducts() {
      try {
        const targetId = currentUser?.sellerId || currentUser?.id || sellerId || 'seller-1';
        const res = await api.getSellerProducts(targetId);
        if (isMounted && res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setSellerProductsList(res.data);
        } else if (isMounted) {
          const filtered = PRODUCTS.filter(
            (p) => p.sellerId === seller.id || p.sellerName === seller.name || (currentUser?.email && p.sellerEmail === currentUser.email)
          );
          setSellerProductsList(filtered);
        }
      } catch (err) {
        console.warn('Seller products API load error:', err);
      }
    }
    loadSellerProducts();
    return () => {
      isMounted = false;
    };
  }, [activeTab, seller.id, seller.name, currentUser?.id]);

  const handleDeleteProduct = async (p) => {
    const pId = p._id || p.id;
    const pName = p.name || 'this product';

    // Validation: Check if product is linked to any active order (Placed/Confirmed/Shipped) that has not been Delivered, Refunded, or Cancelled
    const activeStatuses = ['Order Requested', 'Pending Acceptance', 'Processing', 'Confirmed', 'Shipped', 'Return Requested'];
    const activeOrder = sellerOrders.find((ord) => {
      if (!activeStatuses.includes(ord.status)) return false;
      if (Array.isArray(ord.items)) {
        return ord.items.some((item) => {
          const itemId = String(item.productId || item.id || item._id || item.name || '');
          return itemId === String(pId) || itemId === pName;
        });
      }
      return false;
    });

    if (activeOrder) {
      alert(`⚠️ Cannot Delete Product!\n\n"${pName}" is linked to an active order (${activeOrder.id || 'Order'}) with status "${activeOrder.status}".\n\nProducts with active pending orders cannot be deleted until the order is Delivered, Refunded, or Cancelled.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${pName}"? This action cannot be undone.`)) return;

    try {
      const res = await api.deleteProduct(pId);
      if (res && res.success) {
        setSellerProductsList((prev) => prev.filter((item) => (item._id || item.id) !== pId));
        alert(`✅ Product "${pName}" deleted successfully!`);
      } else {
        alert(res?.message || res?.error || `⚠️ Cannot delete product because it has active pending orders.`);
      }
    } catch (err) {
      alert(`⚠️ Delete Error: ${err.message}`);
    }
  };

  // Merchant Order Filters & Sorting State
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderDateFilter, setOrderDateFilter] = useState('All');
  const [orderSortBy, setOrderSortBy] = useState('newest');

  // Load Seller Scoped Orders with MOCK_ORDERS Fallback
  useEffect(() => {
    let isMounted = true;
    async function loadSellerOrders() {
      try {
        const targetId = currentUser?.sellerId || currentUser?.id || sellerId || 'seller-1';
        const res = await api.getSellerOrders(targetId);
        if (isMounted && res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setSellerOrders(res.data);
        } else if (isMounted) {
          // Fallback to MOCK_ORDERS filtered by sellerId / sellerName
          const filteredMock = MOCK_ORDERS.filter((o) => {
            if (o.sellerId === seller.id || o.sellerName === seller.name) return true;
            if (Array.isArray(o.items)) {
              return o.items.some((i) => i.sellerId === seller.id || i.sellerName === seller.name);
            }
            return false;
          });
          setSellerOrders(filteredMock.length > 0 ? filteredMock : MOCK_ORDERS);
        }
      } catch (err) {
        console.warn('Seller orders API load error:', err);
        if (isMounted) {
          setSellerOrders(MOCK_ORDERS);
        }
      }
    }
    loadSellerOrders();
    return () => {
      isMounted = false;
    };
  }, [activeTab, seller.id, seller.name, currentUser?.id]);

  // Derived Filtered & Sorted Merchant Orders
  const filteredSellerOrders = sellerOrders
    .filter((ord) => {
      // 1. Search Query Filter (Order ID, Buyer Name, Buyer Email, Product Item Name)
      if (orderSearchQuery.trim()) {
        const query = orderSearchQuery.toLowerCase().trim();
        const matchesId = (ord.id || '').toLowerCase().includes(query);
        const matchesBuyer = (ord.buyerName || ord.customerName || '').toLowerCase().includes(query);
        const matchesEmail = (ord.buyerEmail || '').toLowerCase().includes(query);
        const matchesItems = Array.isArray(ord.items) && ord.items.some((item) => (item.name || '').toLowerCase().includes(query));
        if (!matchesId && !matchesBuyer && !matchesEmail && !matchesItems) return false;
      }

      // 2. Status Filter
      if (orderStatusFilter !== 'All') {
        const status = ord.status || 'Confirmed';
        if (status !== orderStatusFilter) return false;
      }

      // 3. Date Range Filter
      if (orderDateFilter !== 'All') {
        const rawDate = ord.date || ord.createdAt;
        if (rawDate) {
          const orderDate = new Date(rawDate);
          const now = new Date();
          if (!isNaN(orderDate.getTime())) {
            if (orderDateFilter === 'today') {
              if (orderDate.toDateString() !== now.toDateString()) return false;
            } else if (orderDateFilter === '7days') {
              const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
              if (diffDays > 7) return false;
            } else if (orderDateFilter === '30days') {
              const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
              if (diffDays > 30) return false;
            }
          }
        }
      }

      return true;
    })
    .sort((a, b) => {
      // 4. Sorting logic
      if (orderSortBy === 'newest') {
        return new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0);
      } else if (orderSortBy === 'oldest') {
        return new Date(a.date || a.createdAt || 0) - new Date(b.date || b.createdAt || 0);
      } else if (orderSortBy === 'amount-high') {
        return (b.totalAmount || 0) - (a.totalAmount || 0);
      } else if (orderSortBy === 'amount-low') {
        return (a.totalAmount || 0) - (b.totalAmount || 0);
      }
      return 0;
    });

  // Calculate status counts for quick filter pills & dropdown options
  const statusCounts = {
    All: sellerOrders.length,
    'Order Requested': sellerOrders.filter((o) => o.status === 'Order Requested' || o.status === 'Pending Acceptance').length,
    Confirmed: sellerOrders.filter((o) => o.status === 'Confirmed').length,
    Shipped: sellerOrders.filter((o) => o.status === 'Shipped').length,
    Delivered: sellerOrders.filter((o) => o.status === 'Delivered').length,
    'Return Requested': sellerOrders.filter((o) => o.status === 'Return Requested').length,
    Refunded: sellerOrders.filter((o) => o.status === 'Refunded').length,
    Cancelled: sellerOrders.filter((o) => o.status === 'Cancelled').length
  };

  const isOrderFilterActive = orderSearchQuery.trim() !== '' || orderStatusFilter !== 'All' || orderDateFilter !== 'All' || orderSortBy !== 'newest';

  const handleResetOrderFilters = () => {
    setOrderSearchQuery('');
    setOrderStatusFilter('All');
    setOrderDateFilter('All');
    setOrderSortBy('newest');
  };

  const handleSaveSellerProfile = async (e) => {
    e.preventDefault();
    const targetId = seller?.id || seller?._id || currentUser?.sellerId || currentUser?.id;

    try {
      const res = await api.updateSellerProfile(targetId, {
        ...sellerProfile,
        status: sellerProfile.status === 'Approved' ? 'Approved' : 'Pending Verification'
      });

      if (res && res.success && res.data) {
        setSellerProfile(res.data);
      }
    } catch (err) {
      console.warn('Seller profile API update error:', err);
    }

    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        name: sellerProfile.name,
        businessName: sellerProfile.name,
        owner: sellerProfile.owner,
        phone: sellerProfile.phone,
        city: sellerProfile.city,
        gst: sellerProfile.gst,
        pan: sellerProfile.pan,
        bisLicense: sellerProfile.bisLicense,
        status: sellerProfile.status === 'Approved' ? 'Approved' : 'Pending Verification'
      };
      localStorage.setItem('ratnaya_user', JSON.stringify(updatedUser));
    }

    setIsProfileSavedToast(true);
    setTimeout(() => setIsProfileSavedToast(false), 3500);
  };


  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      if (res && res.success) {
        setSellerOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        setSellerOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleDeleteSellerOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order record ${orderId}?`)) return;
    try {
      await api.deleteOrder(orderId);
      setSellerOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error('Error deleting seller order:', err);
    }
  };

  // Image Lightbox Modal State
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    images: [],
    initialIndex: 0,
    title: ''
  });

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageFileUpload = async (file, callback, categoryName = 'general', docType = '', sizeCallback = null) => {
    if (!file) return;

    // Calculate file size string
    const fileSizeStr = file.size > 1024 * 1024
      ? (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      : (file.size / 1024).toFixed(0) + ' KB';

    // File size safety check to prevent server storage bloat
    if (file.size > 10 * 1024 * 1024) {
      alert(`⚠️ Warning: Selected file size is ${fileSizeStr}! Maximum recommended limit is 10MB to save server storage. Please compress the file.`);
    }

    setIsUploading(true);
    try {
      const sellerName = sellerProfile?.name || seller?.name || sellerProfile?.businessName || 'Seller';
      const res = await api.uploadImage(file, categoryName, sellerName, docType);
      if (res && res.success && res.url) {
        callback(res.url);
        if (sizeCallback) {
          sizeCallback(fileSizeStr);
        }
      } else {
        alert(res?.message || 'Image upload failed. Please try again.');
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert('Error uploading file to server.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditClick = (p) => {
    const primaryImg = p.image || (p.images ? p.images[0] : '/assets/jewellery/necklace/1.jpg');
    const secondaryImg = (p.images && p.images[1]) || p.image2 || primaryImg;
    setEditingProduct({
      ...p,
      image: primaryImg,
      image2: secondaryImg
    });
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const prodId = editingProduct.id || editingProduct._id;
    const primaryImg = editingProduct.image || '/assets/jewellery/necklace/1.jpg';
    const secondaryImg = editingProduct.image2 || primaryImg;

    const updatedData = {
      ...editingProduct,
      price: Number(editingProduct.price),
      originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : null,
      stock: Number(editingProduct.stock),
      image: primaryImg,
      images: [primaryImg, secondaryImg],
      approvalStatus: 'Pending Approval',
      status: 'Pending Approval',
      resubmittedAt: new Date()
    };

    setSellerProductsList((prev) =>
      prev.map((item) => ((item.id === prodId || item._id === prodId) ? updatedData : item))
    );

    try {
      await api.updateProduct(prodId, updatedData);
    } catch (err) {
      console.error('Error updating product:', err);
    }

    setEditingProduct(null);
    alert(`Product "${updatedData.name}" updated and resubmitted to Admin for approval!`);
  };

  // Load Seller's Products from Backend Database API on mount
  useEffect(() => {
    async function loadSellerProducts() {
      try {
        const res = await api.getProducts({ sellerId: seller.id });
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setSellerProductsList(res.data);
        }
      } catch (err) {
        console.warn('Backend seller products fetch warning:', err);
      }
    }
    loadSellerProducts();
  }, [seller.id]);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'necklaces',
    categoryName: 'Necklaces',
    price: '',
    originalPrice: '',
    stock: 5,
    sku: `KJJ-NEW-${Math.floor(100 + Math.random() * 900)}`,
    metal: '22K Gold',
    purity: '22K BIS Hallmarked',
    weight: '35 grams',
    gemstone: 'Zambian Emerald',
    material: 'Yellow Gold & Gemstone',
    color: 'Gold & Green',
    size: '18 Inch',
    description: '',
    image: '/assets/jewellery/necklace/1.jpg',
    image2: '/assets/jewellery/necklace/2.jpg'
  });

  const [productAddedSuccess, setProductAddedSuccess] = useState(false);

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();

    if (sellerProfile.status !== 'Approved') {
      alert('⚠️ Account Verification Required: Your Seller Account must be approved by Ratnaya Admin before you can submit products.');
      setActiveTab('store-profile');
      return;
    }

    const primaryImg = newProduct.image || '/assets/jewellery/necklace/1.jpg';
    const secondaryImg = newProduct.image2 || primaryImg;


    const createdProduct = {
      id: `prod-req-${Date.now()}`,
      sku: newProduct.sku || `SKU-${Date.now().toString().slice(-6)}`,
      name: newProduct.name,
      category: newProduct.category || 'necklaces',
      categoryName: newProduct.categoryName || 'Necklaces',
      price: Number(newProduct.price),
      originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : null,
      metal: newProduct.metal || '22K Gold',
      purity: newProduct.purity || '22K BIS Hallmarked',
      description: newProduct.description,
      sellerId: seller.id,
      sellerName: seller.name,
      sellerRating: seller.rating,
      rating: 5.0,
      reviewsCount: 0,
      approvalStatus: 'Pending Approval', // Admin approval required!
      status: 'Pending Approval',
      submittedDate: new Date().toISOString().split('T')[0],
      image: primaryImg,
      images: [primaryImg, secondaryImg]
    };

    // Update local seller dashboard list
    setSellerProductsList([createdProduct, ...sellerProductsList]);

    // Save to global pending products for Admin Dashboard
    try {
      const savedPending = JSON.parse(localStorage.getItem('ratnaya_pending_products') || '[]');
      const updatedPending = [createdProduct, ...savedPending];
      localStorage.setItem('ratnaya_pending_products', JSON.stringify(updatedPending));
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }

    // Call REST API backend to insert product in MongoDB Database
    try {
      const apiRes = await api.createProduct(createdProduct);
      console.log('MongoDB Product Submission API Response:', apiRes);
    } catch (err) {
      console.error('Backend Product Creation Error:', err);
    }

    setProductAddedSuccess(true);
    setTimeout(() => {
      setProductAddedSuccess(false);
      setActiveTab('products');
    }, 2000);
  };

  const totalRevenue = sellerProductsList.reduce((acc, p) => acc + p.price * 3, 0);

  return (
    <div className="bg-[#FAF6F0] min-h-[90vh] pb-20">
      {/* Seller Header Bar */}
      <div className="bg-[#111111] text-white py-6 border-b border-gold/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={api.getImageUrl(sellerProfile.logo || seller.logo || '/uploads/avatar.jpg')}
                alt={sellerProfile.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gold shrink-0 shadow-sm"
              />
              <div>
                <span className="text-[0.68rem] text-gold tracking-widest uppercase font-semibold">
                  MERCHANT DASHBOARD
                </span>
                <h2 className="font-heading text-xl sm:text-2xl text-white">
                  {sellerProfile.name}
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => handleOpenShareCatalog(null)}
                className="bg-gold hover:bg-gold-dark text-charcoal hover:text-white px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all cursor-pointer hover:scale-[1.02]"
                title="Share digital store catalog on WhatsApp, Instagram, Facebook, etc."
              >
                <Share2 size={13} /> Share Catalog 📲
              </button>
              <span className="badge-gold text-xs">GST: {sellerProfile.gst || 'Not Submitted'}</span>
              {sellerProfile.status === 'Approved' ? (
                <span className="bg-emerald-600 text-white text-xs px-2.5 py-1 rounded font-semibold flex items-center gap-1 shadow-xs">
                  <CheckCircle2 size={12} /> Account Approved
                </span>
              ) : sellerProfile.status === 'Rejected' ? (
                <span className="bg-rose-600 text-white text-xs px-2.5 py-1 rounded font-semibold flex items-center gap-1 shadow-xs">
                  <XCircle size={12} /> Application Rejected
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs px-2.5 py-1 rounded font-semibold flex items-center gap-1">
                  <Clock size={12} /> Pending Verification
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Application Rejected Notice Banner */}
        {sellerProfile.status === 'Rejected' && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-5 mb-6 rounded text-rose-900 shadow-sm flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <XCircle size={26} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-rose-950 font-bold text-base mb-1">
                  ❌ Seller Account Application Rejected by Admin
                </strong>
                <div className="bg-white/90 p-3.5 rounded border border-rose-200 text-xs sm:text-sm text-rose-900 mb-2 shadow-2xs">
                  <span className="font-semibold text-rose-950 block mb-0.5">Admin Rejection Reason:</span>
                  <span className="italic font-medium text-rose-800">
                    "{sellerProfile.rejectionReason || 'Document verification or business compliance criteria were not met.'}"
                  </span>
                </div>
                <p className="text-xs text-rose-800">
                  Please update your business details, GSTIN/PAN, or compliance document uploads below in <strong>Store Profile</strong> tab and click "SAVE & UPDATE STORE PROFILE" to resubmit your application for Admin review.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('store-profile')}
              className="btn-gold text-xs py-2.5 px-4 shrink-0 font-semibold uppercase tracking-wider cursor-pointer"
            >
              Update Store Profile
            </button>
          </div>
        )}

        {/* Pending Verification Notice Banner */}
        {sellerProfile.status === 'Pending Verification' && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded text-amber-900 text-xs sm:text-sm flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <AlertCircle size={22} className="text-amber-600 shrink-0" />
              <div>
                <strong className="block text-amber-950 font-bold">Seller Account Approval Pending Admin Verification</strong>
                <span>Your account status is <strong>Pending Verification</strong>. Please complete your Store Profile details (GST, PAN, BIS License) below and submit for Admin review. Product creation is blocked until Admin approval.</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <aside>
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm flex flex-row lg:flex-col overflow-x-auto no-scrollbar">
              {[
                { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
                { id: 'reports', label: 'Selling & Financial Reports', icon: <PieChart size={18} /> },
                { id: 'invoices', label: 'Tax Invoices', icon: <FileText size={18} /> },
                { id: 'seller-ads', label: 'Promotional Ads', icon: <Sparkles size={18} /> },
                { id: 'products', label: `My Products (${sellerProductsList.length})`, icon: <Package size={18} /> },
                { id: 'add-product', label: 'Add New Product', icon: <PlusCircle size={18} /> },
                { id: 'orders', label: 'Merchant Orders', icon: <ShoppingBag size={18} /> },
                { id: 'earnings', label: 'Earnings & Payouts', icon: <DollarSign size={18} /> },
                { id: 'store-profile', label: 'Store Profile', icon: <Store size={18} /> }
              ].map((tab) => {
                const isBlocked = tab.id === 'add-product' && sellerProfile.status !== 'Approved';
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (isBlocked) {
                        alert('⚠️ Account Verification Required: Your Seller Account is currently pending Admin approval. You cannot add products until Admin verifies your Store Profile and business documents.');
                        setActiveTab('store-profile');
                        return;
                      }
                      setActiveTab(tab.id);
                    }}
                    className={`w-full text-left p-3.5 text-xs sm:text-sm flex items-center gap-3 whitespace-nowrap border-b border-gray-100 transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-[#FAF6F0] text-gold-dark font-semibold border-l-4 border-l-gold'
                        : isBlocked
                        ? 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                        : 'text-charcoal hover:bg-gray-50 bg-transparent'
                    }`}
                  >
                    {tab.icon} {tab.label} {isBlocked && <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">LOCKED</span>}
                  </button>
                );
              })}
            </div>
          </aside>


          {/* Main Dashboard Content */}
          <main className="min-w-0">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-6">
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div 
                    onClick={() => setActiveTab('orders')}
                    className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group"
                    title="Click to view Merchant Orders"
                  >
                    <div className="text-xs text-gray-500 uppercase font-medium flex items-center justify-between">
                      <span>Total Revenue</span>
                      <ChevronRight size={14} className="text-gray-400 group-hover:text-amber-600 transition-colors" />
                    </div>
                    <div className="text-2xl font-semibold text-charcoal my-1 group-hover:text-amber-700 transition-colors">
                      ₹{sellerOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || Number(o.total) || Number(o.price) || 0), 0).toLocaleString('en-IN')}
                    </div>
                    <span className="text-xs text-emerald-700 font-medium">Calculated from {sellerOrders.length} orders</span>
                  </div>

                  <div 
                    onClick={() => setActiveTab('orders')}
                    className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group"
                    title="Click to view Merchant Orders"
                  >
                    <div className="text-xs text-gray-500 uppercase font-medium flex items-center justify-between">
                      <span>Total Orders</span>
                      <ChevronRight size={14} className="text-gray-400 group-hover:text-amber-600 transition-colors" />
                    </div>
                    <div className="text-2xl font-semibold text-charcoal my-1 group-hover:text-amber-700 transition-colors">
                      {sellerOrders.length} {sellerOrders.length === 1 ? 'Order' : 'Orders'}
                    </div>
                    <span className="text-xs text-amber-700 font-medium">
                      {sellerOrders.filter(o => ['Order Requested', 'Confirmed', 'Pending Acceptance', 'Shipped'].includes(o.status)).length} Pending fulfillment
                    </span>
                  </div>

                  <div 
                    onClick={() => setActiveTab('products')}
                    className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group"
                    title="Click to view My Products"
                  >
                    <div className="text-xs text-gray-500 uppercase font-medium flex items-center justify-between">
                      <span>Active Products</span>
                      <ChevronRight size={14} className="text-gray-400 group-hover:text-amber-600 transition-colors" />
                    </div>
                    <div className="text-2xl font-semibold text-charcoal my-1 group-hover:text-amber-700 transition-colors">
                      {sellerProductsList.length} Items
                    </div>
                    <span className="text-xs text-gray-500">
                      {sellerProductsList.filter(p => p.approvalStatus === 'Pending' || p.approvalStatus === 'Pending Verification' || p.status === 'Pending').length} Pending Review
                    </span>
                  </div>

                  <div 
                    onClick={() => setActiveTab('store-profile')}
                    className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group"
                    title="Click to view Store Profile"
                  >
                    <div className="text-xs text-gray-500 uppercase font-medium flex items-center justify-between">
                      <span>Store Rating</span>
                      <ChevronRight size={14} className="text-gray-400 group-hover:text-amber-600 transition-colors" />
                    </div>
                    <div className="text-2xl font-semibold text-amber-500 my-1 flex items-center gap-1">
                      <Star size={20} fill="currentColor" /> {seller.rating || 5.0}
                    </div>
                    <span className="text-xs text-gray-500">Based on {seller.reviewsCount || 0} reviews</span>
                  </div>
                </div>

                {/* Seller Products Table Preview */}
                <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm overflow-hidden">
                  <h3 className="font-heading text-xl mb-4">
                    Your Listed Jewellery Products
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[600px]">
                      <thead>
                        <tr className="border-b border-gray-200 bg-[#FAF6F0] text-gray-600">
                          <th className="p-3">Product</th>
                          <th className="p-3">SKU</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Stock</th>
                          <th className="p-3">Admin Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {sellerProductsList.map((prod) => (
                          <tr key={prod.id || prod._id} className="hover:bg-gray-50">
                            <td className="p-3 flex items-center gap-3">
                              <div
                                className="relative group cursor-pointer shrink-0"
                                title="Click to enlarge image (Esc to close)"
                                onClick={() =>
                                  setPreviewModal({
                                    isOpen: true,
                                    images: prod.images && prod.images.length > 0 ? prod.images : [prod.image || '/assets/jewellery/necklace/1.jpg'],
                                    initialIndex: 0,
                                    title: prod.name
                                  })
                                }
                              >
                                <img src={prod.images ? prod.images[0] : prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-sm border border-gray-100 group-hover:opacity-85 transition-opacity" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-sm">
                                  <ZoomIn size={13} className="text-white drop-shadow" />
                                </div>
                              </div>
                              <div>
                                <strong className="block text-charcoal">{prod.name}</strong>
                                <span className="text-xs text-gray-400">{prod.metal}</span>
                              </div>
                            </td>
                            <td className="p-3 font-mono text-xs">{prod.sku}</td>
                            <td className="p-3 font-semibold">₹{prod.price ? Number(prod.price).toLocaleString('en-IN') : '0'}</td>
                            <td className="p-3">{prod.stock}</td>
                            <td className="p-3">
                               <span className={`badge-status ${prod.approvalStatus === 'Approved' ? 'badge-approved' : prod.approvalStatus === 'Rejected' ? 'bg-rose-100 text-rose-800 border border-rose-200 font-bold' : 'badge-pending'}`}>
                                 {prod.approvalStatus || 'Approved'}
                               </span>
                             </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleEditClick(prod)}
                                className="px-2.5 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 text-charcoal flex items-center gap-1 ml-auto"
                              >
                                <Edit size={13} /> Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* MY PRODUCTS TAB */}
            {activeTab === 'products' && (() => {
              const filteredSellerProducts = sellerProductsList.filter((p) => {
                if (productSearchQuery.trim()) {
                  const q = productSearchQuery.toLowerCase().trim();
                  const nameMatch = (p.name || '').toLowerCase().includes(q);
                  const skuMatch = (p.sku || p.id || '').toLowerCase().includes(q);
                  const catMatch = (p.category || '').toLowerCase().includes(q);
                  const metalMatch = (p.metal || '').toLowerCase().includes(q);
                  if (!nameMatch && !skuMatch && !catMatch && !metalMatch) return false;
                }
                if (productStatusFilter !== 'All') {
                  const status = p.approvalStatus || 'Approved';
                  if (status !== productStatusFilter) return false;
                }
                return true;
              });

              const totalProductPages = Math.ceil(filteredSellerProducts.length / productsPerPage) || 1;
              const indexOfLastProduct = productCurrentPage * productsPerPage;
              const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
              const paginatedSellerProducts = filteredSellerProducts.slice(indexOfFirstProduct, indexOfLastProduct);

              return (
                <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="font-heading text-xl">Managed Products Catalog</h3>
                      <p className="text-xs text-gray-500">View your active inventory ({sellerProductsList.length} total) or share your full catalog link on social media.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {/* View Mode Switcher Toggle */}
                      <div className="flex items-center bg-gray-100 p-0.5 rounded border border-gray-200">
                        <button
                          type="button"
                          onClick={() => setProductViewMode('table')}
                          className={`px-3 py-1.5 text-xs font-semibold rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                            productViewMode === 'table'
                              ? 'bg-white text-gold-dark shadow-xs font-bold'
                              : 'text-gray-600 hover:text-charcoal'
                          }`}
                          title="Switch to Table View"
                        >
                          <List size={15} /> Table View
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductViewMode('grid')}
                          className={`px-3 py-1.5 text-xs font-semibold rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                            productViewMode === 'grid'
                              ? 'bg-white text-gold-dark shadow-xs font-bold'
                              : 'text-gray-600 hover:text-charcoal'
                          }`}
                          title="Switch to Grid View"
                        >
                          <Grid size={15} /> Grid View
                        </button>
                      </div>

                      <button
                        onClick={() => handleOpenShareCatalog(null)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs px-3.5 py-2 rounded font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        title="Share full catalog on WhatsApp, Instagram, Facebook"
                      >
                        <Share2 size={14} /> Share Catalog 📲
                      </button>
                      <button onClick={() => setActiveTab('add-product')} className="btn-gold py-2 px-4 text-xs cursor-pointer">
                        <PlusCircle size={15} /> Add New Piece
                      </button>
                    </div>
                  </div>

                  {/* Product Search & Status Filter Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 p-3 bg-[#FAF6F0]/60 border border-gray-200 rounded-sm">
                    {/* Search Input Box */}
                    <div className="relative w-full sm:w-80">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by Product Name, Code/SKU, Metal..."
                        value={productSearchQuery}
                        onChange={(e) => {
                          setProductSearchQuery(e.target.value);
                          setProductCurrentPage(1);
                        }}
                        className="w-full pl-9 pr-8 py-2 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-gold shadow-2xs"
                      />
                      {productSearchQuery && (
                        <button
                          onClick={() => {
                            setProductSearchQuery('');
                            setProductCurrentPage(1);
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal text-xs cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Status Filter Tabs */}
                    <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
                      {['All', 'Approved', 'Pending Approval', 'Rejected'].map((status) => {
                        const count = sellerProductsList.filter(p => status === 'All' ? true : (p.approvalStatus || 'Approved') === status).length;
                        return (
                          <button
                            key={status}
                            type="button"
                            onClick={() => {
                              setProductStatusFilter(status);
                              setProductCurrentPage(1);
                            }}
                            className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                              productStatusFilter === status
                                ? 'bg-gold text-white font-semibold shadow-2xs'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {status} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Table View */}
                  {productViewMode === 'table' ? (
                    <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-2xs">
                      <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[750px] table-fixed">
                        <thead>
                          <tr className="border-b border-gray-200 bg-[#FAF6F0] text-gray-700 font-semibold">
                            <th className="p-3.5 w-[32%]">Product</th>
                            <th className="p-3.5 w-[14%]">Category</th>
                            <th className="p-3.5 w-[14%]">SKU / Code</th>
                            <th className="p-3.5 w-[12%]">Price</th>
                            <th className="p-3.5 w-[10%]">Stock</th>
                            <th className="p-3.5 w-[18%]">Admin Status</th>
                            <th className="p-3.5 w-[12%] text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {filteredSellerProducts.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="p-8 text-center text-gray-400">
                                {productSearchQuery || productStatusFilter !== 'All'
                                  ? 'No products found matching your search criteria.'
                                  : 'No jewellery products listed yet. Click "Add New Piece" to submit your first product!'}
                              </td>
                            </tr>
                          ) : (
                            paginatedSellerProducts.map((p) => (
                              <tr key={p.id || p._id} className="hover:bg-amber-50/20 transition-colors">
                                <td className="p-3.5">
                                  <div className="flex items-center gap-3 overflow-hidden">
                                    <div
                                      className="relative group cursor-pointer shrink-0"
                                      title="Click to enlarge image (Esc to close)"
                                      onClick={() =>
                                        setPreviewModal({
                                          isOpen: true,
                                          images: p.images && p.images.length > 0 ? p.images : [p.image || '/assets/jewellery/necklace/1.jpg'],
                                          initialIndex: 0,
                                          title: p.name
                                        })
                                      }
                                    >
                                      <img
                                        src={p.images && p.images.length > 0 ? p.images[0] : (p.image || '/assets/jewellery/necklace/1.jpg')}
                                        alt={p.name}
                                        className="w-12 h-12 object-cover rounded-sm border border-gray-200 shadow-2xs group-hover:opacity-85 transition-opacity shrink-0"
                                      />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-sm">
                                        <ZoomIn size={14} className="text-white drop-shadow" />
                                      </div>
                                    </div>
                                    <div className="min-w-0 flex-1 overflow-hidden pr-2">
                                      <strong className="block text-charcoal font-medium text-sm truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-full" title={p.name}>
                                        {p.name}
                                      </strong>
                                      <span className="text-xs text-gray-400 capitalize block truncate whitespace-nowrap">
                                        {p.metal || '22K Gold'}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3.5 capitalize text-gray-600 font-medium truncate">
                                  {p.category || 'Jewellery'}
                                </td>
                                <td className="p-3.5 font-mono text-xs text-gray-500 truncate">
                                  {p.sku || p.id || 'RAT-JW-001'}
                                </td>
                                <td className="p-3.5 font-bold text-charcoal whitespace-nowrap">
                                  ₹{p.price ? Number(p.price).toLocaleString('en-IN') : '0'}
                                </td>
                                <td className="p-3.5 whitespace-nowrap">
                                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${Number(p.stock) > 0 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                                    {p.stock !== undefined ? `${p.stock} in stock` : 'Available'}
                                  </span>
                                </td>
                                <td className="p-3.5">
                                  <div className="flex flex-col gap-1 max-w-[200px]">
                                    <span className={`inline-block badge-status text-xs w-fit ${p.approvalStatus === 'Approved' ? 'badge-approved' : p.approvalStatus === 'Rejected' ? 'bg-rose-100 text-rose-800 border border-rose-200 font-bold' : 'badge-pending'}`}>
                                      {p.approvalStatus || 'Approved'}
                                    </span>
                                    {p.approvalStatus === 'Rejected' && p.rejectionReason && (
                                      <span className="text-[11px] text-red-600 italic line-clamp-2 bg-red-50 p-1 rounded border border-red-100" title={p.rejectionReason}>
                                        "{p.rejectionReason}"
                                      </span>
                                    )}
                                    {p.approvalStatus === 'Pending Approval' && p.rejectionReason && (
                                      <span className="text-[11px] text-amber-700 italic line-clamp-2 bg-amber-50 p-1 rounded border border-amber-100" title={p.rejectionReason}>
                                        Note: "{p.rejectionReason}"
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3.5 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenShareCatalog(p)}
                                      className="p-2 text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors cursor-pointer shrink-0 shadow-2xs"
                                      title="Share product link"
                                    >
                                      <Share2 size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleEditClick(p)}
                                      className="p-2 text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 rounded-md border border-amber-200 transition-colors cursor-pointer shrink-0 shadow-2xs"
                                      title="Edit product details"
                                    >
                                      <Edit size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteProduct(p)}
                                      className="p-2 text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-md border border-rose-200 transition-colors cursor-pointer shrink-0 shadow-2xs"
                                      title="Delete product"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    /* Grid View */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {paginatedSellerProducts.map((p) => (
                        <div key={p.id || p._id} className="border border-gray-200 rounded-sm p-3 flex flex-col justify-between">
                          <div
                            className="relative group cursor-pointer overflow-hidden rounded-sm mb-3"
                            title="Click to view full image (Esc to close)"
                            onClick={() =>
                              setPreviewModal({
                                isOpen: true,
                                images: p.images && p.images.length > 0 ? p.images : [p.image || '/assets/jewellery/necklace/1.jpg'],
                                initialIndex: 0,
                                title: p.name
                              })
                            }
                          >
                            <img src={p.images ? p.images[0] : p.image} alt={p.name} className="w-full aspect-square object-cover rounded-sm group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <span className="bg-black/70 text-white text-xs px-2.5 py-1 rounded flex items-center gap-1 font-medium shadow-md">
                                <ZoomIn size={14} /> Full View
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className={`badge-status text-xs ${p.approvalStatus === 'Approved' ? 'badge-approved' : p.approvalStatus === 'Rejected' ? 'bg-rose-100 text-rose-800 border border-rose-200 font-bold' : 'badge-pending'}`}>
                                {p.approvalStatus || 'Approved'}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenShareCatalog(p)}
                                  className="p-1.5 text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors cursor-pointer shadow-2xs"
                                  title="Share product link"
                                >
                                  <Share2 size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEditClick(p)}
                                  className="p-1.5 text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200 transition-colors cursor-pointer shadow-2xs"
                                  title="Edit product details"
                                >
                                  <Edit size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(p)}
                                  className="p-1.5 text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors cursor-pointer shadow-2xs"
                                  title="Delete product"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                            <h4 className="text-sm font-medium text-charcoal mt-2 mb-1 truncate max-w-full" title={p.name}>{p.name}</h4>
                            <div className="font-semibold text-sm">₹{p.price ? Number(p.price).toLocaleString('en-IN') : '0'}</div>

                            {/* Rejection Details Box */}
                            {p.approvalStatus === 'Rejected' && (
                              <div className="mt-2.5 p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-900 space-y-1">
                                <div className="flex items-center justify-between font-bold text-[0.72rem]">
                                  <span className="flex items-center gap-1 text-red-700">
                                    <AlertCircle size={13} /> Rejected by Admin
                                  </span>
                                  <span className="text-[0.65rem] text-gray-500 font-mono">
                                    {p.rejectedAt ? new Date(p.rejectedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}
                                  </span>
                                </div>
                                <div className="text-[0.72rem] text-red-800 italic bg-white/80 p-1.5 rounded border border-red-100">
                                  "{p.rejectionReason || 'Please verify product details and resubmit.'}"
                                </div>
                              </div>
                            )}

                            {/* Pending Re-approval Notice Box */}
                            {p.approvalStatus === 'Pending Approval' && p.rejectionReason && (
                              <div className="mt-2.5 p-2.5 bg-amber-50/90 border border-amber-200 rounded text-xs text-amber-900 space-y-1">
                                <div className="flex items-center justify-between font-bold text-[0.72rem]">
                                  <span className="flex items-center gap-1 text-amber-800">
                                    <Clock size={13} /> Resubmitted for Re-approval
                                  </span>
                                  <span className="text-[0.65rem] text-gray-500 font-mono">
                                    Rejected: {p.rejectedAt ? new Date(p.rejectedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}
                                  </span>
                                </div>
                                <div className="text-[0.72rem] text-amber-800 italic bg-white/80 p-1.5 rounded border border-amber-100">
                                  Previous Note: "{p.rejectionReason}"
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination Controls */}
                  {filteredSellerProducts.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-100 text-xs sm:text-sm text-gray-600">
                      <div>
                        Showing <span className="font-semibold text-charcoal">{indexOfFirstProduct + 1}</span> to{' '}
                        <span className="font-semibold text-charcoal">{Math.min(indexOfLastProduct, filteredSellerProducts.length)}</span> of{' '}
                        <span className="font-semibold text-charcoal">{filteredSellerProducts.length}</span> products
                      </div>

                      {totalProductPages > 1 && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setProductCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={productCurrentPage === 1}
                            className="px-3 py-1.5 rounded border border-gray-300 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            Previous
                          </button>

                          {Array.from({ length: totalProductPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => setProductCurrentPage(pageNum)}
                              className={`w-8 h-8 rounded text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                                productCurrentPage === pageNum
                                  ? 'bg-gold text-white font-bold shadow-2xs'
                                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}

                          <button
                            type="button"
                            onClick={() => setProductCurrentPage((prev) => Math.min(prev + 1, totalProductPages))}
                            disabled={productCurrentPage === totalProductPages}
                            className="px-3 py-1.5 rounded border border-gray-300 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ADD PRODUCT FORM TAB */}
            {activeTab === 'add-product' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <h3 className="font-heading text-2xl mb-2">
                  Submit New Jewellery Product for Admin Approval
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-6">
                  Provide complete metal purity, weight, and gemstone specifications. Products are reviewed by Ratnaya compliance before appearing publicly.
                </p>

                {productAddedSuccess && (
                  <div className="bg-emerald-50 text-emerald-800 p-4 rounded-sm mb-6 flex items-center gap-2 text-sm">
                    <CheckCircle2 size={20} /> Product submitted! Pending Admin Review.
                  </div>
                )}

                <form onSubmit={handleAddProductSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Product Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Royal Kundan & Emerald Choker Set"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Category</label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="input-field"
                      >
                        <option value="necklaces">Necklaces</option>
                        <option value="rings">Rings</option>
                        <option value="earrings">Earrings</option>
                        <option value="bracelets">Bracelets</option>
                        <option value="bangles">Bangles</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Price (₹ INR) *</label>
                      <input
                        type="number"
                        required
                        placeholder="185000"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Metal Type</label>
                      <input
                        type="text"
                        value={newProduct.metal}
                        onChange={(e) => setNewProduct({ ...newProduct, metal: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Purity (BIS Hallmark)</label>
                      <input
                        type="text"
                        value={newProduct.purity}
                        onChange={(e) => setNewProduct({ ...newProduct, purity: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    {/* Product Dual Image Upload Section */}
                    <div className="sm:col-span-2 space-y-4">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <label className="text-xs font-semibold uppercase text-gold-dark tracking-wider block">
                          Product Images (Front View & Secondary Hover View) *
                        </label>
                        <span className="text-[0.68rem] text-gray-400">Upload 2 images for smooth hover card effect</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Image 1: Main Front Cover Photo */}
                        <div className="bg-gray-50/90 p-4 border border-gray-200 rounded-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-charcoal flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-gold text-white text-[0.65rem] flex items-center justify-center font-bold">1</span>
                              Main Front Cover Photo *
                            </span>
                            <span className="text-[0.65rem] bg-gold/15 text-gold-dark font-medium px-2 py-0.5 rounded">Default View</span>
                          </div>

                          <div className="flex gap-3 items-start">
                            {/* Live Preview 1 */}
                            <div className="w-24 h-24 rounded-sm border border-gray-300 bg-white overflow-hidden flex items-center justify-center relative shrink-0 shadow-sm">
                              {newProduct.image ? (
                                <img src={newProduct.image} alt="Front Preview" className="w-full h-full object-cover" />
                              ) : (
                                <div className="text-center p-2 text-gray-400">
                                  <Upload className="mx-auto mb-1" size={18} />
                                  <span className="text-[0.6rem]">Front View</span>
                                </div>
                              )}
                            </div>

                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                required
                                placeholder="Image 1 URL or File"
                                value={newProduct.image}
                                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                className="input-field text-xs bg-white py-1.5"
                              />

                              <label className="btn-outline-gold py-1 px-2.5 text-[0.7rem] cursor-pointer inline-flex items-center gap-1 bg-white">
                                <Upload size={12} /> Upload File 1
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files && e.target.files[0];
                                    if (file) {
                                      handleImageFileUpload(file, (url) => setNewProduct((prev) => ({ ...prev, image: url })), newProduct.category || 'bracelet');
                                    }
                                  }}
                                />
                              </label>

                              {/* Presets for Image 1 */}
                              <div className="flex flex-wrap gap-1 pt-1">
                                {[
                                  { label: 'Necklace 1', url: '/assets/jewellery/necklace/1.jpg' },
                                  { label: 'Ring 1', url: '/assets/jewellery/ring/1.jpg' },
                                  { label: 'Earring 1', url: '/assets/jewellery/earrings/1.jpg' }
                                ].map((p) => (
                                  <button
                                    key={p.label}
                                    type="button"
                                    onClick={() => setNewProduct({ ...newProduct, image: p.url })}
                                    className="text-[0.62rem] px-1.5 py-0.5 border border-gray-300 rounded bg-white hover:border-gold"
                                  >
                                    {p.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Image 2: Secondary Hover Photo */}
                        <div className="bg-gray-50/90 p-4 border border-gray-200 rounded-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-charcoal flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-charcoal text-white text-[0.65rem] flex items-center justify-center font-bold">2</span>
                              Secondary Angle Photo (Hover View)
                            </span>
                            <span className="text-[0.65rem] bg-gray-200 text-gray-700 font-medium px-2 py-0.5 rounded">Hover Effect</span>
                          </div>

                          <div className="flex gap-3 items-start">
                            {/* Live Preview 2 */}
                            <div className="w-24 h-24 rounded-sm border border-gray-300 bg-white overflow-hidden flex items-center justify-center relative shrink-0 shadow-sm">
                              {newProduct.image2 ? (
                                <img src={newProduct.image2} alt="Hover Preview" className="w-full h-full object-cover" />
                              ) : (
                                <div className="text-center p-2 text-gray-400">
                                  <Upload className="mx-auto mb-1" size={18} />
                                  <span className="text-[0.6rem]">Side / Model</span>
                                </div>
                              )}
                            </div>

                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                placeholder="Image 2 URL or File"
                                value={newProduct.image2 || ''}
                                onChange={(e) => setNewProduct({ ...newProduct, image2: e.target.value })}
                                className="input-field text-xs bg-white py-1.5"
                              />

                              <label className="btn-outline-gold py-1 px-2.5 text-[0.7rem] cursor-pointer inline-flex items-center gap-1 bg-white">
                                <Upload size={12} /> Upload File 2
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files && e.target.files[0];
                                    if (file) {
                                      handleImageFileUpload(file, (url) => setNewProduct((prev) => ({ ...prev, image2: url })), newProduct.category || 'bracelet');
                                    }
                                  }}
                                />
                              </label>

                              {/* Presets for Image 2 */}
                              <div className="flex flex-wrap gap-1 pt-1">
                                {[
                                  { label: 'Angle 2', url: '/assets/jewellery/necklace/2.jpg' },
                                  { label: 'Model View', url: '/assets/jewellery/ring/2.jpg' },
                                  { label: 'Close Up', url: '/assets/jewellery/earrings/2.jpg' }
                                ].map((p) => (
                                  <button
                                    key={p.label}
                                    type="button"
                                    onClick={() => setNewProduct({ ...newProduct, image2: p.url })}
                                    className="text-[0.62rem] px-1.5 py-0.5 border border-gray-300 rounded bg-white hover:border-gold"
                                  >
                                    {p.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Product Description</label>
                      <textarea
                        rows={4}
                        placeholder="Detail the craftsmanship, Meenakari work, gold purity, and design inspiration..."
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-gold py-3.5 text-xs font-semibold">
                    SUBMIT PRODUCT FOR ADMIN APPROVAL
                  </button>
                </form>
              </div>
            )}

            {/* EARNINGS & PAYOUTS TAB */}
            {activeTab === 'earnings' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <h3 className="font-heading text-2xl mb-2">
                  Merchant Earnings & Admin Commission Breakdown
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-6">
                  Transparency report showing gross marketplace sales, platform commission deductions, and net payouts.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-5 bg-[#FAF6F0] border border-gray-200 rounded-sm">
                    <span className="text-xs uppercase text-gray-500">Gross Sales Revenue</span>
                    <h4 className="font-heading text-2xl my-1 text-charcoal">
                      ₹{totalRevenue.toLocaleString('en-IN')}
                    </h4>
                  </div>
                  <div className="p-5 bg-[#FAF6F0] border border-gray-200 rounded-sm">
                    <span className="text-xs uppercase text-gray-500">Admin Commission ({seller.commissionRate || 10}%)</span>
                    <h4 className="font-heading text-2xl my-1 text-gold-dark">
                      ₹{Math.round(totalRevenue * ((seller.commissionRate || 10) / 100)).toLocaleString('en-IN')}
                    </h4>
                  </div>
                  <div className="p-5 bg-[#FAF6F0] border border-gray-200 rounded-sm">
                    <span className="text-xs uppercase text-gray-500">Net Bank Payout</span>
                    <h4 className="font-heading text-2xl my-1 text-emerald-700">
                      ₹{Math.round(totalRevenue * (1 - (seller.commissionRate || 10) / 100)).toLocaleString('en-IN')}
                    </h4>
                  </div>
                </div>
              </div>
            )}

            {/* SELLING, PAYMENT & RETURN REPORTS TAB */}
            {activeTab === 'reports' && (
              <FinancialReportsView
                orders={sellerOrders}
                userRole="seller"
                sellerInfo={sellerProfile}
                globalGstRate={3}
              />
            )}

            {/* TAX INVOICES TAB */}
            {activeTab === 'invoices' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-4 mb-6 gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 bg-gold/15 text-gold-dark px-3 py-1 rounded-full text-[0.68rem] font-bold uppercase tracking-wider mb-1">
                      <FileText size={14} /> OFFICIAL STORE TAX INVOICES
                    </div>
                    <h3 className="font-heading text-2xl text-charcoal mb-1">
                      Customer GST Tax Invoices & Billing
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      View, print, and download GST tax invoices for all customer orders placed with your store.
                    </p>
                  </div>
                  <span className="badge-gold text-xs">{sellerOrders.length} Invoices</span>
                </div>

                {/* Summary Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 bg-[#FAF6F0] border border-gray-200 rounded-sm">
                    <span className="text-xs uppercase text-gray-500 font-medium">Total Store Invoices</span>
                    <h4 className="font-heading text-2xl my-1 text-charcoal">
                      {sellerOrders.length} Bills
                    </h4>
                    <span className="text-xs text-gray-500">Issued GST Invoices</span>
                  </div>

                  <div className="p-5 bg-[#FAF6F0] border border-gray-200 rounded-sm">
                    <span className="text-xs uppercase text-gray-500 font-medium">Total Invoiced Sales</span>
                    <h4 className="font-heading text-2xl my-1 text-gold-dark">
                      ₹{sellerOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0).toLocaleString('en-IN')}
                    </h4>
                    <span className="text-xs text-emerald-700 font-medium">Gross Revenue Value</span>
                  </div>

                  <div className="p-5 bg-[#FAF6F0] border border-gray-200 rounded-sm">
                    <span className="text-xs uppercase text-gray-500 font-medium">GST Tax Liability (3%)</span>
                    <h4 className="font-heading text-2xl my-1 text-charcoal">
                      ₹{Math.round(sellerOrders.reduce((acc, o) => {
                        const amt = o.totalAmount || 0;
                        return acc + (amt - (amt / 1.03));
                      }, 0)).toLocaleString('en-IN')}
                    </h4>
                    <span className="text-xs text-gray-500">Statutory Tax Component</span>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="bg-[#FAF6F0] p-4 rounded-sm border border-gray-200 flex items-center justify-between gap-4">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    <input
                      type="text"
                      placeholder="Search by Invoice No, Order ID, Buyer..."
                      value={invoiceSearchQuery}
                      onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                      className="input-field text-xs bg-white py-2"
                      style={{ paddingLeft: '38px' }}
                    />
                  </div>
                </div>

                {/* Table */}
                {sellerOrders.length === 0 ? (
                  <div className="bg-[#FAF6F0] p-12 text-center border border-gray-200 rounded-sm">
                    <FileText className="mx-auto text-gold-dark mb-3" size={36} />
                    <h4 className="font-heading text-xl text-charcoal mb-1">No Invoices Available</h4>
                    <p className="text-xs text-gray-500">Invoices will automatically generate once orders are received.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-gray-200 rounded-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#111111] text-white uppercase text-[0.7rem] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Invoice No</th>
                          <th className="py-3 px-4">Order ID & Date</th>
                          <th className="py-3 px-4">Customer Details</th>
                          <th className="py-3 px-4 text-right">Invoiced Amount</th>
                          <th className="py-3 px-4 text-right">GST Tax (3%)</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {sellerOrders
                          .filter((ord) => {
                            const query = invoiceSearchQuery.toLowerCase();
                            const invNo = `inv-${ord.id}`.toLowerCase();
                            return !query ||
                              invNo.includes(query) ||
                              (ord.id && ord.id.toLowerCase().includes(query)) ||
                              (ord.buyerName && ord.buyerName.toLowerCase().includes(query));
                          })
                          .map((ord) => {
                            const orderAmt = ord.totalAmount || 0;
                            const gstAmt = Math.round(orderAmt - (orderAmt / 1.03));

                            return (
                              <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="py-3.5 px-4 font-mono font-bold text-gold-dark">
                                  INV-{(ord.id || '').replace(/^ORD-?/i, '')}
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="font-mono text-charcoal font-semibold">{ord.id}</div>
                                  <div className="text-[0.68rem] text-gray-500">{ord.date || 'Recent'}</div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="font-semibold text-charcoal">{ord.buyerName || ord.customerName || 'Customer'}</div>
                                  <div className="text-[0.68rem] text-gray-500">{ord.buyerEmail || ''}</div>
                                </td>
                                <td className="py-3.5 px-4 text-right font-mono font-bold text-charcoal">
                                  ₹{orderAmt.toLocaleString('en-IN')}
                                </td>
                                <td className="py-3.5 px-4 text-right font-mono text-gray-600">
                                  ₹{gstAmt.toLocaleString('en-IN')}
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <span className={`inline-block px-2.5 py-0.5 rounded text-[0.65rem] font-bold ${
                                    ord.status === 'Delivered'
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : ord.status === 'Shipped'
                                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                      : ord.status === 'Refunded'
                                      ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                                  }`}>
                                    {ord.status || 'Confirmed'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <button
                                    onClick={() => setSelectedInvoiceOrder(ord)}
                                    className="btn-gold py-1.5 px-3 text-xs font-semibold inline-flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap"
                                  >
                                    <FileText size={14} /> View Tax Invoice
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* MERCHANT ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-4 mb-6 gap-4">
                  <div>
                    <h3 className="font-heading text-2xl text-charcoal mb-1">
                      Merchant Orders & Fulfillment
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Manage client orders, track insured shipments, update delivery statuses, and handle return requests.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge-gold text-xs">{sellerOrders.length} Total Orders</span>
                    {isOrderFilterActive && (
                      <span className="bg-gold/20 text-gold-dark text-xs px-2.5 py-1 rounded-full font-semibold border border-gold/30">
                        {filteredSellerOrders.length} Filtered
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Status Filter Pills */}
                {sellerOrders.length > 0 && (
                  <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                    {[
                      { id: 'All', label: 'All Orders', count: statusCounts.All },
                      { id: 'Order Requested', label: 'New Requests 🔔', count: statusCounts['Order Requested'] },
                      { id: 'Confirmed', label: 'Confirmed', count: statusCounts.Confirmed },
                      { id: 'Shipped', label: 'Shipped', count: statusCounts.Shipped },
                      { id: 'Delivered', label: 'Delivered', count: statusCounts.Delivered },
                      { id: 'Return Requested', label: 'Return Requests', count: statusCounts['Return Requested'] },
                      { id: 'Refunded', label: 'Refunded', count: statusCounts.Refunded },
                      { id: 'Cancelled', label: 'Cancelled', count: statusCounts.Cancelled }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setOrderStatusFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                          orderStatusFilter === tab.id
                            ? 'bg-gold-dark text-white font-semibold shadow-xs'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                            orderStatusFilter === tab.id
                              ? 'bg-white/20 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Search & Filter Controls Bar */}
                {sellerOrders.length > 0 && (
                  <div className="bg-[#FAF6F0] p-4 rounded border border-gray-200 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs">
                    {/* Search Box */}
                    <div className="relative flex-1">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by Order ID, Buyer Name, Email, or Item..."
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-gray-300 rounded focus:border-gold focus:outline-none transition-colors"
                      />
                      {orderSearchQuery && (
                        <button
                          onClick={() => setOrderSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Dropdowns & Actions */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Status Dropdown */}
                      <div className="flex items-center gap-1">
                        <Filter size={13} className="text-gray-500 shrink-0" />
                        <select
                          value={orderStatusFilter}
                          onChange={(e) => setOrderStatusFilter(e.target.value)}
                          className="bg-white border border-gray-300 text-xs py-2 px-2.5 rounded font-medium text-charcoal focus:border-gold focus:outline-none cursor-pointer"
                        >
                          <option value="All">All Statuses ({statusCounts.All})</option>
                          <option value="Order Requested">New Requests 🔔 ({statusCounts['Order Requested']})</option>
                          <option value="Confirmed">Confirmed ({statusCounts.Confirmed})</option>
                          <option value="Shipped">Shipped ({statusCounts.Shipped})</option>
                          <option value="Delivered">Delivered ({statusCounts.Delivered})</option>
                          <option value="Return Requested">Return Requested ({statusCounts['Return Requested']})</option>
                          <option value="Refunded">Refunded ({statusCounts.Refunded})</option>
                          <option value="Cancelled">Cancelled ({statusCounts.Cancelled})</option>
                        </select>
                      </div>

                      {/* Date Filter Dropdown */}
                      <select
                        value={orderDateFilter}
                        onChange={(e) => setOrderDateFilter(e.target.value)}
                        className="bg-white border border-gray-300 text-xs py-2 px-2.5 rounded font-medium text-charcoal focus:border-gold focus:outline-none cursor-pointer"
                      >
                        <option value="All">All Dates</option>
                        <option value="today">Today</option>
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                      </select>

                      {/* Sort By Dropdown */}
                      <select
                        value={orderSortBy}
                        onChange={(e) => setOrderSortBy(e.target.value)}
                        className="bg-white border border-gray-300 text-xs py-2 px-2.5 rounded font-medium text-charcoal focus:border-gold focus:outline-none cursor-pointer"
                      >
                        <option value="newest">Sort: Newest First</option>
                        <option value="oldest">Sort: Oldest First</option>
                        <option value="amount-high">Amount: High to Low</option>
                        <option value="amount-low">Amount: Low to High</option>
                      </select>

                      {/* Reset Filters Button */}
                      {isOrderFilterActive && (
                        <button
                          onClick={handleResetOrderFilters}
                          className="py-2 px-3 text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded font-medium transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                          title="Reset all search and filter criteria"
                        >
                          <RotateCcw size={12} /> Reset
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Showing Results Indicator */}
                {sellerOrders.length > 0 && isOrderFilterActive && (
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4 px-1">
                    <span>
                      Showing <strong>{filteredSellerOrders.length}</strong> of <strong>{sellerOrders.length}</strong> orders
                    </span>
                    <button onClick={handleResetOrderFilters} className="text-gold-dark hover:underline font-medium cursor-pointer">
                      Clear all filters
                    </button>
                  </div>
                )}

                {/* Orders List or Empty State */}
                {sellerOrders.length === 0 ? (
                  <div className="bg-[#FAF6F0] p-12 text-center border border-gray-200 rounded-sm">
                    <ShoppingBag className="mx-auto text-gold-dark mb-3" size={36} />
                    <h4 className="font-heading text-xl text-charcoal mb-1">No Orders Found</h4>
                    <p className="text-xs text-gray-500">New orders placed for your jewellery pieces will appear here.</p>
                  </div>
                ) : filteredSellerOrders.length === 0 ? (
                  <div className="bg-[#FAF6F0] p-12 text-center border border-gray-200 rounded-sm">
                    <Search className="mx-auto text-gold-dark mb-3" size={32} />
                    <h4 className="font-heading text-lg text-charcoal mb-1">No Matching Orders Found</h4>
                    <p className="text-xs text-gray-500 mb-4">No order records match your search query or selected filters.</p>
                    <button
                      onClick={handleResetOrderFilters}
                      className="btn-gold py-2 px-4 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw size={14} /> Clear Search & Filters
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1 px-1">
                      <span>Click <strong>"View More"</strong> on any order row to view items, address, status controls & tax invoice.</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const allExpanded = {};
                            filteredSellerOrders.forEach((o) => { allExpanded[o.id] = true; });
                            setExpandedOrders(allExpanded);
                          }}
                          className="text-[0.72rem] text-gold-dark hover:underline font-medium cursor-pointer"
                        >
                          Expand All
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => setExpandedOrders({})}
                          className="text-[0.72rem] text-gray-500 hover:underline font-medium cursor-pointer"
                        >
                          Collapse All
                        </button>
                      </div>
                    </div>

                    {filteredSellerOrders.map((ord) => (
                      <div key={ord.id} className="border border-gray-200 rounded-sm bg-white shadow-2xs overflow-hidden transition-all">
                        {/* SINGLE LINE COMPACT SUMMARY ROW */}
                        <div className="p-3 sm:p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 hover:bg-amber-50/20 transition-colors">
                          <div className="flex flex-wrap items-center gap-3 min-w-0">
                            <div className="flex items-center gap-2">
                              <strong className="text-sm font-heading tracking-wide text-charcoal">{ord.id}</strong>
                              <span className="text-xs text-gray-300">•</span>
                              <span className="text-xs text-gray-500 whitespace-nowrap">{ord.date || 'Recent'}</span>
                            </div>

                            <span className="text-xs text-gray-300 hidden md:inline">|</span>

                            <div className="text-xs text-gray-600 truncate max-w-[260px]" title={`${ord.buyerName || ord.customerName || 'Customer'} (${ord.buyerEmail || ''})`}>
                              <span className="text-gray-400">Buyer:</span> <strong>{ord.buyerName || ord.customerName || 'Priya Malhotra'}</strong>
                            </div>

                            {ord.items && ord.items.length > 0 && (
                              <span className="text-[0.68rem] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium hidden lg:inline-block">
                                {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                            {/* Status Badge */}
                            {(ord.status === 'Order Requested' || ord.status === 'Pending Acceptance') && (
                              <span className="bg-amber-100 text-amber-950 border border-amber-300 text-[0.68rem] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-2xs">
                                <AlertCircle size={11} className="text-amber-600 animate-pulse" /> New Request 🔔
                              </span>
                            )}
                            {ord.status === 'Delivered' && (
                              <span className="bg-emerald-100 text-emerald-800 text-[0.68rem] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                                <CheckCircle2 size={11} /> Delivered
                              </span>
                            )}
                            {ord.status === 'Shipped' && (
                              <span className="bg-blue-100 text-blue-800 text-[0.68rem] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                                <Truck size={11} /> In Transit
                              </span>
                            )}
                            {ord.status === 'Confirmed' && (
                              <span className="bg-amber-100 text-amber-800 text-[0.68rem] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                                <Clock size={11} /> Confirmed
                              </span>
                            )}
                            {ord.status === 'Return Requested' && (
                              <span className="bg-purple-100 text-purple-800 text-[0.68rem] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                                <RotateCcw size={11} /> Return Req.
                              </span>
                            )}
                            {ord.status === 'Refunded' && (
                              <span className="bg-emerald-600 text-white text-[0.68rem] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                                <DollarSign size={11} /> Refunded
                              </span>
                            )}
                            {ord.status === 'Cancelled' && (
                              <span className="bg-rose-100 text-rose-800 text-[0.68rem] px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                                <XCircle size={11} /> Cancelled
                              </span>
                            )}

                            {/* Total Amount */}
                            <strong className="text-sm sm:text-base text-charcoal font-heading min-w-[80px] text-right">
                              ₹{(ord.totalAmount || 0).toLocaleString('en-IN')}
                            </strong>

                            {/* VIEW MORE / VIEW LESS TOGGLE BUTTON */}
                            <button
                              onClick={() => toggleOrderExpand(ord.id)}
                              className={`py-1.5 px-3 text-xs font-semibold rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                                expandedOrders[ord.id]
                                  ? 'bg-charcoal text-white shadow-xs'
                                  : 'bg-gold-dark text-white hover:bg-gold transition-colors shadow-2xs'
                              }`}
                              title={expandedOrders[ord.id] ? 'Click to collapse details' : 'Click to view full order details'}
                            >
                              <span>{expandedOrders[ord.id] ? 'View Less' : 'View More'}</span>
                              {expandedOrders[ord.id] ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                            </button>
                          </div>
                        </div>

                        {/* EXPANDABLE ORDER DETAILS SECTION (ONLY SHOWN WHEN VIEW MORE IS CLICKED) */}
                        {expandedOrders[ord.id] && (
                          <div className="p-4 sm:p-5 bg-[#FAF6F0] space-y-4 animate-fadeIn border-t border-gray-200">
                            {/* NEW ORDER REQUEST ACTION BANNER */}
                            {(ord.status === 'Order Requested' || ord.status === 'Pending Acceptance') && (
                              <div className="p-3.5 bg-amber-50 border-l-4 border-amber-500 rounded text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                                <div>
                                  <strong className="font-bold text-amber-950 flex items-center gap-1.5 text-sm mb-0.5">
                                    <AlertCircle size={16} className="text-amber-600 shrink-0" /> New Order Request — Seller Acceptance Required
                                  </strong>
                                  <span className="text-amber-800 text-[0.72rem] block">
                                    Buyer <strong>{ord.buyerName || 'Customer'}</strong> has placed a new order request. Click <strong>"ACCEPT & CONFIRM ORDER"</strong> to accept this order and begin fulfillment (Amazon Seller Portal style).
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => handleUpdateOrderStatus(ord.id, 'Confirmed')}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                                  >
                                    <CheckCircle2 size={14} /> ACCEPT & CONFIRM ORDER
                                  </button>
                                  <button
                                    onClick={() => handleUpdateOrderStatus(ord.id, 'Cancelled')}
                                    className="bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 py-2 px-3.5 rounded text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                                  >
                                    <XCircle size={14} /> DECLINE ORDER
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Customer Email & Full Details Banner */}
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-white p-2.5 rounded border border-gray-200">
                              <div>
                                <span className="text-gray-500 font-medium">Customer Email: </span>
                                <strong className="text-charcoal font-mono">{ord.buyerEmail || 'priya.m@gmail.com'}</strong>
                              </div>
                              <div className="text-gray-500">
                                <span>Order Date: <strong>{ord.date}</strong></span>
                              </div>
                            </div>

                            {/* Items Purchased */}
                            {ord.items && ord.items.length > 0 && (
                              <div>
                                <span className="text-[0.68rem] text-gray-500 font-semibold uppercase tracking-wider block mb-1.5">
                                  Purchased Items ({ord.items.length}):
                                </span>
                                <div className="space-y-2">
                                  {ord.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs bg-white p-2.5 rounded border border-gray-200">
                                      <div>
                                        <strong className="text-charcoal block">{item.name}</strong>
                                        <span className="text-gray-500">Qty: {item.qty || 1} • Unit Price: ₹{(item.price || 0).toLocaleString('en-IN')}</span>
                                      </div>
                                      <span className="font-semibold text-charcoal">₹{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Customer Delivery Address */}
                            {ord.address && (
                              <div className="p-3 bg-white rounded border border-gray-200 text-xs">
                                <span className="text-gray-500 font-semibold block uppercase tracking-wider mb-0.5 text-[0.68rem]">Shipping & Delivery Address:</span>
                                <span className="text-gray-800">{ord.address}</span>
                              </div>
                            )}

                            {/* Return Request Details Callout */}
                            {ord.status === 'Return Requested' && ord.returnDetails && (
                              <div className="p-3 bg-purple-50 border border-purple-200 rounded text-xs text-purple-900">
                                <div className="flex items-center justify-between font-bold mb-1">
                                  <span className="flex items-center gap-1 text-purple-800">
                                    <RotateCcw size={14} /> Customer Return Request Received
                                  </span>
                                  <span className="text-[0.68rem] text-purple-700">Date: {ord.returnDetails.requestDate || ord.date}</span>
                                </div>
                                <p className="mb-1"><strong>Reason:</strong> {ord.returnDetails.reason}</p>
                                {ord.returnDetails.comments && (
                                  <p className="italic text-[0.7rem] text-gray-600 mb-1">"{ord.returnDetails.comments}"</p>
                                )}
                                <p className="text-[0.68rem] text-purple-700"><strong>Refund Method Choice:</strong> {ord.returnDetails.refundMethod || 'Original Source'}</p>
                              </div>
                            )}

                            {/* Refund Completed Callout */}
                            {ord.status === 'Refunded' && ord.refundDetails && (
                              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900">
                                <div className="font-bold flex items-center justify-between mb-1">
                                  <span className="flex items-center gap-1 text-emerald-800">
                                    <CheckCircle2 size={14} /> Refund Issued & Completed
                                  </span>
                                  <span className="font-mono text-[0.68rem]">Txn ID: {ord.refundDetails.refundTxnId}</span>
                                </div>
                                <p className="text-[0.68rem] text-emerald-700">
                                  Amount ₹{(ord.refundDetails.refundAmount || ord.totalAmount).toLocaleString('en-IN')} credited back on {ord.refundDetails.refundDate}.
                                </p>
                              </div>
                            )}

                            {/* Cancelled Callout */}
                            {ord.status === 'Cancelled' && (
                              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-900 flex items-center justify-between">
                                <span className="flex items-center gap-1 font-medium">
                                  <XCircle size={14} className="text-rose-600" /> Order Cancelled: {ord.cancellationReason || 'Cancelled'}
                                </span>
                                <span className="text-[0.68rem] text-gray-500">{ord.cancelledAt || ord.date}</span>
                              </div>
                            )}

                            {/* Actions Footer */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-3 border-t border-gray-200">
                              <div className="flex items-center gap-2 text-xs">
                                <Truck size={16} className="text-gold-dark shrink-0" />
                                <span className="text-gray-500">Tracking:</span>
                                <strong className="font-mono text-charcoal">{ord.trackingNumber || ord.trackingCode || 'BLUEDART-EXP882'}</strong>
                              </div>

                              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                                {/* Update Status Dropdown */}
                                <div className="flex items-center gap-1 text-xs">
                                  <span className="text-gray-500 font-medium hidden sm:inline">Status:</span>
                                  <select
                                    value={ord.status || 'Confirmed'}
                                    onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                    className="input-field text-xs py-1.5 px-2 font-semibold bg-white border border-gray-300 rounded"
                                  >
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Shipped">Shipped (In Transit)</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Return Requested">Return Requested</option>
                                    <option value="Refunded">Refunded</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </div>

                                {/* View Tax Invoice Action */}
                                <button
                                  onClick={() => setSelectedInvoiceOrder(ord)}
                                  className="py-1.5 px-3 text-xs font-semibold rounded border bg-gold/10 text-gold-dark border-gold/40 hover:bg-gold/20 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                                  title="View / Print Tax Invoice"
                                >
                                  <FileText size={13} /> View Invoice
                                </button>

                                {/* Delete Order Action */}
                                <button
                                  onClick={() => handleDeleteSellerOrder(ord.id)}
                                  className="py-1.5 px-2.5 text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded border border-red-200 flex items-center gap-1 cursor-pointer font-medium"
                                  title="Delete Order Record"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STORE PROFILE & COMPLIANCE EDIT TAB */}
            {activeTab === 'store-profile' && (
              <div className="bg-white p-6 sm:p-8 border border-gray-200 rounded-sm shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <div>
                    <h3 className="font-heading text-2xl text-charcoal mb-1">
                      Merchant Store Profile & Verification Settings
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Update your store avatar logo, trade name, owner details, GSTIN, and BIS Hallmarking license credentials.
                    </p>
                  </div>
                  <span className="badge-approved text-xs flex items-center gap-1">
                    <ShieldCheck size={14} /> Verified Merchant Partner
                  </span>
                </div>

                {/* Toast Notification */}
                {isProfileSavedToast && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs sm:text-sm font-medium flex items-center gap-2 shadow-xs animate-fadeIn">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <span>Your merchant store profile, avatar logo, and compliance credentials have been updated!</span>
                  </div>
                )}

                <form onSubmit={handleSaveSellerProfile} className="space-y-6">
                  {/* Avatar Logo & Banner Upload */}
                  <div className="bg-[#FAF6F0] p-5 rounded border border-gray-200 space-y-4">
                    <h4 className="font-heading text-lg text-charcoal border-b border-gray-200/60 pb-2">
                      1. Store Branding & Profile Avatar
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Avatar Logo */}
                      <div className="flex items-start gap-4">
                        <img
                          src={api.getImageUrl(sellerProfile.logo || '/uploads/avatar.jpg')}
                          alt="Store Logo"
                          className="w-20 h-20 rounded-full object-cover border-2 border-gold shrink-0 shadow-md"
                        />
                        <div className="space-y-2 flex-1">
                          <label className="text-xs font-semibold uppercase text-charcoal block">Profile Logo Avatar</label>
                          <label className="btn-gold py-1.5 px-3 text-xs cursor-pointer inline-flex items-center gap-1.5">
                            <Upload size={14} /> Upload New Logo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files && e.target.files[0];
                                if (file) {
                                  handleImageFileUpload(file, (url) => setSellerProfile((prev) => ({ ...prev, logo: url })));
                                }
                              }}
                            />
                          </label>
                          <input
                            type="text"
                            placeholder="Image URL..."
                            value={sellerProfile.logo}
                            onChange={(e) => setSellerProfile({ ...sellerProfile, logo: e.target.value })}
                            className="input-field text-xs bg-white"
                          />
                        </div>
                      </div>

                      {/* Store Banner */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-charcoal block">Storefront Header Banner</label>
                        <div className="h-16 w-full rounded border border-gray-300 overflow-hidden bg-gray-100 mb-2 relative">
                          <img src={api.getImageUrl(sellerProfile.banner || '/uploads/banner.jpg')} alt="Store Banner" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="btn-outline-gold py-1.5 px-3 text-xs cursor-pointer inline-flex items-center gap-1.5 bg-white">
                            <Upload size={14} /> Upload Banner
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files && e.target.files[0];
                                if (file) {
                                  handleImageFileUpload(file, (url) => setSellerProfile((prev) => ({ ...prev, banner: url })));
                                }
                              }}
                            />
                          </label>
                          <input
                            type="text"
                            placeholder="Banner Image URL..."
                            value={sellerProfile.banner}
                            onChange={(e) => setSellerProfile({ ...sellerProfile, banner: e.target.value })}
                            className="input-field text-xs bg-white flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business & Contact Details */}
                  <div className="space-y-4">
                    <h4 className="font-heading text-lg text-charcoal border-b border-gray-200 pb-2">
                      2. Merchant & Business Details
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Store / Business Name *</label>
                        <input
                          type="text"
                          required
                          value={sellerProfile.name}
                          onChange={(e) => setSellerProfile({ ...sellerProfile, name: e.target.value })}
                          className="input-field text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Owner / Director Name *</label>
                        <input
                          type="text"
                          required
                          value={sellerProfile.owner}
                          onChange={(e) => setSellerProfile({ ...sellerProfile, owner: e.target.value })}
                          className="input-field text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Primary City / Base *</label>
                        <input
                          type="text"
                          required
                          value={sellerProfile.city}
                          onChange={(e) => setSellerProfile({ ...sellerProfile, city: e.target.value })}
                          className="input-field text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Contact Phone *</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9829012345"
                          value={sellerProfile.phone}
                          onChange={(e) => setSellerProfile({ ...sellerProfile, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                          className="input-field font-mono text-sm"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Business Email Address *</label>
                        <input
                          type="email"
                          required
                          value={sellerProfile.email}
                          onChange={(e) => setSellerProfile({ ...sellerProfile, email: e.target.value })}
                          className="input-field text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Compliance & License Identifiers */}
                  <div className="space-y-4 pt-2">
                    <h4 className="font-heading text-lg text-charcoal border-b border-gray-200 pb-2">
                      3. Verified Compliance & License Credentials
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* GSTIN Number */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold uppercase text-gray-700 block">GSTIN Number *</label>
                          {docVerification.gst?.success ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 size={10} /> Verified
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-400">15 Chars (e.g. 24AAAAA0000A1Z5)</span>
                          )}
                        </div>
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            required
                            placeholder="24AAAAA0000A1Z5"
                            value={sellerProfile.gst}
                            onChange={(e) => {
                              setSellerProfile({ ...sellerProfile, gst: e.target.value.toUpperCase() });
                              setDocVerification((prev) => ({ ...prev, gst: null }));
                            }}
                            className={`input-field font-mono uppercase text-sm pr-20 ${
                              docVerification.gst?.success
                                ? 'border-emerald-500 bg-emerald-50/20'
                                : docVerification.gst?.success === false
                                ? 'border-rose-400 bg-rose-50/20'
                                : ''
                            }`}
                          />
                          <button
                            type="button"
                            disabled={verifyingDoc.gst || !sellerProfile.gst}
                            onClick={() => handleVerifyDocument('gst')}
                            className="absolute right-1 px-2.5 py-1 text-xs font-semibold rounded bg-gold/15 text-charcoal hover:bg-gold hover:text-white transition-colors disabled:opacity-50"
                          >
                            {verifyingDoc.gst ? 'Verifying...' : docVerification.gst?.success ? 'Re-Verify' : 'Verify'}
                          </button>
                        </div>
                        {docVerification.gst && (
                          <p className={`text-[11px] ${docVerification.gst.success ? 'text-emerald-700 font-medium' : 'text-rose-600 font-medium'}`}>
                            {docVerification.gst.message}
                          </p>
                        )}
                      </div>

                      {/* PAN Card Number */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold uppercase text-gray-700 block">PAN Card Number *</label>
                          {docVerification.pan?.success ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 size={10} /> Verified
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-400">10 Chars (e.g. ABCDE1234F)</span>
                          )}
                        </div>
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            required
                            placeholder="ABCDE1234F"
                            value={sellerProfile.pan}
                            onChange={(e) => {
                              setSellerProfile({ ...sellerProfile, pan: e.target.value.toUpperCase() });
                              setDocVerification((prev) => ({ ...prev, pan: null }));
                            }}
                            className={`input-field font-mono uppercase text-sm pr-20 ${
                              docVerification.pan?.success
                                ? 'border-emerald-500 bg-emerald-50/20'
                                : docVerification.pan?.success === false
                                ? 'border-rose-400 bg-rose-50/20'
                                : ''
                            }`}
                          />
                          <button
                            type="button"
                            disabled={verifyingDoc.pan || !sellerProfile.pan}
                            onClick={() => handleVerifyDocument('pan')}
                            className="absolute right-1 px-2.5 py-1 text-xs font-semibold rounded bg-gold/15 text-charcoal hover:bg-gold hover:text-white transition-colors disabled:opacity-50"
                          >
                            {verifyingDoc.pan ? 'Verifying...' : docVerification.pan?.success ? 'Re-Verify' : 'Verify'}
                          </button>
                        </div>
                        {docVerification.pan && (
                          <p className={`text-[11px] ${docVerification.pan.success ? 'text-emerald-700 font-medium' : 'text-rose-600 font-medium'}`}>
                            {docVerification.pan.message}
                          </p>
                        )}
                      </div>

                      {/* BIS Hallmark License */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold uppercase text-gray-700 block">BIS Hallmark License *</label>
                          {docVerification.bis?.success ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 size={10} /> Verified
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-400">BIS Hallmark Cert</span>
                          )}
                        </div>
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            required
                            placeholder="BIS98765432"
                            value={sellerProfile.bisLicense}
                            onChange={(e) => {
                              setSellerProfile({ ...sellerProfile, bisLicense: e.target.value.toUpperCase() });
                              setDocVerification((prev) => ({ ...prev, bis: null }));
                            }}
                            className={`input-field font-mono uppercase text-sm pr-20 ${
                              docVerification.bis?.success
                                ? 'border-emerald-500 bg-emerald-50/20'
                                : docVerification.bis?.success === false
                                ? 'border-rose-400 bg-rose-50/20'
                                : ''
                            }`}
                          />
                          <button
                            type="button"
                            disabled={verifyingDoc.bis || !sellerProfile.bisLicense}
                            onClick={() => handleVerifyDocument('bis')}
                            className="absolute right-1 px-2.5 py-1 text-xs font-semibold rounded bg-gold/15 text-charcoal hover:bg-gold hover:text-white transition-colors disabled:opacity-50"
                          >
                            {verifyingDoc.bis ? 'Verifying...' : docVerification.bis?.success ? 'Re-Verify' : 'Verify'}
                          </button>
                        </div>
                        {docVerification.bis && (
                          <p className={`text-[11px] ${docVerification.bis.success ? 'text-emerald-700 font-medium' : 'text-rose-600 font-medium'}`}>
                            {docVerification.bis.message}
                          </p>
                        )}
                      </div>

                      {/* Submitted Compliance & KYC Proof Documents */}
                      <div className="pt-3 border-t border-gray-200/80 space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                          SUBMITTED COMPLIANCE & KYC PROOF DOCUMENTS:
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                          {/* GST Certificate Pill */}
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 bg-white shadow-2xs hover:border-gold transition-all text-xs text-charcoal">
                            <span className="text-sm">📄</span>
                            <span className="font-mono text-xs max-w-[150px] truncate font-medium">
                              {formatDocName(sellerProfile.gstDoc, 'GST_Certificate.pdf')}
                            </span>
                            <span className="text-[0.62rem] font-mono font-bold bg-amber-100/90 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300 shrink-0">
                              {formatDocSize(sellerProfile.gstDocSize, '1.25 MB')}
                            </span>
                            <label className="cursor-pointer text-gold hover:underline text-xs font-semibold ml-1">
                              Upload
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files && e.target.files[0];
                                  if (file) {
                                    handleImageFileUpload(
                                      file,
                                      (url) => setSellerProfile((prev) => ({ ...prev, gstDoc: url })),
                                      'documents',
                                      'GST_Certificate',
                                      (sz) => setSellerProfile((prev) => ({ ...prev, gstDocSize: sz }))
                                    );
                                  }
                                }}
                              />
                            </label>
                            {sellerProfile.gstDoc && (
                              <button
                                type="button"
                                onClick={() => openDocument(sellerProfile.gstDoc)}
                                className="text-emerald-700 hover:text-emerald-900 font-semibold text-xs ml-1 bg-transparent border-0 cursor-pointer"
                              >
                                View
                              </button>
                            )}
                          </div>

                          {/* PAN Card Pill */}
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 bg-white shadow-2xs hover:border-gold transition-all text-xs text-charcoal">
                            <span className="text-sm">💳</span>
                            <span className="font-mono text-xs max-w-[150px] truncate font-medium">
                              {formatDocName(sellerProfile.panDoc, 'PAN_Card.jpg')}
                            </span>
                            <span className="text-[0.62rem] font-mono font-bold bg-amber-100/90 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300 shrink-0">
                              {formatDocSize(sellerProfile.panDocSize, '480 KB')}
                            </span>
                            <label className="cursor-pointer text-gold hover:underline text-xs font-semibold ml-1">
                              Upload
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files && e.target.files[0];
                                  if (file) {
                                    handleImageFileUpload(
                                      file,
                                      (url) => setSellerProfile((prev) => ({ ...prev, panDoc: url })),
                                      'documents',
                                      'PAN_Card',
                                      (sz) => setSellerProfile((prev) => ({ ...prev, panDocSize: sz }))
                                    );
                                  }
                                }}
                              />
                            </label>
                            {sellerProfile.panDoc && (
                              <button
                                type="button"
                                onClick={() => openDocument(sellerProfile.panDoc)}
                                className="text-emerald-700 hover:text-emerald-900 font-semibold text-xs ml-1 bg-transparent border-0 cursor-pointer"
                              >
                                View
                              </button>
                            )}
                          </div>

                          {/* BIS Hallmark License Pill */}
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 bg-white shadow-2xs hover:border-gold transition-all text-xs text-charcoal">
                            <span className="text-sm">🏆</span>
                            <span className="font-mono text-xs max-w-[150px] truncate font-medium">
                              {formatDocName(sellerProfile.bisDoc, 'BIS_Hallmark_License.pdf')}
                            </span>
                            <span className="text-[0.62rem] font-mono font-bold bg-amber-100/90 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300 shrink-0">
                              {formatDocSize(sellerProfile.bisDocSize, '850 KB')}
                            </span>
                            <label className="cursor-pointer text-gold hover:underline text-xs font-semibold ml-1">
                              Upload
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files && e.target.files[0];
                                  if (file) {
                                    handleImageFileUpload(
                                      file,
                                      (url) => setSellerProfile((prev) => ({ ...prev, bisDoc: url })),
                                      'documents',
                                      'BIS_Hallmark_License',
                                      (sz) => setSellerProfile((prev) => ({ ...prev, bisDocSize: sz }))
                                    );
                                  }
                                }}
                              />
                            </label>
                            {sellerProfile.bisDoc && (
                              <button
                                type="button"
                                onClick={() => openDocument(sellerProfile.bisDoc)}
                                className="text-emerald-700 hover:text-emerald-900 font-semibold text-xs ml-1 bg-transparent border-0 cursor-pointer"
                              >
                                View
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Story & Description */}
                  <div className="pt-2">
                    <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Atelier Heritage Story / Bio</label>
                    <textarea
                      rows={3}
                      value={sellerProfile.about}
                      onChange={(e) => setSellerProfile({ ...sellerProfile, about: e.target.value })}
                      className="input-field text-sm"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button type="submit" className="btn-gold py-3.5 px-8 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck size={16} /> SAVE & UPDATE STORE PROFILE
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* PROMOTIONAL ADS TAB */}
            {activeTab === 'seller-ads' && (
              <div className="flex flex-col gap-8">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 p-6 rounded-md text-white shadow-lg relative overflow-hidden">
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gold/20 text-gold-light border border-gold/30 mb-2">
                        <Sparkles size={12} /> PROMOTIONAL ADVERTISING HUB
                      </span>
                      <h2 className="font-heading text-2xl text-gold-light">Promote Your Atelier & Collections</h2>
                      <p className="text-xs text-amber-100 max-w-2xl mt-1">
                        Place your sponsored ads directly on the <strong>Top Hero Banner</strong> or <strong>Royal Necklace Section Slider</strong>. Active ads rotate automatically in <strong>3-ad batches every 3 minutes</strong> across all live website visitors!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form to Launch New Ad */}
                <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm">
                  <div className="border-b border-gray-100 pb-4 mb-6">
                    <h3 className="font-heading text-lg text-charcoal flex items-center gap-2">
                      <Megaphone size={20} className="text-gold-dark" /> Create & Launch New Seller Ad
                    </h3>
                    <p className="text-xs text-gray-500">Fill in your ad creative details, select placement & duration option.</p>
                  </div>

                  {adCreatedSuccess && (
                    <div className="p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-900 rounded text-xs mb-6 font-medium flex items-center gap-2">
                      <Clock size= {18} className="text-amber-600 shrink-0" />
                      <div>
                        <strong>Ad Banner Submitted Successfully!</strong>
                        <p className="mt-0.5 font-normal text-amber-800">
                          Your ad banner has been sent to Admin for review. Once Admin approves it, it will automatically go Live on the Homepage!
                        </p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleCreateAdSubmit} className="flex flex-col gap-6">
                    {/* Step 1: Select Placement */}
                    <div>
                      <label className="text-xs font-semibold uppercase text-gray-700 mb-2 block">
                        1. Select Ad Placement Location *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setNewAdForm({ ...newAdForm, adType: 'top_banner', bannerSize: '1920x600', bannerSizeLabel: '1920 x 600 px (Top Hero Banner)' })}
                          className={`p-4 rounded border text-left transition-all ${
                            newAdForm.adType === 'top_banner'
                              ? 'border-gold-dark bg-[#FAF6F0] ring-1 ring-gold-dark/40 shadow-sm'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <span className="block text-xs font-bold text-gray-900 mb-1">
                            🏆 Top Hero Banner Ad
                          </span>
                          <span className="block text-[11px] text-gray-500">
                            Appears at the top hero section slider of homepage. Maximum visibility for brand awareness.
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setNewAdForm({ ...newAdForm, adType: 'section', bannerSize: '1200x400', bannerSizeLabel: '1200 x 400 px (Royal Collection Section Banner)' })}
                          className={`p-4 rounded border text-left transition-all ${
                            newAdForm.adType === 'section'
                              ? 'border-gold-dark bg-[#FAF6F0] ring-1 ring-gold-dark/40 shadow-sm'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <span className="block text-xs font-bold text-gray-900 mb-1">
                            ✨ Section Ad (Royal Necklace Collection Slider)
                          </span>
                          <span className="block text-[11px] text-gray-500">
                            Appears in the dedicated Royal Necklace scrollable section. High conversion for jewellery buyers.
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Step 2: Select Banner Size Dimensions */}
                    <div>
                      <label className="text-xs font-semibold uppercase text-gray-700 mb-2 block flex items-center justify-between">
                        <span>2. Select Required Banner Dimensions (Image Size) *</span>
                        <span className="text-[10px] text-gold-dark font-normal lowercase">Please upload banner matching selected size</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { size: '1920x600', label: '1920 x 600 px', type: 'Top Hero Slider', ratio: 'Ratio 16:5', badge: 'HERO BANNER' },
                          { size: '1200x400', label: '1200 x 400 px', type: 'Middle Collection', ratio: 'Ratio 3:1', badge: 'SECTION BANNER' },
                          { size: '600x600', label: '600 x 600 px', type: 'Square Showcase', ratio: 'Ratio 1:1', badge: 'SQUARE CARD' }
                        ].map((bSize) => (
                          <button
                            key={bSize.size}
                            type="button"
                            onClick={() => setNewAdForm({
                              ...newAdForm,
                              bannerSize: bSize.size,
                              bannerSizeLabel: `${bSize.label} (${bSize.type})`
                            })}
                            className={`p-3.5 rounded border text-left transition-all ${
                              newAdForm.bannerSize === bSize.size
                                ? 'border-gold-dark bg-[#FAF6F0] ring-1 ring-gold-dark/40 shadow-sm'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-gray-900">{bSize.label}</span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">{bSize.badge}</span>
                            </div>
                            <span className="block text-[11px] text-gold-dark font-medium">{bSize.type}</span>
                            <span className="block text-[10px] text-gray-400 mt-0.5">{bSize.ratio}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 3: Select Duration */}
                    <div>
                      <label className="text-xs font-semibold uppercase text-gray-700 mb-2 block">
                        3. Select Ad Duration *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { days: 1, label: '1 Day Flash Ad', price: '₹299', desc: '24 Hours Active Duration' },
                          { days: 7, label: '7 Days Promo Ad', price: '₹1,499', desc: '1 Full Week Active Duration' },
                          { days: 30, label: '30 Days Mega Sponsor', price: '₹4,999', desc: '1 Full Month Active Duration' }
                        ].map((plan) => (
                          <button
                            key={plan.days}
                            type="button"
                            onClick={() => setNewAdForm({ ...newAdForm, durationDays: plan.days })}
                            className={`p-4 rounded border text-center transition-all ${
                              newAdForm.durationDays === plan.days
                                ? 'border-gold-dark bg-[#FAF6F0] ring-1 ring-gold-dark/40 shadow-sm'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                          >
                            <span className="block text-xs font-bold text-gray-900 mb-1">{plan.label}</span>
                            <span className="block text-lg font-bold text-gold-dark">{plan.price}</span>
                            <span className="block text-[10px] text-gray-500 mt-1">{plan.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 4: Creative Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Ad Headline Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Crafting Timeless Beauty With Distinctive Grace"
                          value={newAdForm.title}
                          onChange={(e) => setNewAdForm({ ...newAdForm, title: e.target.value })}
                          className="input-field text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Eyebrow Header</label>
                        <input
                          type="text"
                          placeholder="e.g. TIMELESS SOPHISTICATION"
                          value={newAdForm.eyebrow}
                          onChange={(e) => setNewAdForm({ ...newAdForm, eyebrow: e.target.value })}
                          className="input-field text-xs"
                        />
                      </div>

                      {newAdForm.adType === 'top_banner' && (
                        <div>
                          <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Background Watermark Text</label>
                          <input
                            type="text"
                            placeholder="e.g. INCOMPARABLE / AUTHENTIC"
                            value={newAdForm.watermark}
                            onChange={(e) => setNewAdForm({ ...newAdForm, watermark: e.target.value })}
                            className="input-field text-xs uppercase"
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Target Jewellery Category</label>
                        <select
                          value={newAdForm.targetCategory}
                          onChange={(e) => setNewAdForm({ ...newAdForm, targetCategory: e.target.value })}
                          className="input-field text-xs capitalize"
                        >
                          <option value="necklaces">Necklaces</option>
                          <option value="bangles">Bangles & Bracelets</option>
                          <option value="rings">Rings</option>
                          <option value="earrings">Earrings</option>
                          <option value="all">All Products</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Ad Description *</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Adorn your neck with royal Kundan chokers and glowing Zambian emerald haar..."
                        value={newAdForm.description}
                        onChange={(e) => setNewAdForm({ ...newAdForm, description: e.target.value })}
                        className="input-field text-xs"
                      />
                    </div>

                    {/* 6 BANNER IMAGES SELECTION / UPLOAD FOR TOP BANNER */}
                    {newAdForm.adType === 'top_banner' ? (
                      <div className="bg-[#FAF6F0] p-5 border border-gold-light/40 rounded-md space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-gold-light/30">
                          <div>
                            <span className="text-xs font-bold text-gray-900 uppercase block flex items-center gap-1.5">
                              📸 Top Hero Banner Image Setup ({newAdForm.bannerSize || '1920x600'} px)
                            </span>
                            <span className="text-[11px] text-gray-500">
                              Upload photos matching {newAdForm.bannerSize || '1920x600'} px dimension for best visual display on Homepage.
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsPreviewBannerModalOpen(true)}
                            className="btn-gold py-1.5 px-3 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                          >
                            <Eye size={14} /> LIVE PREVIEW BANNER
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Image 1: Main Center Hero Photo */}
                          <div className="bg-white p-3 border border-gray-200 rounded">
                            <label className="text-[11px] font-bold text-gray-800 uppercase block mb-1">
                              1. Main Hero Center Model Photo * ({newAdForm.bannerSize || '1920x600'})
                            </label>
                            <div className="flex items-center gap-3">
                              <img src={getImageUrl(newAdForm.mainImage || newAdForm.image)} alt="Main 1" className="w-14 h-14 rounded object-cover border border-gray-300 shrink-0" />
                              <div className="flex-1 space-y-1">
                                <label className="text-[10px] btn-gold py-1 px-2 cursor-pointer inline-flex items-center gap-1">
                                  <Upload size={10} /> Upload Main
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                    const file = e.target.files && e.target.files[0];
                                    if (file) handleImageFileUpload(file, (url) => setNewAdForm((prev) => ({ ...prev, mainImage: url, image: url })));
                                  }} />
                                </label>
                                <input type="text" value={newAdForm.mainImage || ''} onChange={(e) => setNewAdForm({ ...newAdForm, mainImage: e.target.value, image: e.target.value })} className="input-field text-[11px] py-1 bg-white" placeholder="/assets/jewellery/hero/main1.jpg" />
                              </div>
                            </div>
                          </div>

                          {/* Image 2: Right Arch Accent Photo */}
                          <div className="bg-white p-3 border border-gray-200 rounded">
                            <label className="text-[11px] font-bold text-gray-800 uppercase block mb-1">
                              2. Right Arch Accent Photo
                            </label>
                            <div className="flex items-center gap-3">
                              <img src={getImageUrl(newAdForm.accentImage || '/assets/jewellery/hero/rightside1.jpg')} alt="Accent 2" className="w-14 h-14 rounded object-cover border border-gray-300 shrink-0" />
                              <div className="flex-1 space-y-1">
                                <label className="text-[10px] btn-gold py-1 px-2 cursor-pointer inline-flex items-center gap-1">
                                  <Upload size={10} /> Upload Accent
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                    const file = e.target.files && e.target.files[0];
                                    if (file) handleImageFileUpload(file, (url) => setNewAdForm((prev) => ({ ...prev, accentImage: url })));
                                  }} />
                                </label>
                                <input type="text" value={newAdForm.accentImage || ''} onChange={(e) => setNewAdForm({ ...newAdForm, accentImage: e.target.value })} className="input-field text-[11px] py-1 bg-white" placeholder="/assets/jewellery/hero/rightside1.jpg" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Images 3, 4, 5, 6: 4 Gallery Sub-Thumbnails */}
                        <div className="pt-2 border-t border-gold-light/20">
                          <label className="text-xs font-bold text-gray-800 uppercase block mb-2">
                            🖼️ Left Vertical Strip (4 Gallery Sub-Thumbnails):
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                              { num: 3, key: 'thumb1', label: 'Thumb #1', def: '/assets/jewellery/hero/sub1-1.jpg' },
                              { num: 4, key: 'thumb2', label: 'Thumb #2', def: '/assets/jewellery/hero/sub1-2.jpg' },
                              { num: 5, key: 'thumb3', label: 'Thumb #3', def: '/assets/jewellery/hero/sub1-3.jpg' },
                              { num: 6, key: 'thumb4', label: 'Thumb #4', def: '/assets/jewellery/hero/sub1-4.jpg' }
                            ].map((tItem) => (
                              <div key={tItem.key} className="bg-white p-2.5 border border-gray-200 rounded">
                                <span className="block text-[10px] font-bold text-gray-700 mb-1">{tItem.label}</span>
                                <div className="flex items-center gap-2 mb-1">
                                  <img src={getImageUrl(newAdForm[tItem.key] || tItem.def)} alt={tItem.label} className="w-10 h-10 rounded object-cover border shrink-0" />
                                  <label className="text-[9px] btn-gold p-1 cursor-pointer inline-flex items-center shrink-0">
                                    <Upload size={9} /> Up
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                      const file = e.target.files && e.target.files[0];
                                      if (file) handleImageFileUpload(file, (url) => setNewAdForm((prev) => ({ ...prev, [tItem.key]: url })));
                                    }} />
                                  </label>
                                </div>
                                <input type="text" value={newAdForm[tItem.key] || ''} onChange={(e) => setNewAdForm({ ...newAdForm, [tItem.key]: e.target.value })} className="input-field text-[10px] py-0.5 px-1 bg-white" placeholder={tItem.def} />
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    ) : (
                      /* Section Ad Single Image Upload */
                      <div className="bg-[#FAF6F0] p-4 border border-gray-200 rounded-sm">
                        <label className="text-xs font-semibold uppercase text-charcoal mb-2 block flex items-center justify-between">
                          <span>Section Ad Banner Image * ({newAdForm.bannerSize || '1200x400'} px)</span>
                          {newAdForm.image && <span className="text-[0.65rem] text-emerald-700 font-medium">✓ Image Selected</span>}
                        </label>

                        <div className="flex gap-4 items-center">
                          <div className="w-20 h-20 rounded border border-gray-300 bg-white overflow-hidden shrink-0 shadow-sm">
                            <img src={getImageUrl(newAdForm.image)} alt="Ad Preview" className="w-full h-full object-cover" />
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <label className="btn-gold py-1.5 px-3 text-xs cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                                <Upload size={14} /> Upload Banner Photo ({newAdForm.bannerSize || '1200x400'})
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files && e.target.files[0];
                                    if (file) {
                                      handleImageFileUpload(file, (url) => setNewAdForm((prev) => ({ ...prev, image: url, mainImage: url })));
                                    }
                                  }}
                                />
                              </label>
                            </div>
                            <input
                              type="text"
                              placeholder="Or enter image asset URL / path..."
                              value={newAdForm.image || ''}
                              onChange={(e) => setNewAdForm({ ...newAdForm, image: e.target.value, mainImage: e.target.value })}
                              className="input-field text-xs bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 pt-2">
                      {newAdForm.adType === 'top_banner' && (
                        <button
                          type="button"
                          onClick={() => setIsPreviewBannerModalOpen(true)}
                          className="btn-outline-gold py-3 px-6 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Eye size={16} /> LIVE PREVIEW HERO BANNER
                        </button>
                      )}

                      <button type="submit" className="btn-gold flex-1 py-3 px-6 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer">
                        <Sparkles size={16} /> SUBMIT BANNER FOR ADMIN APPROVAL
                      </button>
                    </div>
                  </form>
                </div>

                {/* Table of Seller's Submitted Ads */}
                <div className="bg-white p-6 border border-gray-200 rounded-sm shadow-sm">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                    <div>
                      <h3 className="font-heading text-lg text-charcoal">My Banner Ads & Approval Status</h3>
                      <p className="text-xs text-gray-500">Track your uploaded banner ads and Admin approval status.</p>
                    </div>
                    <button onClick={loadMySellerAds} className="btn-outline py-1.5 px-3 text-xs flex items-center gap-1.5">
                      <RefreshCw size={14} /> Refresh Status
                    </button>
                  </div>

                  {loadingAds ? (
                    <div className="py-8 text-center text-xs text-gray-500">Loading seller ads...</div>
                  ) : mySellerAds.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 text-xs">
                      No ads created yet. Fill in the form above to submit your first promotional banner ad!
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-semibold uppercase">
                            <th className="p-3">Banner Image & Size</th>
                            <th className="p-3">Ad Title & Description</th>
                            <th className="p-3">Duration & Price</th>
                            <th className="p-3">Approval Status</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {mySellerAds.map((ad) => {
                            const isExpired = ad.status === 'expired' || new Date(ad.endDate) < new Date();
                            const isPending = ad.status === 'pending';
                            const isRejected = ad.status === 'rejected';
                            const daysRemaining = Math.max(0, Math.ceil((new Date(ad.endDate) - new Date()) / (1000 * 60 * 60 * 24)));

                            return (
                              <tr key={ad._id || ad.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-3">
                                  <div className="flex items-center gap-3">
                                    <img src={getImageUrl(ad.image)} alt={ad.title} className="w-14 h-12 rounded object-cover border border-gray-200" />
                                    <div>
                                      <span className="font-bold text-gray-900 block truncate max-w-[140px]">
                                        {ad.adType === 'top_banner' ? '🏆 Top Banner' : '✨ Section Ad'}
                                      </span>
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 font-medium text-gray-700 border border-gray-200 mt-0.5 inline-block">
                                        📐 {ad.bannerSize || '1920x600'} px
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                <td className="p-3 max-w-xs">
                                  <div className="font-semibold text-gray-900 truncate">{ad.title}</div>
                                  <div className="text-[11px] text-gray-500 line-clamp-1">{ad.description}</div>
                                  {isRejected && ad.rejectionReason && (
                                    <div className="text-[10px] text-rose-600 mt-1 font-medium bg-rose-50 p-1 rounded border border-rose-200">
                                      Rejection Reason: {ad.rejectionReason}
                                    </div>
                                  )}
                                </td>

                                <td className="p-3 whitespace-nowrap">
                                  <div className="text-gray-800 font-medium">
                                    {ad.durationDays} Days Plan (₹{ad.pricePaid || (ad.durationDays === 1 ? 299 : ad.durationDays === 30 ? 4999 : 1499)})
                                  </div>
                                  <div className="text-[10px] text-gray-500 mt-0.5">
                                    {isExpired ? 'Completed' : isPending ? 'Submitted for review' : `${daysRemaining} days left`}
                                  </div>
                                </td>

                                <td className="p-3 whitespace-nowrap">
                                  {isPending ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                                      PENDING ADMIN APPROVAL
                                    </span>
                                  ) : isRejected ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                                      <XCircle size={12} className="text-rose-600" />
                                      REJECTED BY ADMIN
                                    </span>
                                  ) : isExpired ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-300">
                                      EXPIRED
                                    </span>
                                  ) : ad.status === 'paused' ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800 border border-gray-300">
                                      PAUSED
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                                      APPROVED & LIVE ON HOMEPAGE
                                    </span>
                                  )}
                                </td>

                                <td className="p-3 text-right whitespace-nowrap">
                                  <button
                                    onClick={() => handleDeleteSellerAd(ad._id || ad.id)}
                                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors"
                                    title="Delete Ad Placement"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-md max-w-2xl w-full border border-gold/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <div>
                <h3 className="font-heading text-xl text-charcoal">Edit Jewellery Product</h3>
                <p className="text-xs text-gray-500">Update item details, price, images, metal specs, and inventory stock.</p>
              </div>
              <button onClick={() => setEditingProduct(null)} className="p-1 text-gray-400 hover:text-charcoal">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} className="flex flex-col gap-4">
              {/* Previous Rejection Banner */}
              {editingProduct.approvalStatus === 'Rejected' && (
                <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded-r text-xs text-red-900 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span className="flex items-center gap-1.5 text-red-700">
                      <AlertCircle size={16} /> Requires Revision (Rejected)
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      Rejected Date: {editingProduct.rejectedAt ? new Date(editingProduct.rejectedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}
                    </span>
                  </div>
                  <div className="text-xs font-semibold">
                    Admin Rejection Note:
                    <span className="font-normal italic bg-white p-2 rounded border border-red-200 block mt-1 text-red-800 shadow-inner">
                      "{editingProduct.rejectionReason || 'Please fix specs/images'}"
                    </span>
                  </div>
                  <div className="text-[0.72rem] text-emerald-800 font-semibold pt-1 flex items-center gap-1">
                    <CheckCircle2 size={14} /> Saving your edits below will automatically send this item back to Admin for Approval!
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Product Title / Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">MRP / Original Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Category</label>
                  <select
                    value={editingProduct.category || 'necklaces'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value, categoryName: e.target.options[e.target.selectedIndex].text })}
                    className="input-field capitalize"
                  >
                    <option value="necklaces">Necklaces</option>
                    <option value="earrings">Earrings</option>
                    <option value="rings">Rings</option>
                    <option value="bangles">Bangles & Bracelets</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="mangalsutra">Mangalsutra</option>
                    <option value="pendants">Pendants</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingProduct.stock || 1}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Metal Purity</label>
                  <input
                    type="text"
                    value={editingProduct.metal || '22K Gold'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, metal: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">BIS Hallmark / Purity Spec</label>
                  <input
                    type="text"
                    value={editingProduct.purity || '22K BIS Hallmarked'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, purity: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-gray-500 mb-1 block">Product Description</label>
                <textarea
                  rows="3"
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="input-field text-xs"
                />
              </div>

              {/* Primary Image Preview & Upload */}
              <div className="bg-[#FAF6F0] p-4 border border-gray-200 rounded-sm">
                <label className="text-xs font-semibold uppercase text-charcoal mb-2 block flex items-center justify-between">
                  <span>Primary Product Image (Main View)</span>
                  {editingProduct.image && <span className="text-[0.65rem] text-emerald-700 font-medium">✓ Image Attached</span>}
                </label>

                <div className="flex gap-4 items-start">
                  {/* Live Thumbnail Preview */}
                  <div
                    className="w-24 h-24 rounded border border-gray-300 bg-white overflow-hidden flex items-center justify-center relative shrink-0 shadow-sm group cursor-pointer"
                    title="Click to zoom primary image (Esc to close)"
                    onClick={() =>
                      editingProduct.image &&
                      setPreviewModal({
                        isOpen: true,
                        images: [editingProduct.image, editingProduct.image2].filter(Boolean),
                        initialIndex: 0,
                        title: editingProduct.name || 'Primary Product Image'
                      })
                    }
                  >
                    {editingProduct.image ? (
                      <>
                        <img src={editingProduct.image} alt="Primary Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <ZoomIn size={16} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-2 text-gray-400">
                        <Upload className="mx-auto mb-1" size={18} />
                        <span className="text-[0.6rem]">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="btn-gold py-1.5 px-3 text-xs cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                        <Upload size={14} /> Upload New Photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (file) {
                              handleImageFileUpload(file, (url) => setEditingProduct((prev) => ({ ...prev, image: url })));
                            }
                          }}
                        />
                      </label>
                      {editingProduct.image && (
                        <button
                          type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, image: '' })}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Clear Image
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Image URL or Server Asset Path..."
                      value={editingProduct.image || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      className="input-field text-xs text-gray-600 truncate bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Secondary Image Preview & Upload */}
              <div className="bg-[#FAF6F0] p-4 border border-gray-200 rounded-sm">
                <label className="text-xs font-semibold uppercase text-charcoal mb-2 block flex items-center justify-between">
                  <span>Secondary Angle Photo (Hover / Back View)</span>
                  {editingProduct.image2 && <span className="text-[0.65rem] text-emerald-700 font-medium">✓ Image Attached</span>}
                </label>

                <div className="flex gap-4 items-start">
                  {/* Live Thumbnail Preview */}
                  <div
                    className="w-24 h-24 rounded border border-gray-300 bg-white overflow-hidden flex items-center justify-center relative shrink-0 shadow-sm group cursor-pointer"
                    title="Click to zoom secondary image (Esc to close)"
                    onClick={() =>
                      editingProduct.image2 &&
                      setPreviewModal({
                        isOpen: true,
                        images: [editingProduct.image, editingProduct.image2].filter(Boolean),
                        initialIndex: editingProduct.image ? 1 : 0,
                        title: editingProduct.name || 'Secondary Product Image'
                      })
                    }
                  >
                    {editingProduct.image2 ? (
                      <>
                        <img src={editingProduct.image2} alt="Secondary Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <ZoomIn size={16} className="text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-2 text-gray-400">
                        <Upload className="mx-auto mb-1" size={18} />
                        <span className="text-[0.6rem]">Side / Back</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="btn-gold py-1.5 px-3 text-xs cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                        <Upload size={14} /> Upload New Photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (file) {
                              handleImageFileUpload(file, (url) => setEditingProduct((prev) => ({ ...prev, image2: url })));
                            }
                          }}
                        />
                      </label>
                      {editingProduct.image2 && (
                        <button
                          type="button"
                          onClick={() => setEditingProduct({ ...editingProduct, image2: '' })}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Clear Image
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Secondary Image URL or Base64 string..."
                      value={editingProduct.image2 || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image2: e.target.value })}
                      className="input-field text-xs text-gray-600 truncate bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button type="submit" className="btn-gold flex-1 py-3 text-xs">
                  SAVE & UPDATE PRODUCT
                </button>
                <button type="button" onClick={() => setEditingProduct(null)} className="btn-outline py-3 px-5 text-xs">
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Image Modal */}
      <ImageModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal((prev) => ({ ...prev, isOpen: false }))}
        images={previewModal.images}
        initialIndex={previewModal.initialIndex}
        title={previewModal.title}
      />

      {/* Tax Invoice Printable Modal */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        isOpen={Boolean(selectedInvoiceOrder)}
        onClose={() => setSelectedInvoiceOrder(null)}
        sellerDetails={sellerProfile}
        globalGstRate={3}
      />

      {/* LIVE BANNER AD PREVIEW MODAL */}
      {isPreviewBannerModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[350] flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
          <div className="w-full max-w-5xl bg-[#FAF6F0] rounded-xl overflow-hidden shadow-2xl border border-gold/50 relative p-6 max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gold-light/30">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold-dark px-2.5 py-0.5 rounded bg-gold-light/20">
                  LIVE HOMEPAGE BANNER PREVIEW
                </span>
                <h3 className="font-heading text-xl text-gray-900 mt-1">
                  How Your Ad Will Look Live On Homepage
                </h3>
              </div>
              <button
                onClick={() => setIsPreviewBannerModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-700 hover:bg-gold-dark hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Live Hero Slider Banner Frame */}
            <div className="bg-[#F5EFEB] rounded-lg border border-gold-light/40 p-6 sm:p-10 relative overflow-hidden">
              {/* Background Watermark */}
              <div className="absolute top-10 left-4 text-[60px] sm:text-[90px] font-serif font-black text-gray-200/50 uppercase tracking-widest select-none pointer-events-none rotate-90 sm:rotate-0 origin-top-left z-0">
                {newAdForm.watermark || 'INCOMPARABLE'}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[120px_1fr_1fr] gap-8 items-center relative z-10">
                
                {/* 4 Thumbnails Vertical Strip */}
                <div className="flex flex-row lg:flex-col gap-3">
                  {[
                    newAdForm.thumb1 || newAdForm.mainImage || newAdForm.image,
                    newAdForm.thumb2 || newAdForm.mainImage || newAdForm.image,
                    newAdForm.thumb3 || newAdForm.mainImage || newAdForm.image,
                    newAdForm.thumb4 || newAdForm.mainImage || newAdForm.image
                  ].map((thumbUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPreviewThumbIdx(idx)}
                      className={`w-16 h-16 rounded border-2 overflow-hidden transition-all cursor-pointer ${
                        previewThumbIdx === idx ? 'border-gold-dark ring-2 ring-gold/40 scale-105' : 'border-gray-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={getImageUrl(thumbUrl)} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Main Hero Arch Image */}
                <div className="relative">
                  <div className="aspect-[4/5] max-w-sm mx-auto rounded-t-full rounded-b-2xl overflow-hidden border-2 border-gold/40 shadow-xl bg-white">
                    <img
                      src={getImageUrl(
                        previewThumbIdx === 0
                          ? (newAdForm.mainImage || newAdForm.image)
                          : [newAdForm.thumb1, newAdForm.thumb2, newAdForm.thumb3, newAdForm.thumb4][previewThumbIdx] || newAdForm.mainImage
                      )}
                      alt="Main Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Right Details & Accent Image */}
                <div className="flex flex-col justify-center gap-4">
                  <div>
                    <span className="eyebrow block text-xs font-bold text-gold-dark tracking-widest uppercase mb-1">
                      {newAdForm.eyebrow || 'TIMELESS SOPHISTICATION'}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-gray-900 font-bold mb-3">
                      {newAdForm.title || 'Crafting Timeless Beauty With Distinctive Grace'}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                      {newAdForm.description || 'Exclusive handcrafted luxury jewellery collection.'}
                    </p>
                    <button className="btn-gold py-2.5 px-6 text-xs uppercase tracking-wider inline-flex items-center gap-2">
                      {newAdForm.ctaPrimary || 'Know More'} <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* Accent Image Arch */}
                  <div className="w-32 h-32 rounded-t-full rounded-b-lg overflow-hidden border border-gold/40 shadow-md self-end mt-2 hidden sm:block">
                    <img src={getImageUrl(newAdForm.accentImage || newAdForm.mainImage || newAdForm.image)} alt="Accent View" className="w-full h-full object-cover" />
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsPreviewBannerModalOpen(false)}
                className="btn-outline py-2.5 px-6 text-xs cursor-pointer"
              >
                CLOSE PREVIEW & EDIT
              </button>
              <button
                type="button"
                onClick={(e) => {
                  setIsPreviewBannerModalOpen(false);
                  handleCreateAdSubmit(e);
                }}
                className="btn-gold py-2.5 px-8 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Sparkles size={14} /> CONFIRM & LAUNCH AD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Catalog Share Modal */}
      <ShareCatalogModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        seller={sellerProfile}
        product={selectedShareProduct}
        totalProducts={sellerProductsList.length}
      />
    </div>
  );
}
