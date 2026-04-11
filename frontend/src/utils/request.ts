import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';
const TOKEN_KEY = 'mobius_token';

// Utility to convert snake_case to camelCase
const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

// Recursively convert object keys from snake_case to camelCase
const convertToCamelCase = <T>(obj: any): T => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => convertToCamelCase(item)) as T;
  }
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      result[toCamelCase(key)] = convertToCamelCase(obj[key]);
    }
    return result as T;
  }
  return obj;
};

const request: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add Bearer token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 redirect and transform snake_case to camelCase
request.interceptors.response.use(
  (response) => {
    console.log('[DEBUG] Response interceptor (success):', response.config.url);
    // Transform response data from snake_case to camelCase
    if (response.data) {
      response.data = convertToCamelCase(response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    console.log('[DEBUG] Response interceptor (error):', error.config?.url, error.response?.status);
    if (error.response?.status === 401) {
      console.log('[DEBUG] 401 error detected, removing token and redirecting');
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { request, TOKEN_KEY, API_BASE_URL };
