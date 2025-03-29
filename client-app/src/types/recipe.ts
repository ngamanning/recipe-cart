export interface Ingredient {
    id: string;
    name: string;
    quantity: string;
    unit: string;
  }
  
  export interface Recipe {
    name: string;
    ingredients: Ingredient[];
    description: string;
  }
  
  export interface NewIngredientInput {
    name: string;
    quantity: string;
    unit: string;
  }