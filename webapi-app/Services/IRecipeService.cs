using RecipeAPI.Models;

namespace RecipeAPI.Services
{
    public interface IRecipeService
    {
        Task<RecipeDTO> CreateRecipeAsync(CreateRecipeDTO createRecipeDto);
        Task<RecipeDTO> GetRecipeByIdAsync(int id);
    }
}
