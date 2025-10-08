using Microsoft.Data.SqlClient;
using ShawarmaBackend.Data;
using ShawarmaBackend.Models.Domain;
using ShawarmaBackend.Repositories.Interfaces;
using System.Data;

namespace ShawarmaBackend.Repositories.Implementations
{
    public class MenuRepository : IMenuRepository
    {
        private readonly DatabaseContext _dbContext;

        public MenuRepository(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<MenuItem>> GetAllMenuItems()
        {
            var menuItems = new List<MenuItem>();

            using var connection = _dbContext.GetConnection();
            using var command = new SqlCommand("sp_GetAllMenuItems", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                menuItems.Add(new MenuItem
                {
                    ItemID = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Category = reader.GetString(2),
                    Price = reader.GetDecimal(3),
                    Quantity = reader.GetInt32(4),
                    ImagePath = reader.IsDBNull(5) ? null : reader.GetString(5),
                    IsAvailable = reader.GetBoolean(6),
                    CreatedAt = reader.GetDateTime(7),
                    UpdatedAt = reader.IsDBNull(8) ? null : reader.GetDateTime(8)
                });
            }

            return menuItems;
        }

        public async Task<List<MenuItem>> GetAvailableMenuItems()
        {
            var menuItems = new List<MenuItem>();

            using var connection = _dbContext.GetConnection();
            using var command = new SqlCommand("sp_GetAvailableMenuItems", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                menuItems.Add(new MenuItem
                {
                    ItemID = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Category = reader.GetString(2),
                    Price = reader.GetDecimal(3),
                    Quantity = reader.GetInt32(4),
                    ImagePath = reader.IsDBNull(5) ? null : reader.GetString(5),
                    IsAvailable = true
                });
            }

            return menuItems;
        }

        public async Task<MenuItem> GetMenuItemById(int itemId)
        {
            using var connection = _dbContext.GetConnection();
            using var command = new SqlCommand("sp_GetMenuItemById", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@ItemID", itemId);
            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new MenuItem
                {
                    ItemID = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Category = reader.GetString(2),
                    Price = reader.GetDecimal(3),
                    Quantity = reader.GetInt32(4),
                    ImagePath = reader.IsDBNull(5) ? null : reader.GetString(5),
                    IsAvailable = reader.GetBoolean(6),
                    CreatedAt = reader.GetDateTime(7),
                    UpdatedAt = reader.IsDBNull(8) ? null : reader.GetDateTime(8)
                };
            }

            return null;
        }

        public async Task<(int itemId, string message)> AddMenuItem(MenuItem menuItem)
        {
            using var connection = _dbContext.GetConnection();
            using var command = new SqlCommand("sp_AddMenuItem", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@Name", menuItem.Name);
            command.Parameters.AddWithValue("@Category", menuItem.Category);
            command.Parameters.AddWithValue("@Price", menuItem.Price);
            command.Parameters.AddWithValue("@Quantity", menuItem.Quantity);
            command.Parameters.AddWithValue("@ImagePath", menuItem.ImagePath ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@IsAvailable", menuItem.IsAvailable);

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return (reader.GetInt32(0), reader.GetString(1));
            }

            return (-1, "Failed to add menu item");
        }

        public async Task<(int itemId, string message)> UpdateMenuItem(MenuItem menuItem)
        {
            using var connection = _dbContext.GetConnection();
            using var command = new SqlCommand("sp_UpdateMenuItem", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@ItemID", menuItem.ItemID);
            command.Parameters.AddWithValue("@Name", menuItem.Name);
            command.Parameters.AddWithValue("@Category", menuItem.Category);
            command.Parameters.AddWithValue("@Price", menuItem.Price);
            command.Parameters.AddWithValue("@Quantity", menuItem.Quantity);
            command.Parameters.AddWithValue("@ImagePath", menuItem.ImagePath ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@IsAvailable", menuItem.IsAvailable);

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return (reader.GetInt32(0), reader.GetString(1));
            }

            return (-1, "Failed to update menu item");
        }

        public async Task<(int itemId, string message)> DeleteMenuItem(int itemId)
        {
            using var connection = _dbContext.GetConnection();
            using var command = new SqlCommand("sp_DeleteMenuItem", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@ItemID", itemId);
            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return (reader.GetInt32(0), reader.GetString(1));
            }

            return (-1, "Failed to delete menu item");
        }

        public async Task<(int itemId, int quantity, string message)> UpdateStock(int itemId, int quantity)
        {
            using var connection = _dbContext.GetConnection();
            using var command = new SqlCommand("sp_UpdateStock", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@ItemID", itemId);
            command.Parameters.AddWithValue("@Quantity", quantity);

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return (reader.GetInt32(0), reader.GetInt32(1), reader.GetString(2));
            }

            return (-1, 0, "Failed to update stock");
        }
    }
}