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
    
    // Log request details
    console.log('Making request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      params: config.params,
      headers: config.headers
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No auth token found in localStorage');
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
    // Log successful response
    console.log('Response received:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Log error details
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page and not a login request
      if (!window.location.pathname.includes('/login') && !error.config?.url?.includes('/auth/login')) {
        console.log('Redirecting to login due to unauthorized access');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Add a method to check if the user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export default api; 