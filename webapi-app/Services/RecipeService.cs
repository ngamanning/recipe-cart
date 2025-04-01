using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RecipeAPI.Data.Entities;
using RecipeAPI.Models;
using RecipeAPI.Services;

namespace RecipeAPI.Services
{
    public class RecipeService : IRecipeService
    {
        private readonly RecipeCartContext _context;
        private readonly IMapper _mapper;

        public RecipeService(RecipeCartContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<RecipeDTO>> GetAllRecipesAsync()
        {
            // Get all recipes with related data
            var recipes = await _context.Recipes
                .Include(r => r.RecipeIngredients)
                    .ThenInclude(ri => ri.Ingredient)
                .Include(r => r.RecipeIngredients)
                    .ThenInclude(ri => ri.Unit)
                .Include(r => r.Category)
                .ToListAsync();

            // Map to DTOs and return
            return _mapper.Map<List<RecipeDTO>>(recipes);
        }

        public async Task<RecipeDTO> CreateRecipeAsync(CreateRecipeDTO createRecipeDto)
        {
            // Create the recipe
            var recipe = new Recipes
            {
                Name = createRecipeDto.Name,
                Description = createRecipeDto.Description,
                PrepTime = createRecipeDto.PrepTime,
                CookTime = createRecipeDto.CookTime,
                Servings = createRecipeDto.Servings,
                Instructions = createRecipeDto.Instructions,
                ImageUrl = createRecipeDto.ImageUrl,
                UserId = createRecipeDto.UserId ?? 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // Add recipe to context
            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            // Process ingredients
            if (createRecipeDto.Ingredients != null && createRecipeDto.Ingredients.Any())
            {
                foreach (var ingredientDto in createRecipeDto.Ingredients)
                {
                    // Check if the ingredient already exists
                    var ingredient = await _context.Ingredients
                        .FirstOrDefaultAsync(i => i.Name.ToLower() == ingredientDto.Name.ToLower());

                    if (ingredient == null)
                    {
                        // Create new ingredient
                        ingredient = new Ingredients
                        {
                            Name = ingredientDto.Name,
                            NameNormalized = ingredientDto.Name.ToLower(),
                            // Optionally set Category if available in your DTO
                            Category = ingredientDto.Category
                        };
                        _context.Ingredients.Add(ingredient);
                        await _context.SaveChangesAsync();
                    }

                    // Check if unit exists
                    int? unitId = null;
                    if (!string.IsNullOrEmpty(ingredientDto.Unit))
                    {
                        var unit = await _context.Units
                            .FirstOrDefaultAsync(u => u.Name.ToLower() == ingredientDto.Unit.ToLower() ||
                                                    u.Abbreviation.ToLower() == ingredientDto.Unit.ToLower());

                        if (unit != null)
                        {
                            unitId = unit.UnitId;
                        }
                    }

                    // Create recipe ingredient relationship
                    var recipeIngredient = new RecipeIngredients
                    {
                        RecipeId = recipe.RecipeId,
                        IngredientId = ingredient.IngredientId,
                        UnitId = unitId,
                        Quantity = ingredientDto.Quantity,
                        Notes = ingredientDto.Notes
                    };

                    _context.RecipeIngredients.Add(recipeIngredient);
                }

                await _context.SaveChangesAsync();
            }

            // Process categories
            if (createRecipeDto.CategoryIds != null && createRecipeDto.CategoryIds.Any())
            {
                foreach (var categoryId in createRecipeDto.CategoryIds)
                {
                    var category = await _context.Categories.FindAsync(categoryId);
                    if (category != null)
                    {
                        // Since you have a many-to-many relationship set up in your context
                        // through the UsingEntity configuration, we can add directly to the collection
                        recipe.Category.Add(category);
                    }
                }

                await _context.SaveChangesAsync();
            }

            // Reload the complete recipe with all relationships
            var createdRecipe = await _context.Recipes
                .Include(r => r.RecipeIngredients)
                    .ThenInclude(ri => ri.Ingredient)
                .Include(r => r.RecipeIngredients)
                    .ThenInclude(ri => ri.Unit)
                .Include(r => r.Category)
                .FirstOrDefaultAsync(r => r.RecipeId == recipe.RecipeId);

            // Map to DTO and return
            return _mapper.Map<RecipeDTO>(createdRecipe);
        }

        public async Task<RecipeDTO> GetRecipeByIdAsync(int id)
        {
            // Find the recipe by ID, including all related data
            var recipe = await _context.Recipes
                .Include(r => r.RecipeIngredients)
                    .ThenInclude(ri => ri.Ingredient)
                .Include(r => r.RecipeIngredients)
                    .ThenInclude(ri => ri.Unit)
                .Include(r => r.Category)
                .FirstOrDefaultAsync(r => r.RecipeId == id);

            if (recipe == null)
                return null;

            // Map to DTO and return
            return _mapper.Map<RecipeDTO>(recipe);
        }
    }
}