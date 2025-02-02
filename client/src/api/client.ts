import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface ApiError {
  message: string;
  code?: string;
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorResponse: ApiError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      code: error.response?.data?.code
    };
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(errorResponse);
  }
);

export default api; 