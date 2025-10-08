using ShawarmaBackend.Models.DTOs.Requests;
using ShawarmaBackend.Models.DTOs.Responses;

namespace ShawarmaBackend.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> Register(RegisterRequest request);
        Task<AuthResponse> Login(LoginRequest request);
        Task<AuthResponse> GetUserProfile(int userId);
    }
}