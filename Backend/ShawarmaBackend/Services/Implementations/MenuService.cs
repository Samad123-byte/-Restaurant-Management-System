using ShawarmaBackend.Models.Domain;
using ShawarmaBackend.Models.DTOs.Requests;
using ShawarmaBackend.Repositories.Interfaces;
using ShawarmaBackend.Services.Interfaces;

namespace ShawarmaBackend.Services.Implementations
{
    public class MenuService : IMenuService
    {
        private readonly IMenuRepository _menuRepository;

        public MenuService(IMenuRepository menuRepository)
        {
            _menuRepository = menuRepository;
        }

        public async Task<List<MenuItem>> GetAllMenuItems()
        {
            return await _menuRepository.GetAllMenuItems();
        }

        public async Task<List<MenuItem>> GetAvailableMenuItems()
        {
            return await _menuRepository.GetAvailableMenuItems();
        }

        public async Task<MenuItem> GetMenuItemById(int itemId)
        {
            return await _menuRepository.GetMenuItemById(itemId);
        }

        public async Task<(int itemId, string message)> AddMenuItem(AddMenuItemRequest request)
        {
            // Validate request
            if (request.Price <= 0)
            {
                return (-1, "Price must be greater than 0");
            }

            if (request.Quantity < 0)
            {
                return (-1, "Quantity cannot be negative");
            }

            var menuItem = new MenuItem
            {
                Name = request.Name,
                Category = request.Category,
                Price = request.Price,
                Quantity = request.Quantity,
                ImagePath = request.ImagePath,
                IsAvailable = request.IsAvailable
            };

            return await _menuRepository.AddMenuItem(menuItem);
        }

        public async Task<(int itemId, string message)> UpdateMenuItem(UpdateMenuItemRequest request)
        {
            // Validate item exists
            var existingItem = await _menuRepository.GetMenuItemById(request.ItemID);
            if (existingItem == null)
            {
                return (-1, "Menu item not found");
            }

            // Validate request
            if (request.Price <= 0)
            {
                return (-1, "Price must be greater than 0");
            }

            if (request.Quantity < 0)
            {
                return (-1, "Quantity cannot be negative");
            }

            var menuItem = new MenuItem
            {
                ItemID = request.ItemID,
                Name = request.Name,
                Category = request.Category,
                Price = request.Price,
                Quantity = request.Quantity,
                ImagePath = request.ImagePath,
                IsAvailable = request.IsAvailable
            };

            return await _menuRepository.UpdateMenuItem(menuItem);
        }

        public async Task<(int itemId, string message)> DeleteMenuItem(int itemId)
        {
            // Validate item exists
            var existingItem = await _menuRepository.GetMenuItemById(itemId);
            if (existingItem == null)
            {
                return (-1, "Menu item not found");
            }

            return await _menuRepository.DeleteMenuItem(itemId);
        }

        public async Task<(int itemId, int quantity, string message)> UpdateStock(int itemId, int quantity)
        {
            // Validate item exists
            var existingItem = await _menuRepository.GetMenuItemById(itemId);
            if (existingItem == null)
            {
                return (-1, 0, "Menu item not found");
            }

            if (quantity < 0)
            {
                return (-1, 0, "Quantity cannot be negative");
            }

            return await _menuRepository.UpdateStock(itemId, quantity);
        }
    }
}