using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShawarmaBackend.Models.Domain;
using ShawarmaBackend.Models.DTOs.Requests;
using ShawarmaBackend.Services.Interfaces;

namespace ShawarmaBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuController : ControllerBase
    {
        private readonly IMenuService _menuService;

        public MenuController(IMenuService menuService)
        {
            _menuService = menuService;
        }

        // ✅ PUBLIC - Anyone can view all items (for display purposes)
        // GET: api/Menu
        [HttpGet]
        public async Task<ActionResult<List<MenuItem>>> GetAllMenuItems()
        {
            var items = await _menuService.GetAllMenuItems();
            return Ok(items);
        }

        // ✅ PUBLIC - Customers need to see available items to order
        // GET: api/Menu/available
        [HttpGet("available")]
        public async Task<ActionResult<List<MenuItem>>> GetAvailableMenuItems()
        {
            var items = await _menuService.GetAvailableMenuItems();
            return Ok(items);
        }

        // ✅ PUBLIC - View single item details
        // GET: api/Menu/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MenuItem>> GetMenuItemById(int id)
        {
            var item = await _menuService.GetMenuItemById(id);
            if (item == null)
                return NotFound();
            return Ok(item);
        }

        // 🔒 ADMIN ONLY - Add new menu items
        // POST: api/Menu
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult> AddMenuItem([FromBody] AddMenuItemRequest request)
        {
            var (itemId, message) = await _menuService.AddMenuItem(request);
            return CreatedAtAction(nameof(GetMenuItemById), new { id = itemId }, new { itemId, message });
        }

        // 🔒 ADMIN ONLY - Update existing items
        // PUT: api/Menu
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult> UpdateMenuItem([FromBody] UpdateMenuItemRequest request)
        {
            var (itemId, message) = await _menuService.UpdateMenuItem(request);
            if (itemId == 0)
                return NotFound(message);
            return Ok(new { itemId, message });
        }

        // 🔒 ADMIN ONLY - Delete menu items
        // DELETE: api/Menu/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMenuItem(int id)
        {
            var (itemId, message) = await _menuService.DeleteMenuItem(id);
            if (itemId == 0)
                return NotFound(message);
            return Ok(new { itemId, message });
        }

        // 🔒 ADMIN ONLY - Update stock quantities
        // PATCH: api/Menu/stock/5?quantity=10
        [Authorize(Roles = "Admin")]
        [HttpPatch("stock/{id}")]
        public async Task<ActionResult> UpdateStock(int id, [FromQuery] int quantity)
        {
            var (itemId, updatedQuantity, message) = await _menuService.UpdateStock(id, quantity);
            if (itemId == 0)
                return NotFound(message);
            return Ok(new { itemId, updatedQuantity, message });
        }
    }
}