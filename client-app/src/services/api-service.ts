import axios from 'axios';
import { 
  Recipe, 
  CreateRecipeDTO, 
  Category, 
  MealPlan, 
  ShoppingList 
} from '../types/recipe';
import authService from './auth-service';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5207/api',
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
export const recipeApi = {
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

// Category API methods
export const categoryApi = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    return api.get('/categories');
  },

  // Create a new category
  create: async (name: string): Promise<Category> => {
    return api.post('/categories', { name });
  }
};

// Meal plan API methods
export const mealPlanApi = {
  // Get all meal plans
  getAll: async (): Promise<MealPlan[]> => {
    return api.get('/mealplans');
  },

  // Get meal plan by ID
  getById: async (id: number): Promise<MealPlan> => {
    return api.get(`/mealplans/${id}`);
  },

  // Create a new meal plan
  create: async (mealPlan: any): Promise<MealPlan> => {
    return api.post('/mealplans', mealPlan);
  },

  // Add recipe to meal plan
  addRecipe: async (mealPlanId: number, recipeId: number, data: any): Promise<any> => {
    return api.post(`/mealplans/${mealPlanId}/recipes/${recipeId}`, data);
  }
};

// Shopping list API methods
export const shoppingListApi = {
  // Generate shopping list from meal plan
  generateFromMealPlan: async (mealPlanId: number, name: string): Promise<ShoppingList> => {
    return api.post('/shoppinglists/generate', { mealPlanId, name });
  },

  // Get shopping list by ID
  getById: async (id: number): Promise<ShoppingList> => {
    return api.get(`/shoppinglists/${id}`);
  },

  // Update shopping list item status
  updateItem: async (listId: number, itemId: number, isChecked: boolean): Promise<void> => {
    return api.patch(`/shoppinglists/${listId}/items/${itemId}`, { isChecked });
  }
};