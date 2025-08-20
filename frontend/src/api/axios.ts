import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { store } from '../store';
import { logout, refreshToken } from '../store/slices/authSlice';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const state = store.getState();
        const refreshTokenValue = state.auth?.refreshToken;
        
        if (refreshTokenValue) {
          await store.dispatch(refreshToken()).unwrap();
          const newToken = store.getState().auth?.token;
          
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } else {
          store.dispatch(logout());
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Handle other errors
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.message || 
                          error.response.data?.detail || 
                          'An error occurred';
      
      // You can show a toast notification here
      console.error('API Error:', errorMessage);
    } else if (error.request) {
      // Request was made but no response
      console.error('Network Error: No response from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;

// Helper functions for common HTTP methods
export const apiClient = {
  get: <T = any>(url: string, config?: any): Promise<AxiosResponse<T>> => 
    axiosInstance.get(url, config),
    
  post: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => 
    axiosInstance.post(url, data, config),
    
  put: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => 
    axiosInstance.put(url, data, config),
    
  patch: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => 
    axiosInstance.patch(url, data, config),
    
  delete: <T = any>(url: string, config?: any): Promise<AxiosResponse<T>> => 
    axiosInstance.delete(url, config),
};
