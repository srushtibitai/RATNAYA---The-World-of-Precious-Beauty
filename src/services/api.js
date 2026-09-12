// RATNAYA — Frontend REST API Service Integration

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ratnaya-backend.onrender.com/api';
// const API_BASE_URL = 'http://localhost:5050/api';

export function getImageUrl(imagePath) {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  const backendBase = API_BASE_URL.replace(/\/api\/?$/, '');
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${backendBase}${cleanPath}`;
}

// Helper for HTTP requests with JSON response handling & JWT Token Header
async function request(endpoint, options = {}) {
  try {
    let token = localStorage.getItem('ratnaya_token');
    if (!token) {
      const storedUser = localStorage.getItem('ratnaya_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed && parsed.token) token = parsed.token;
        } catch (e) { }
      }
    }

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`API call to ${endpoint} failed, using local memory fallback.`, error);
    return { success: false, error: error.message };
  }
}


export const api = {
  // Auth (Buyer, Seller, Admin)
  async login(credentials) {
    return request('/auth/login', {
      method: 'POST',
      body: credentials
    });
  },

  async signup(userData) {
    return request('/auth/signup', {
      method: 'POST',
      body: userData
    });
  },

  // Payment (Razorpay)
  async getRazorpayKey() {
    return request('/payment/key');
  },

  async createRazorpayOrder(amount, receipt) {
    return request('/payment/create-order', {
      method: 'POST',
      body: { amount, receipt }
    });
  },

  async verifyRazorpayPayment(paymentData) {
    return request('/payment/verify-signature', {
      method: 'POST',
      body: paymentData
    });
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/products?${query}` : '/products';
    return request(endpoint);
  },

  async getPendingProducts() {
    return request('/admin/products/pending');
  },

  async getProductById(id) {
    return request(`/products/${id}`);
  },

  async createProduct(productData) {
    return request('/products', {
      method: 'POST',
      body: productData
    });
  },

  async updateProduct(id, productData) {
    return request(`/products/${id}`, {
      method: 'PUT',
      body: productData
    });
  },

  async approveProduct(id) {
    return request(`/admin/products/${id}/approve`, {
      method: 'PUT'
    });
  },

  async rejectProduct(id, reason) {
    return request(`/products/${id}/reject`, {
      method: 'PUT',
      body: { reason }
    });
  },

  async uploadImage(file, category = 'general', sellerName = '', docType = '') {
    try {
      const formData = new FormData();
      if (category) formData.append('category', category);
      if (sellerName) formData.append('sellerName', sellerName);
      if (docType) formData.append('docType', docType);
      formData.append('image', file);

      const query = new URLSearchParams();
      if (category) query.append('category', category);
      if (sellerName) query.append('sellerName', sellerName);
      if (docType) query.append('docType', docType);

      const response = await fetch(`${API_BASE_URL}/upload?${query.toString()}`, {
        method: 'POST',
        headers: {
          'x-category': category,
          'x-seller-name': sellerName,
          'x-doc-type': docType
        },
        body: formData
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API image upload failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Sellers
  async getSellers() {
    return request('/sellers');
  },

  async getSellerById(id) {
    return request(`/sellers/${id}`);
  },

  async registerSeller(sellerData) {
    return request('/sellers/register', {
      method: 'POST',
      body: sellerData
    });
  },

  async updateSellerProfile(id, profileData) {
    return request(`/sellers/${id}/profile`, {
      method: 'PUT',
      body: profileData
    });
  },

  // Orders
  async getOrders() {
    return request('/orders');
  },

  async createOrder(orderData) {
    return request('/orders', {
      method: 'POST',
      body: orderData
    });
  },

  async updateOrderStatus(id, status) {
    return request(`/orders/${id}/status`, {
      method: 'PUT',
      body: { status }
    });
  },

  async requestOrderReturn(id, returnData) {
    return request(`/orders/${id}/return`, {
      method: 'POST',
      body: returnData
    });
  },

  async cancelOrder(id, reason) {
    return request(`/orders/${id}/cancel`, {
      method: 'PUT',
      body: { reason }
    });
  },

  async processOrderRefund(id, refundData) {
    return request(`/orders/${id}/refund`, {
      method: 'PUT',
      body: refundData || {}
    });
  },

  async deleteOrder(id) {
    return request(`/orders/${id}`, {
      method: 'DELETE'
    });
  },

  // Admin Governance
  async getPendingSellers() {
    return request('/admin/sellers/pending');
  },

  async approveSeller(id) {
    return request(`/admin/sellers/${id}/approve`, {
      method: 'PUT'
    });
  },

  async rejectSeller(id, reason) {
    return request(`/admin/sellers/${id}/reject`, {
      method: 'PUT',
      body: { reason }
    });
  },

  async getCommission() {
    return request('/admin/commission');
  },

  async updateCommission(commission) {
    return request('/admin/commission', {
      method: 'PUT',
      body: { commission }
    });
  },

  async getGstRate() {
    return request('/admin/gst');
  },

  async updateGstRate(gstRate) {
    return request('/admin/gst', {
      method: 'PUT',
      body: { gstRate }
    });
  },

  // Categories
  async getCategories() {
    return request('/categories');
  },

  async addCategory(categoryData) {
    return request('/categories', {
      method: 'POST',
      body: categoryData
    });
  },

  // Masters API (SizeMaster, SpecificationMaster, ImageMaster, PaymentMethod)
  async getMastersCategories() {
    return request('/masters/categories');
  },

  async getMastersSizes(category) {
    const endpoint = category ? `/masters/sizes?category=${encodeURIComponent(category)}` : '/masters/sizes';
    return request(endpoint);
  },

  async addMasterSize(sizeData) {
    return request('/masters/sizes', {
      method: 'POST',
      body: sizeData
    });
  },

  async getMastersSpecifications() {
    return request('/masters/specifications');
  },

  async addMasterSpecification(specData) {
    return request('/masters/specifications', {
      method: 'POST',
      body: specData
    });
  },

  async getMastersImages(category) {
    const endpoint = category ? `/masters/images?category=${encodeURIComponent(category)}` : '/masters/images';
    return request(endpoint);
  },

  async addMasterImage(imageData) {
    return request('/masters/images', {
      method: 'POST',
      body: imageData
    });
  },

  // Blogs (MongoDB API)
  async getBlogs(category) {
    const url = category && category !== 'All'
      ? `/blogs?category=${encodeURIComponent(category)}`
      : '/blogs';
    return request(url);
  },

  async getBlogById(id) {
    return request(`/blogs/${id}`);
  },

  async createBlog(blogData) {
    return request('/blogs', {
      method: 'POST',
      body: blogData
    });
  },

  async updateBlog(id, blogData) {
    return request(`/blogs/${id}`, {
      method: 'PUT',
      body: blogData
    });
  },

  async deleteBlog(id) {
    return request(`/blogs/${id}`, {
      method: 'DELETE'
    });
  },

  // Scoped Products & Orders API
  async getSellerProducts() {
    return request('/products/seller/my-products');
  },

  async getBuyerOrders() {
    return request('/orders/buyer/my-orders');
  },

  async getSellerOrders() {
    return request('/orders/seller/my-orders');
  },

  // Cart API (MongoDB)
  async getCart(userId) {
    return request(`/cart/${userId}`);
  },

  async syncCart(userId, items) {
    return request(`/cart/${userId}`, {
      method: 'POST',
      body: { items }
    });
  },

  async removeFromCart(userId, productId) {
    return request(`/cart/${userId}/item/${productId}`, {
      method: 'DELETE'
    });
  },

  async clearCart(userId) {
    return request(`/cart/${userId}`, {
      method: 'DELETE'
    });
  },

  // Wishlist API (MongoDB)
  async getWishlist(userId) {
    return request(`/wishlist/${userId}`);
  },

  async syncWishlist(userId, items) {
    return request(`/wishlist/${userId}`, {
      method: 'POST',
      body: { items }
    });
  },

  async removeFromWishlist(userId, productId) {
    return request(`/wishlist/${userId}/item/${productId}`, {
      method: 'DELETE'
    });
  },

  async clearWishlist(userId) {
    return request(`/wishlist/${userId}`, {
      method: 'DELETE'
    });
  },

  // Banners API (MongoDB)
  async getBanners() {
    return request('/banners');
  },

  async addBanner(bannerData) {
    return request('/banners', {
      method: 'POST',
      body: bannerData
    });
  },

  async updateBanner(id, bannerData) {
    return request(`/banners/${id}`, {
      method: 'PUT',
      body: bannerData
    });
  },

  async deleteBanner(id) {
    return request(`/banners/${id}`, {
      method: 'DELETE'
    });
  },

  // Profile, Addresses & Payment Methods API (MongoDB)
  async getProfile(userId) {
    return request(`/profile/${userId}`);
  },

  async updateProfile(userId, profileData) {
    return request(`/profile/${userId}`, {
      method: 'PUT',
      body: profileData
    });
  },

  async addAddress(userId, addressData) {
    return request(`/profile/${userId}/addresses`, {
      method: 'POST',
      body: addressData
    });
  },

  async deleteAddress(userId, addressId) {
    return request(`/profile/${userId}/addresses/${addressId}`, {
      method: 'DELETE'
    });
  },

  async addPaymentMethod(userId, paymentData) {
    return request(`/profile/${userId}/payments`, {
      method: 'POST',
      body: paymentData
    });
  },

  async deletePaymentMethod(userId, paymentId) {
    return request(`/profile/${userId}/payments/${paymentId}`, {
      method: 'DELETE'
    });
  },

  // Shiprocket Delivery Partner Integration
  async checkShippingServiceability(deliveryPostcode, weight = 0.5) {
    return request('/shipping/check-serviceability', {
      method: 'POST',
      body: { deliveryPostcode, weight }
    });
  },

  async createShippingOrder(orderData) {
    return request('/shipping/create-order', {
      method: 'POST',
      body: orderData
    });
  },

  async trackShipment(awb) {
    return request(`/shipping/track/${awb}`);
  },

  async verifySellerDocument(documentType, documentNumber) {
    return request('/sellers/verify-document', {
      method: 'POST',
      body: { documentType, documentNumber }
    });
  },

  getImageUrl
};

export function openDocument(docPath) {
  if (!docPath) return;
  if (docPath.startsWith('data:')) {
    try {
      const parts = docPath.split(',');
      const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/pdf';
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      return;
    } catch (e) {
      console.error('Error decoding base64 blob:', e);
    }
  }
  window.open(getImageUrl(docPath), '_blank');
}

export function formatDocName(docPath, fallbackName) {
  if (!docPath || docPath.startsWith('data:')) return fallbackName;
  const fileName = docPath.split('/').pop();
  return fileName || fallbackName;
}

export function formatDocSize(sizeInBytesOrStr, defaultSize = '1.2 MB') {
  if (!sizeInBytesOrStr) return defaultSize;
  if (typeof sizeInBytesOrStr === 'number') {
    if (sizeInBytesOrStr > 1024 * 1024) {
      return (sizeInBytesOrStr / (1024 * 1024)).toFixed(2) + ' MB';
    }
    return (sizeInBytesOrStr / 1024).toFixed(0) + ' KB';
  }
  return String(sizeInBytesOrStr);
}



