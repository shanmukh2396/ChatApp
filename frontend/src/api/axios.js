import axios from 'axios';

/**
 * Determine baseURL:
 * - Reads VITE_API_URL or VITE_API_BASE_URL
 * - In production: defaults to the deployed Render backend API ('https://chatapp-813y.onrender.com/api')
 * - In development: defaults to '/api' (proxied via Vite)
 */
const rawBaseURL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? 'https://chatapp-813y.onrender.com/api' : '/api');

// Strip any trailing slashes
const normalizedBaseURL = rawBaseURL.replace(/\/+$/, '');

const api = axios.create({
  baseURL: normalizedBaseURL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Attach JWT token from localStorage if available (supports cross-domain deployments)
    const token = localStorage.getItem('chat_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // If unauthorized / token expired, clear local storage and redirect to login
    if (status === 401) {
      localStorage.removeItem('chat_token');
      localStorage.removeItem('chat_user');

      const isAuthPage =
        window.location.pathname === '/login' ||
        window.location.pathname === '/register';

      if (!isAuthPage) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
