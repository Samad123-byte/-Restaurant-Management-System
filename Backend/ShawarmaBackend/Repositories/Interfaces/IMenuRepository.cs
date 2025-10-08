using ShawarmaBackend.Models.Domain;

namespace ShawarmaBackend.Repositories.Interfaces
{
    public interface IMenuRepository
    {
        Task<List<MenuItem>> GetAllMenuItems();
        Task<List<MenuItem>> GetAvailableMenuItems();
        Task<MenuItem> GetMenuItemById(int itemId);
        Task<(int itemId, string message)> AddMenuItem(MenuItem menuItem);
        Task<(int itemId, string message)> UpdateMenuItem(MenuItem menuItem);
        Task<(int itemId, string message)> DeleteMenuItem(int itemId);
        Task<(int itemId, int quantity, string message)> UpdateStock(int itemId, int quantity);
    }
}