import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Recipe, Ingredient } from '../../types/recipe';

interface RecipeFormProps {
  onSave: (recipe: Recipe) => void;
  onCancel: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ onSave, onCancel }) => {
  const [recipe, setRecipe] = useState<Recipe>({
    name: '',
    ingredients: [],
    description: ''
  });

  const [newIngredient, setNewIngredient] = useState<Omit<Ingredient, 'id'>>({
    name: '',
    quantity: '',
    unit: ''
  });

  const handleRecipeNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      name: e.target.value
    }));
  }, []);

  const handleRecipeDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      description: e.target.value
    }));
  }, []);

  const handleIngredientChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIngredient(prevIngredient => ({
      ...prevIngredient,
      [name]: value
    }));
  }, []);

  const addIngredient = useCallback(() => {
    if (newIngredient.name.trim() === '') return;

    setRecipe(prevRecipe => ({
      ...prevRecipe,
      ingredients: [
        ...prevRecipe.ingredients,
        {
          id: Date.now().toString(),
          ...newIngredient
        }
      ]
    }));

    // Reset the new ingredient form
    setNewIngredient({
      name: '',
      quantity: '',
      unit: ''
    });
  }, [newIngredient]);

  const removeIngredient = useCallback((id: string) => {
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      ingredients: prevRecipe.ingredients.filter(ingredient => ingredient.id !== id)
    }));
  }, []);

  const handleSaveRecipe = useCallback(() => {
    if (recipe.name.trim() === '' || recipe.ingredients.length === 0) {
      alert('Please add a recipe name and at least one ingredient');
      return;
    }

    onSave(recipe);
  }, [recipe, onSave]);

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          aria-label="back" 
          onClick={handleCancel} 
          sx={{ mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">
          Create New Recipe
        </Typography>
      </Box>

      <TextField
        label="Recipe Name"
        variant="outlined"
        fullWidth
        value={recipe.name}
        onChange={handleRecipeNameChange}
        margin="normal"
      />

      <TextField
        label="Recipe Description (Optional)"
        variant="outlined"
        fullWidth
        multiline
        rows={2}
        value={recipe.description}
        onChange={handleRecipeDescriptionChange}
        margin="normal"
      />

      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Add Ingredients
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{
            xs:12,
            sm: 5
        }}>
          <TextField
            label="Ingredient Name"
            name="name"
            variant="outlined"
            fullWidth
            value={newIngredient.name}
            onChange={handleIngredientChange}
          />
        </Grid>
        <Grid size={{
            xs:6,
            sm: 2
        }}>
          <TextField
            label="Quantity"
            name="quantity"
            variant="outlined"
            fullWidth
            value={newIngredient.quantity}
            onChange={handleIngredientChange}
          />
        </Grid>
        <Grid size={{
            xs:6,
            sm: 3
        }}>
          <TextField
            label="Unit"
            name="unit"
            variant="outlined"
            fullWidth
            value={newIngredient.unit}
            onChange={handleIngredientChange}
          />
        </Grid>
        <Grid size={{
            xs:12,
            sm: 2
        }}>
          <Button
            variant="contained"
            color="primary"
            onClick={addIngredient}
            startIcon={<AddCircleIcon />}
            fullWidth
            sx={{ height: '100%' }}
          >
            Add
          </Button>
        </Grid>
      </Grid>

      {recipe.ingredients.length > 0 && (
        <Card variant="outlined" sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Ingredients:
            </Typography>
            <List>
              {recipe.ingredients.map((ingredient) => (
                <ListItem
                  key={ingredient.id}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => removeIngredient(ingredient.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={ingredient.name}
                    secondary={ingredient.quantity && ingredient.unit 
                      ? `${ingredient.quantity} ${ingredient.unit}`
                      : ingredient.quantity || ingredient.unit || ''
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<SaveIcon />}
          onClick={handleSaveRecipe}
          disabled={recipe.name.trim() === '' || recipe.ingredients.length === 0}
        >
          Save Recipe
        </Button>
      </Box>
    </Paper>
  );
};

export default RecipeForm;