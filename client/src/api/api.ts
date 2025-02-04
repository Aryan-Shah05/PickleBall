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

interface ErrorInfo {
  url?: string;
  method?: string;
  status?: number;
  statusText?: string;
  data?: any;
  message?: string;
  [key: string]: any;
}

// Add request interceptor to attach token and handle dates
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    // Ensure headers exist
    config.headers = config.headers || {};
    
    // Add auth token if available
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

    // Clean up undefined values from params
    if (config.params) {
      Object.keys(config.params).forEach(key => {
        if (config.params[key] === undefined) {
          delete config.params[key];
        }
      });
    }
    
    // Log request details without undefined values
    const requestInfo = {
      url: `${config.baseURL}${config.url}`,
      method: config.method?.toUpperCase(),
      headers: config.headers,
      ...(config.params && { params: config.params }),
      ...(config.data && { data: config.data })
    };
    
    console.log('Making request:', JSON.stringify(requestInfo, null, 2));
    
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
    // Log successful response without undefined values
    const responseInfo = {
      url: `${response.config.baseURL}${response.config.url}`,
      status: response.status,
      statusText: response.statusText,
      data: response.data
    };
    
    console.log('Response received:', JSON.stringify(responseInfo, null, 2));
    return response;
  },
  (error) => {
    // Log error details without undefined values
    const errorInfo: ErrorInfo = {
      url: error.config?.url ? `${error.config.baseURL}${error.config.url}` : undefined,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    };

    // Remove undefined properties
    Object.keys(errorInfo).forEach(key => {
      if (errorInfo[key] === undefined) {
        delete errorInfo[key];
      }
    });

    console.error('API Error:', JSON.stringify(errorInfo, null, 2));

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