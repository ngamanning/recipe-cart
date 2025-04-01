import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Chip,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CreateRecipeDTO, CreateRecipeIngredientDTO, Category } from '../../types/recipe';
import { categoryApi, recipeApi } from '../../services/api-service';
import { useAuth } from '../../contexts/AuthContext';

const RecipeForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [recipe, setRecipe] = useState<CreateRecipeDTO>({
    name: '',
    description: '',
    prepTime: null,
    cookTime: null,
    servings: null,
    instructions: '',
    imageUrl: '',
    userId: user?.userId || 1, // Get user ID from auth context
    ingredients: [],
    categoryIds: []
  });

  const [newIngredient, setNewIngredient] = useState<CreateRecipeIngredientDTO>({
    name: '',
    quantity: 0,
    unit: '',
    notes: '',
    category: ''
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await categoryApi.getAll();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleRecipeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      [name]: value
    }));
  }, []);

  const handleNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = value === '' ? null : parseInt(value, 10);
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      [name]: numberValue
    }));
  }, []);

  const handleIngredientChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'quantity') {
      const numberValue = parseFloat(value) || 0;
      setNewIngredient(prev => ({
        ...prev,
        [name]: numberValue
      }));
    } else {
      setNewIngredient(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, []);

  const handleCategoryChange = (event: SelectChangeEvent<number[]>) => {
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      categoryIds: event.target.value as number[]
    }));
  };

  const addIngredient = useCallback(() => {
    if (newIngredient.name.trim() === '') return;

    setRecipe(prevRecipe => ({
      ...prevRecipe,
      ingredients: [
        ...prevRecipe.ingredients,
        { ...newIngredient }
      ]
    }));

    // Reset the new ingredient form
    setNewIngredient({
      name: '',
      quantity: 0,
      unit: '',
      notes: '',
      category: ''
    });
  }, [newIngredient]);

  const removeIngredient = useCallback((index: number) => {
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      ingredients: prevRecipe.ingredients.filter((_, i) => i !== index)
    }));
  }, []);

  const handleCancel = () => {
    navigate('/');
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage(null);
    navigate('/');
  };

  const handleSaveRecipe = useCallback(async () => {
    if (recipe.name.trim() === '' || recipe.ingredients.length === 0) {
      alert('Please add a recipe name and at least one ingredient');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    // Ensure the user ID is set
    const recipeToSave = {
      ...recipe,
      userId: user?.userId || recipe.userId
    };
    
    try {
      await recipeApi.create(recipeToSave);
      setSuccessMessage('Recipe saved successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error saving recipe:', err);
      setError(`Failed to save recipe: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [recipe, user]);

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
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

          {error && (
            <Box sx={{ mb: 2 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

          <TextField
            label="Recipe Name"
            name="name"
            variant="outlined"
            fullWidth
            value={recipe.name}
            onChange={handleRecipeChange}
            margin="normal"
            required
          />

          <TextField
            label="Recipe Description"
            name="description"
            variant="outlined"
            fullWidth
            multiline
            rows={2}
            value={recipe.description || ''}
            onChange={handleRecipeChange}
            margin="normal"
          />

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Prep Time (minutes)"
                name="prepTime"
                type="number"
                variant="outlined"
                fullWidth
                value={recipe.prepTime || ''}
                onChange={handleNumberChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Cook Time (minutes)"
                name="cookTime"
                type="number"
                variant="outlined"
                fullWidth
                value={recipe.cookTime || ''}
                onChange={handleNumberChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Servings"
                name="servings"
                type="number"
                variant="outlined"
                fullWidth
                value={recipe.servings || ''}
                onChange={handleNumberChange}
                inputProps={{ min: 1 }}
              />
            </Grid>
          </Grid>

          <TextField
            label="Instructions"
            name="instructions"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={recipe.instructions || ''}
            onChange={handleRecipeChange}
            margin="normal"
          />

          <TextField
            label="Image URL"
            name="imageUrl"
            variant="outlined"
            fullWidth
            value={recipe.imageUrl || ''}
            onChange={handleRecipeChange}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Categories</InputLabel>
            <Select
              multiple
              value={recipe.categoryIds}
              onChange={handleCategoryChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const category = categories.find(cat => cat.categoryId === value);
                    return (
                      <Chip key={value} label={category ? category.name : value} />
                    );
                  })}
                </Box>
              )}
            >
              {categories.map((category) => (
                <MenuItem key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            Add Ingredients
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Ingredient Name"
                name="name"
                variant="outlined"
                fullWidth
                value={newIngredient.name}
                onChange={handleIngredientChange}
                required
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                variant="outlined"
                fullWidth
                value={newIngredient.quantity || ''}
                onChange={handleIngredientChange}
                inputProps={{ step: "0.01", min: 0 }}
              />
            </Grid>
            <Grid size={{ xs: 6, sm: 2 }}>
              <TextField
                label="Unit"
                name="unit"
                variant="outlined"
                fullWidth
                value={newIngredient.unit || ''}
                onChange={handleIngredientChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <TextField
                label="Category"
                name="category"
                variant="outlined"
                fullWidth
                value={newIngredient.category || ''}
                onChange={handleIngredientChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={addIngredient}
                startIcon={<AddCircleIcon />}
                fullWidth
                sx={{ height: '100%' }}
                disabled={!newIngredient.name}
              >
                Add
              </Button>
            </Grid>
          </Grid>

          <TextField
            label="Notes"
            name="notes"
            variant="outlined"
            fullWidth
            value={newIngredient.notes || ''}
            onChange={handleIngredientChange}
            margin="normal"
            placeholder="Optional notes about this ingredient"
          />

          {recipe.ingredients.length > 0 && (
            <Card variant="outlined" sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Ingredients:
                </Typography>
                <List>
                  {recipe.ingredients.map((ingredient, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={() => removeIngredient(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={`${ingredient.name}${ingredient.category ? ` (${ingredient.category})` : ''}`}
                        secondary={ingredient.quantity && ingredient.unit 
                          ? `${ingredient.quantity} ${ingredient.unit}${ingredient.notes ? ` - ${ingredient.notes}` : ''}`
                          : ingredient.notes || ''}
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={isSubmitting ? <CircularProgress size={24} /> : <SaveIcon />}
              onClick={handleSaveRecipe}
              disabled={isSubmitting || recipe.name.trim() === '' || recipe.ingredients.length === 0}
            >
              {isSubmitting ? 'Saving...' : 'Save Recipe'}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={5000} 
        onClose={handleCloseSuccessMessage}
      >
        <Alert onClose={handleCloseSuccessMessage} severity="success" variant="filled">
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RecipeForm;