using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeAPI.Models;
using RecipeAPI.Services;

namespace RecipeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Require authentication for all recipe endpoints
    public class RecipesController : ControllerBase
    {
        private readonly IRecipeService _recipeService;
        private readonly IIngredientService _ingredientService;

        public RecipesController(IRecipeService recipeService, IIngredientService ingredientService)
        {
            _recipeService = recipeService;
            _ingredientService = ingredientService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<RecipeDTO>>> GetAllRecipes()
        {
            try
            {
                var recipes = await _recipeService.GetAllRecipesAsync();
                return Ok(recipes);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "An error occurred while retrieving recipes: " + ex.Message);
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<RecipeDTO>> CreateRecipe(CreateRecipeDTO createRecipeDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var createdRecipe = await _recipeService.CreateRecipeAsync(createRecipeDto);

                return CreatedAtAction(
                    nameof(GetRecipe),
                    new { id = createdRecipe.RecipeId },
                    createdRecipe
                );
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "An error occurred while creating the recipe: " + ex.Message);
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<RecipeDTO>> GetRecipe(int id)
        {
            var recipe = await _recipeService.GetRecipeByIdAsync(id);

            if (recipe == null)
            {
                return NotFound();
            }

            return Ok(recipe);
        }
    }
}