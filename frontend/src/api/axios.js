import axios from 'axios';

/**
 * Axios instance pre-configured for the MERN Chat API.
 *
 * - baseURL: uses the Vite proxy in dev (/api → localhost:5000/api)
 *            and VITE_API_BASE_URL in production.
 * - withCredentials: true — sends HTTP-only auth cookie on every request.
 * - 10s timeout to avoid hanging requests.
 *
 * The response interceptor handles 401s globally (e.g. expired cookie)
 * by redirecting to the login page.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Response Interceptor ────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // If the auth cookie expired or is invalid, redirect to login
    if (status === 401) {
      // Avoid redirect loop when already on the auth pages
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
