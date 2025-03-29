namespace RecipeAPI.Models
{
    public class RecipeDTO
    {
        public int RecipeId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? PrepTime { get; set; }
        public int? CookTime { get; set; }
        public int? Servings { get; set; }
        public string Instructions { get; set; }
        public string ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int? UserId { get; set; }
        public List<IngredientDTO> Ingredients { get; set; } = new List<IngredientDTO>();
        public List<CategoryDTO> Categories { get; set; } = new List<CategoryDTO>();
    }

    public class IngredientDTO
    {
        public int IngredientId { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public decimal Quantity { get; set; }
        public string Unit { get; set; }
        public string Notes { get; set; }
    }

    public class CategoryDTO
    {
        public int CategoryId { get; set; }
        public string Name { get; set; }
    }
}
