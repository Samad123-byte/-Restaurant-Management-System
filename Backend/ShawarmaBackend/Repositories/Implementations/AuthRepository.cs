using Microsoft.Data.SqlClient;
using ShawarmaBackend.Data;
using ShawarmaBackend.Models.Domain;
using ShawarmaBackend.Repositories.Interfaces;
using System.Data;

namespace ShawarmaBackend.Repositories.Implementations
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DatabaseContext _dbContext;

        public AuthRepository(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<(int userId, string message)> RegisterUser(string name, string email, string passwordHash, string role)
        {
            using var connection = _dbContext.GetConnection();
            using var command = new SqlCommand("sp_RegisterUser", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@Name", name);
            command.Parameters.AddWithValue("@Email", email);
            command.Parameters.AddWithValue("@PasswordHash", passwordHash);
            command.Parameters.AddWithValue("@Role", role);

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return (reader.GetInt32(0), reader.GetString(1));
            }

            return (-1, "Registration failed");
        }

        public async Task<User> GetUserByEmail(string email)
        {
            using var connection = _dbContext.GetConnection();
            using var command = new SqlCommand("sp_GetUserByEmail", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@Email", email);
            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new User
                {
                    UserID = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Email = reader.GetString(2),
                    PasswordHash = reader.GetString(3),
                    Role = reader.GetString(4),
                    IsActive = reader.GetBoolean(5),
                    CreatedAt = reader.GetDateTime(6)
                };
            }

            return null;
        }

        public async Task<User> GetUserById(int userId)
        {
            using var connection = _dbContext.GetConnection();
            using var command = new SqlCommand("sp_GetUserById", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@UserID", userId);
            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new User
                {
                    UserID = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Email = reader.GetString(2),
                    Role = reader.GetString(3),
                    IsActive = reader.GetBoolean(4),
                    CreatedAt = reader.GetDateTime(5)
                };
            }

            return null;
        }
    }
}