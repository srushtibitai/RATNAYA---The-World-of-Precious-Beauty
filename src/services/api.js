// RATNAYA — Frontend REST API Service Integration

const API_BASE_URL = 'http://localhost:5050/api';

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
  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/products?${query}` : '/products';
    return request(endpoint);
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

  async getPendingProducts() {
    return request('/admin/products/pending');
  },

  async approveProduct(id) {
    return request(`/admin/products/${id}/approve`, {
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
  }
};
