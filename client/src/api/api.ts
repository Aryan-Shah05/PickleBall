import axios, { InternalAxiosRequestConfig } from 'axios';

if (!import.meta.env.VITE_API_URL) {
  throw new Error('VITE_API_URL environment variable is not set');
}

const apiUrl = import.meta.env.VITE_API_URL.replace(/\/$/, ''); // Remove trailing slash if present
console.log('API URL:', apiUrl); // Debug log

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

// Add request interceptor to attach token and log requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Safe access to URL components with fallbacks
    const baseURL = config.baseURL || '';
    const url = config.url || '';
    console.log('Making request to:', baseURL + url);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    return Promise.reject(error);
  }
);

export default api; 