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
  withCredentials: true // Enable credentials
});

// Add request interceptor to attach token and handle dates
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Convert dates to ISO strings for consistency
    if (config.data) {
      if (config.data.startTime instanceof Date) {
        config.data.startTime = config.data.startTime.toISOString();
      }
      if (config.data.endTime instanceof Date) {
        config.data.endTime = config.data.endTime.toISOString();
      }
    }
    
    // Safe access to URL components with fallbacks
    const baseURL = config.baseURL || '';
    const url = config.url || '';
    console.log('Making request to:', baseURL + url, 'with data:', config.data);
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
      config: response.config
    });
    return response;
  },
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