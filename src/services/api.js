// RATNAYA — Frontend REST API Service Integration

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ratnaya-backend.onrender.com/api';

// Helper for HTTP requests with JSON response handling
async function request(endpoint, options = {}) {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
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

  async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
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

  // Admin Governance
  async getPendingSellers() {
    return request('/admin/sellers/pending');
  },

  async approveSeller(id) {
    return request(`/admin/sellers/${id}/approve`, {
      method: 'PUT'
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

  // Categories
  async getCategories() {
    return request('/categories');
  },

  // Blogs (MongoDB API)
  async getBlogs(category) {
    const url = category && category !== 'All' 
      ? `/blogs?category=${encodeURIComponent(category)}`
      : '/blogs';
    return request(url);
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
  }
};
