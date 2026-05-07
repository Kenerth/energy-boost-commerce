"""
Servicio de API para conectar frontend con backend Flask
Energy Boost Commerce - Frontend Service
"""

const API_URL = 'http://localhost:5000/api';


class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  // Headers base
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // Guardar token
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Remover token
  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // ================== AUTH ==================

  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      this.setToken(data.access_token);
    }
    return { ok: response.ok, data };
  }

  async register(email, password, nombre) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nombre }),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  }

  async getMe() {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: this.getHeaders(),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  }

  async logout() {
    this.removeToken();
  }

  // ================== PRODUCTOS ==================

  async getProductos(filtros = {}) {
    const params = new URLSearchParams(filtros).toString();
    const response = await fetch(`${API_URL}/productos?${params}`);
    const data = await response.json();
    return { ok: response.ok, data };
  }

  async getProducto(id) {
    const response = await fetch(`${API_URL}/productos/${id}`);
    const data = await response.json();
    return { ok: response.ok, data };
  }

  async getCategorias() {
    const response = await fetch(`${API_URL}/categorias`);
    const data = await response.json();
    return { ok: response.ok, data };
  }

  async getLowStock() {
    const response = await fetch(`${API_URL}/productos/low-stock`, {
      headers: this.getHeaders(),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  }

  // ================== CARRITO ==================

  async getCart() {
    const response = await fetch(`${API_URL}/cart`, {
      headers: this.getHeaders(),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  }

  async addToCart(productoId, cantidad = 1) {
    const response = await fetch(`${API_URL}/cart/items`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ producto_id: productoId, cantidad }),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  }

  async updateCartItem(itemId, cantidad) {
    const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ cantidad }),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  }

  async removeFromCart(itemId) {
    const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  }

  async checkout() {
    const response = await fetch(`${API_URL}/cart/checkout`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  }

  // ================== PEDIDOS ==================

  async getOrders() {
    const response = await fetch(`${API_URL}/orders`, {
      headers: this.getHeaders(),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  }

  async getOrder(id) {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: this.getHeaders(),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  }

  async getAllOrders() {
    const response = await fetch(`${API_URL}/orders/all`, {
      headers: this.getHeaders(),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  }

  async updateOrderStatus(pedidoId, estado) {
    const response = await fetch(`${API_URL}/orders/${pedidoId}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ estado }),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  }

  // ================== REPORTES ==================

  async getDashboard() {
    const response = await fetch(`${API_URL}/reports/dashboard`, {
      headers: this.getHeaders(),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  }

  async getVentas(periodo = 'mes') {
    const response = await fetch(`${API_URL}/reports/ventas?periodo=${periodo}`, {
      headers: this.getHeaders(),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  }

  async getProductosVendidos() {
    const response = await fetch(`${API_URL}/reports/productos-mas-vendidos`, {
      headers: this.getHeaders(),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  }

  async getClientesFrecuentes() {
    const response = await fetch(`${API_URL}/reports/clientes-frecuentes`, {
      headers: this.getHeaders(),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  }

  async getReporteInventario() {
    const response = await fetch(`${API_URL}/reports/inventario`, {
      headers: this.getHeaders(),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  }
}

// Exportar instancia única
export const api = new ApiService();
export default api;