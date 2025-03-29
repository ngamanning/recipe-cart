import React, { useState } from 'react';
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
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import RecipeForm from '../components/feature/RecipeForm';
import { Recipe } from '../types/recipe';

const HomePage: React.FC = () => {
  const [isRecipeFormOpen, setIsRecipeFormOpen] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  const handleOpenRecipeForm = () => {
    setIsRecipeFormOpen(true);
  };

  const handleCloseRecipeForm = () => {
    setIsRecipeFormOpen(false);
  };

  const handleSaveRecipe = (newRecipe: Recipe) => {
    setSavedRecipes([...savedRecipes, newRecipe]);
    setIsRecipeFormOpen(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" 
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
          <FoodBankIcon sx={{ mr: 1, fontSize: 35 }} />
          My Recipe Collection
        </Typography>

        {!isRecipeFormOpen ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddIcon />}
                onClick={handleOpenRecipeForm}
              >
                New Recipe
              </Button>
            </Box>

            {savedRecipes.length > 0 ? (
              <Grid container spacing={3}>
                {savedRecipes.map((recipe, index) => (
                  <Grid size={{
                    xs:12,
                    sm: 6,
                    md: 6
                  }} key={index}>
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
                        
                        <Typography variant="subtitle2" color="text.primary">
                          Ingredients:
                        </Typography>
                        <List dense>
                          {recipe.ingredients.map((ingredient, idx) => (
                            <ListItem key={idx} sx={{ py: 0 }}>
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
                      <CardActions>
                        <Button size="small" variant='outlined'>Add to plan</Button>
                        <Button size="small" variant='outlined'>Remove</Button>
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
          </>
        ) : (
          <RecipeForm 
            onSave={handleSaveRecipe} 
            onCancel={handleCloseRecipeForm} 
          />
        )}
      </Box>
    </Container>
  );
};

export default HomePage;