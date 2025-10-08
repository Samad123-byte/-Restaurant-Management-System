using ShawarmaBackend.Models.Domain;
using ShawarmaBackend.Models.DTOs.Requests;

namespace ShawarmaBackend.Services.Interfaces
{
    public interface IMenuService
    {
        Task<List<MenuItem>> GetAllMenuItems();
        Task<List<MenuItem>> GetAvailableMenuItems();
        Task<MenuItem> GetMenuItemById(int itemId);
        Task<(int itemId, string message)> AddMenuItem(AddMenuItemRequest request);
        Task<(int itemId, string message)> UpdateMenuItem(UpdateMenuItemRequest request);
        Task<(int itemId, string message)> DeleteMenuItem(int itemId);
        Task<(int itemId, int quantity, string message)> UpdateStock(int itemId, int quantity);
    }
}