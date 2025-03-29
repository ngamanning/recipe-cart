using Microsoft.AspNetCore.Mvc;
using RecipeAPI.Services;


namespace RecipeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IngredientsController : ControllerBase
    {
        private readonly IIngredientService _ingredientService;
        
        public IngredientsController(IIngredientService ingredientService)
        {
            _ingredientService = ingredientService;
        }
        
       
    }
}