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
    'Accept': 'application/json'
  },
  withCredentials: true, // Enable credentials
  timeout: 10000, // 10 second timeout
  validateStatus: status => status < 500 // Only reject if status is 500 or greater
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

// Retry logic for failed requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const retryRequest = async (error: any, retryCount: number = 0): Promise<any> => {
  const shouldRetry = retryCount < MAX_RETRIES && 
    (error.code === 'ECONNABORTED' || 
     error.response?.status === 502 || 
     error.response?.status === 503 ||
     error.response?.status === 504);

  if (shouldRetry) {
    console.log(`Retrying request (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
    const config = error.config;
    // Clear any existing Authorization header to prevent duplicate tokens
    if (config.headers) {
      delete config.headers.Authorization;
    }
    return api(config);
  }
  return Promise.reject(error);
};

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
      Object.keys(config.data).forEach(key => {
        if (config.data[key] instanceof Date) {
          config.data[key] = config.data[key].toISOString();
        }
      });
    }

    // Clean up undefined values from params
    if (config.params) {
      Object.keys(config.params).forEach(key => {
        if (config.params[key] === undefined) {
          delete config.params[key];
        }
      });
    }
    
    console.log('Making request:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method?.toUpperCase(),
      headers: config.headers,
      params: config.params,
      data: config.data
    });
    
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
    console.log('Response received:', {
      url: `${response.config.baseURL}${response.config.url}`,
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    return response;
  },
  async (error) => {
    // Try to retry the request if applicable
    if (error.config && !error.config.__isRetry) {
      error.config.__isRetry = true;
      try {
        return await retryRequest(error);
      } catch (retryError) {
        error = retryError;
      }
    }

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

    console.error('API Error:', errorInfo);

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
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