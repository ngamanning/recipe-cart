import axios from 'axios';
import { 
  Recipe, 
  CreateRecipeDTO 
} from '../../types/recipe';
import authService from '../auth-service';
import config from '../../config';

// Create an axios instance with default config
const api = axios.create({
  baseURL: config.apiBaseUrl + '/ingredients',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add authorization header with JWT token
api.interceptors.request.use(
  config => {
    const token = authService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for global error handling
api.interceptors.response.use(
  response => response.data,
  error => {
    // Handle expired token or unauthorized access
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      authService.logout();
      window.location.href = '/login';
      return Promise.reject(new Error('Your session has expired. Please login again.'));
    }
    
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

// Recipe API methods
export const recipeServiceApi = {
  // Get all recipes
  getAll: async (): Promise<Recipe[]> => {
    return api.get('/recipes');
  },

  // Get recipe by ID
  getById: async (id: number): Promise<Recipe> => {
    return api.get(`/recipes/${id}`);
  },

  // Create a new recipe
  create: async (recipe: CreateRecipeDTO): Promise<Recipe> => {
    return api.post('/recipes', recipe);
  },

  // Update an existing recipe
  update: async (id: number, recipe: Partial<CreateRecipeDTO>): Promise<Recipe> => {
    return api.put(`/recipes/${id}`, recipe);
  },

  // Delete a recipe
  delete: async (id: number): Promise<void> => {
    return api.delete(`/recipes/${id}`);
  }
};
 

