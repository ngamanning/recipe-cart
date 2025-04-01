using RecipeAPI.Models;

namespace RecipeAPI.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDTO> RegisterAsync(RegisterRequestDTO model);
        Task<AuthResponseDTO> LoginAsync(LoginRequestDTO model);
        string GenerateJwtToken(int userId, string username, string email);
    }
}
