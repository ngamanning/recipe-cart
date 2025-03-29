// Types for recipe-related data structures

export interface CreateRecipeDTO {
    name: string;
    description?: string;
    prepTime?: number | null;
    cookTime?: number | null;
    servings?: number | null;
    instructions?: string;
    imageUrl?: string;
    userId?: number;
    ingredients: CreateRecipeIngredientDTO[];
    categoryIds: number[];
  }
  
  export interface CreateRecipeIngredientDTO {
    name: string;
    quantity: number;
    unit?: string;
    notes?: string;
    category?: string;
  }
  
  export interface Recipe {
    recipeId: number;
    name: string;
    description?: string;
    prepTime?: number;
    cookTime?: number;
    servings?: number;
    instructions?: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
    userId?: number;
    ingredients: Ingredient[];
    categories: Category[];
  }
  
  export interface Ingredient {
    ingredientId: number;
    name: string;
    category?: string;
    quantity: number;
    unit?: string;
    notes?: string;
  }
  
  export interface Category {
    categoryId: number;
    name: string;
  }
  
  export interface MealPlan {
    mealPlanId: number;
    name: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    items: MealPlanItem[];
  }
  
  export interface MealPlanItem {
    mealPlanItemId: number;
    mealPlanId: number;
    recipeId: number;
    recipe: Recipe;
    plannedDate: string; // ISO format date
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    servings: number;
  }
  
  export interface ShoppingList {
    shoppingListId: number;
    userId: number;
    mealPlanId?: number;
    name: string;
    generatedDate: string;
    items: ShoppingListItem[];
  }
  
  export interface ShoppingListItem {
    shoppingListItemId: number;
    shoppingListId: number;
    ingredientId: number;
    ingredient: Ingredient;
    unitId?: number;
    quantity: number;
    isChecked: boolean;
  }