using System.ComponentModel.DataAnnotations;

namespace RecipeAPI.Models
{
    public class CreateRecipeDTO
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }

        public int? PrepTime { get; set; }

        public int? CookTime { get; set; }

        public int? Servings { get; set; }

        public string Instructions { get; set; }

        public string ImageUrl { get; set; }

        public int? UserId { get; set; }

        public List<CreateRecipeIngredientDTO> Ingredients { get; set; } = new List<CreateRecipeIngredientDTO>();

        public List<int> CategoryIds { get; set; } = new List<int>();
    }

    public class CreateRecipeIngredientDTO
    {
        [Required]
        public string Name { get; set; }

        public decimal Quantity { get; set; }

        public string Unit { get; set; }

        public string Notes { get; set; }

        public string Category { get; set; }
    }
}
