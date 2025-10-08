using ShawarmaBackend.Models.DTOs.Requests;
using ShawarmaBackend.Models.DTOs.Responses;
using ShawarmaBackend.Repositories.Interfaces;
using ShawarmaBackend.Services.Interfaces;
using ShawarmaBackend.Utilities;

namespace ShawarmaBackend.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly JwtHelper _jwtHelper;

        public AuthService(IAuthRepository authRepository, JwtHelper jwtHelper)
        {
            _authRepository = authRepository;
            _jwtHelper = jwtHelper;
        }

        public async Task<AuthResponse> Register(RegisterRequest request)
        {
            // Check if user already exists
            var existingUser = await _authRepository.GetUserByEmail(request.Email);
            if (existingUser != null)
            {
                return new AuthResponse
                {
                    UserID = -1,  // Indicate failure
                    Message = "Email already exists"
                };
            }

            // Hash password
            var passwordHash = PasswordHasher.HashPassword(request.Password);

            // Register user
            var (userId, message) = await _authRepository.RegisterUser(
                request.Name,
                request.Email,
                passwordHash,
                request.Role
            );

            if (userId == -1)
            {
                return new AuthResponse
                {
                    UserID = -1,  // Indicate failure
                    Message = message
                };
            }

            // Generate JWT token
            var token = _jwtHelper.GenerateToken(userId, request.Email, request.Role);

            return new AuthResponse
            {
                UserID = userId,
                Name = request.Name,
                Email = request.Email,
                Role = request.Role,
                Token = token,
                Message = "Registration successful"
            };
        }

        public async Task<AuthResponse> Login(LoginRequest request)
        {
            // Get user by email
            var user = await _authRepository.GetUserByEmail(request.Email);

            if (user == null)
            {
                return new AuthResponse
                {
                    UserID = -1,  // Indicate failure
                    Message = "Invalid email or password"
                };
            }

            // Verify password
            if (!PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
            {
                return new AuthResponse
                {
                    UserID = -1,  // Indicate failure
                    Message = "Invalid email or password"
                };
            }

            // Generate JWT token
            var token = _jwtHelper.GenerateToken(user.UserID, user.Email, user.Role);

            return new AuthResponse
            {
                UserID = user.UserID,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                Token = token,
                Message = "Login successful"
            };
        }

        public async Task<AuthResponse> GetUserProfile(int userId)
        {
            var user = await _authRepository.GetUserById(userId);

            if (user == null)
            {
                return new AuthResponse
                {
                    UserID = -1,  // Indicate failure
                    Message = "User not found"
                };
            }

            return new AuthResponse
            {
                UserID = user.UserID,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                Message = "Profile retrieved successfully"
            };
        }
    }
}