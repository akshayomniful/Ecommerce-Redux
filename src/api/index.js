import axios from "axios";

// Base API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_WS_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for auth
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: (credentials) => apiClient.post("/auth/login", credentials),
    logout: () => apiClient.post("/auth/logout"),
    getTenants: () => apiClient.get("/auth/tenants"),
  },

  // Inventory endpoints
  inventory: {
    getAll: (tenantId) => apiClient.get(`/inventory?tenantId=${tenantId}`),
    getById: (tenantId, productId) =>
      apiClient.get(`/inventory/${productId}?tenantId=${tenantId}`),
    update: (tenantId, productId, changes) =>
      apiClient.patch(`/inventory/${productId}?tenantId=${tenantId}`, changes),
    bulkUpdate: (tenantId, updates) =>
      apiClient.post(`/inventory/bulk?tenantId=${tenantId}`, { updates }),
  },

  // Products endpoints
  products: {
    getAll: (tenantId, params = {}) =>
      apiClient.get(`/products?tenantId=${tenantId}`, { params }),
    getById: (tenantId, productId) =>
      apiClient.get(`/products/${productId}?tenantId=${tenantId}`),
    create: (tenantId, product) =>
      apiClient.post(`/products?tenantId=${tenantId}`, product),
    update: (tenantId, productId, changes) =>
      apiClient.patch(`/products/${productId}?tenantId=${tenantId}`, changes),
    delete: (tenantId, productId) =>
      apiClient.delete(`/products/${productId}?tenantId=${tenantId}`),
  },

  // Audit log endpoints
  audit: {
    getLogs: (tenantId, params = {}) =>
      apiClient.get(`/audit?tenantId=${tenantId}`, { params }),
    recordEntry: (tenantId, entry) =>
      apiClient.post(`/audit?tenantId=${tenantId}`, entry),
  },
};

export default api;
