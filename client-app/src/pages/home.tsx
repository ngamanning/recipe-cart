import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RecipeForm from '../components/feature/RecipeForm';
import { Recipe } from '../types/recipe';
import { recipeApi } from '../services/api-service';

const HomePage: React.FC = () => {
  const [isRecipeFormOpen, setIsRecipeFormOpen] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await recipeApi.getAll();
      setRecipes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to fetch recipes:', err);
      setError(`Failed to load recipes: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenRecipeForm = () => {
    setIsRecipeFormOpen(true);
  };

  const handleCloseRecipeForm = () => {
    setIsRecipeFormOpen(false);
  };

  const handleSaveRecipe = (newRecipe: Recipe) => {
    setRecipes([...recipes, newRecipe]);
    setIsRecipeFormOpen(false);
    setSuccessMessage('Recipe saved successfully!');
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage(null);
  };

  if (isRecipeFormOpen) {
    return (
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <RecipeForm 
            onSave={handleSaveRecipe} 
            onCancel={handleCloseRecipeForm} 
          />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" 
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
          <FoodBankIcon sx={{ mr: 1, fontSize: 35 }} />
          My Recipe Collection
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleOpenRecipeForm}
          >
            New Recipe
          </Button>
          
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            startIcon={<ShoppingCartIcon />}
            disabled={recipes.length === 0}
          >
            Create Shopping List
          </Button>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
        ) : recipes.length > 0 ? (
          <Grid container spacing={3}>
            {recipes.map((recipe) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={recipe.recipeId}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {recipe.name}
                    </Typography>
                    
                    {recipe.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {recipe.description}
                      </Typography>
                    )}
                    
                    <Typography variant="body2" color="text.secondary">
                      {recipe.prepTime && recipe.cookTime ? (
                        `Prep: ${recipe.prepTime} min | Cook: ${recipe.cookTime} min`
                      ) : recipe.prepTime ? (
                        `Prep: ${recipe.prepTime} min`
                      ) : recipe.cookTime ? (
                        `Cook: ${recipe.cookTime} min`
                      ) : ''}
                    </Typography>
                    
                    <Typography variant="subtitle2" color="text.primary" sx={{ mt: 2 }}>
                      Ingredients:
                    </Typography>
                    <List dense>
                      {recipe.ingredients.slice(0, 3).map((ingredient, idx) => (
                        <ListItem key={idx} sx={{ py: 0 }}>
                          <ListItemText 
                            primary={ingredient.name}
                            secondary={ingredient.quantity && ingredient.unit 
                              ? `${ingredient.quantity} ${ingredient.unit}`
                              : ''}
                          />
                        </ListItem>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <ListItem sx={{ py: 0 }}>
                          <ListItemText 
                            primary={`+${recipe.ingredients.length - 3} more...`}
                          />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View Details</Button>
                    <Button size="small" color="secondary">Add to Meal Plan</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No recipes yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Click "New Recipe" to add your first recipe!
            </Typography>
          </Paper>
        )}
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

export default HomePage;