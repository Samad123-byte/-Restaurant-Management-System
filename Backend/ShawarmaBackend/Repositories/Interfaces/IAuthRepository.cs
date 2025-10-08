using ShawarmaBackend.Models.Domain;

namespace ShawarmaBackend.Repositories.Interfaces
{
    public interface IAuthRepository
    {
        Task<(int userId, string message)> RegisterUser(string name, string email, string passwordHash, string role);
        Task<User> GetUserByEmail(string email);
        Task<User> GetUserById(int userId);
    }
}