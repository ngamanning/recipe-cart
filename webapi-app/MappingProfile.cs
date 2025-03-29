using AutoMapper;
using RecipeAPI.Data.Entities;
using RecipeAPI.Models;


namespace RecipeAPI
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Entity to DTO mappings
            CreateMap<Recipes, RecipeDTO>()
                .ForMember(dest => dest.Ingredients, opt => opt.MapFrom(src => src.RecipeIngredients))
                .ForMember(dest => dest.Categories, opt => opt.MapFrom(src => src.Category));

            CreateMap<RecipeIngredients, IngredientDTO>()
                .ForMember(dest => dest.IngredientId, opt => opt.MapFrom(src => src.Ingredient.IngredientId))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Ingredient.Name))
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Ingredient.Category))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
                .ForMember(dest => dest.Unit, opt => opt.MapFrom(src => src.Unit != null ? src.Unit.Name : null))
                .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes));

            CreateMap<Categories, CategoryDTO>();
        }
    }
}