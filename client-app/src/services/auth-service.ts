import axios, { AxiosResponse } from 'axios';
import config from '../config';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: number;
  username: string;
  email: string;
  token: string;
}

// Create an axios instance with default config
const authApi = axios.create({
  baseURL: config.apiBaseUrl + '/auth',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth API methods
export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await authApi.post('/login', credentials);
    const userData = response.data;
    saveUserToLocalStorage(userData);
    setAuthHeader(userData.token);
    return userData;
  },

  // Register new user
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await authApi.post('/register', userData);
    const authData = response.data;
    saveUserToLocalStorage(authData);
    setAuthHeader(authData.token);
    return authData;
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    removeAuthHeader();
  },

  // Check if user is logged in
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Get current user from local storage
  getCurrentUser: (): AuthResponse | null => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  },

  // Get auth token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  }
};

// Helper functions
const saveUserToLocalStorage = (user: AuthResponse): void => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', user.token);
};

const setAuthHeader = (token: string): void => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const removeAuthHeader = (): void => {
  delete axios.defaults.headers.common['Authorization'];
};

// Add a global response interceptor for error handling
authApi.interceptors.response.use(
  response => response,
  error => {
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

// Initialize auth header from localStorage on app start
const token = localStorage.getItem('token');
if (token) {
  setAuthHeader(token);
}

export default authService;