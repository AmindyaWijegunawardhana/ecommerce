import axios from 'axios';

// Get API URL from environment variable or use relative path for dev
const API_URL = typeof __API_URL__ !== 'undefined' ? __API_URL__ : '/api';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add token to requests if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
