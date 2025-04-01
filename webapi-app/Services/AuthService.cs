using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RecipeAPI.Data.Entities;
using RecipeAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace RecipeAPI.Services
{
    public class AuthService(RecipeCartContext context, IConfiguration configuration) : IAuthService
    {
        private readonly RecipeCartContext _context = context;
        private readonly IConfiguration _configuration = configuration;

        public async Task<AuthResponseDTO> RegisterAsync(RegisterRequestDTO model)
        {
            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == model.Email))
            {
                throw new ApplicationException("Email already exists");
            }

            // Check if username already exists
            if (await _context.Users.AnyAsync(u => u.Username == model.Username))
            {
                throw new ApplicationException("Username already exists");
            }

            // Hash the password
            var passwordHashResult = HashPassword(model.Password);

            // Create new user
            var user = new Users
            {
                Username = model.Username,
                Email = model.Email,
                PasswordHash = Convert.ToBase64String(passwordHashResult.Salt) + ":" + passwordHashResult.Hash,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Generate JWT token
            var token = GenerateJwtToken(user.UserId, user.Username, user.Email);

            return new AuthResponseDTO
            {
                UserId = user.UserId,
                Username = user.Username,
                Email = user.Email,
                Token = token
            };
        }

        public async Task<AuthResponseDTO> LoginAsync(LoginRequestDTO model)
        {
            // Find user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email) ?? throw new ApplicationException("Invalid email or password");

            // Verify password
            if (!VerifyPassword(model.Password, user.PasswordHash))
            {
                throw new ApplicationException("Invalid email or password");
            }

            // Generate JWT token
            var token = GenerateJwtToken(user.UserId, user.Username, user.Email);

            return new AuthResponseDTO
            {
                UserId = user.UserId,
                Username = user.Username,
                Email = user.Email,
                Token = token
            };
        }

        public string GenerateJwtToken(int userId, string username, string email)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddDays(7);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, username),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static PasswordHashResult HashPassword(string password)
        {
            using var hmac = new HMACSHA512();
            return new PasswordHashResult
            {
                Salt = hmac.Key,
                Hash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)))
            };
        }

        private static bool VerifyPassword(string password, string storedHash)
        {
            var parts = storedHash.Split(':');
            var salt = Convert.FromBase64String(parts[0]);
            var hash = parts[1];

            using var hmac = new HMACSHA512(salt);
            var computedHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
            return computedHash == hash;
        }

    }
}
