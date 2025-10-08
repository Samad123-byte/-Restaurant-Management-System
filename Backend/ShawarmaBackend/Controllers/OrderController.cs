using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShawarmaBackend.Models.Domain;
using ShawarmaBackend.Models.DTOs.Requests;
using ShawarmaBackend.Services.Interfaces;
using System.Security.Claims;

namespace ShawarmaBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // 🔒 ALL ENDPOINTS REQUIRE LOGIN
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // ✅ AUTHENTICATED USERS - Place their own orders
        // POST: api/Order
        [HttpPost]
        public async Task<ActionResult> PlaceOrder([FromBody] PlaceOrderRequest request)
        {
            // Get current user's ID from JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new { message = "Invalid token" });

            var userId = int.Parse(userIdClaim);

            // Security: Ensure users can only place orders for themselves
            if (request.UserID != userId)
                return Forbid(); // 403 Forbidden

            var (orderId, message) = await _orderService.PlaceOrder(request);
            if (orderId == 0)
                return BadRequest(new { message });

            return CreatedAtAction(nameof(GetOrderDetails), new { orderId }, new { orderId, message });
        }

        // 🔒 ADMIN ONLY - View all orders
        // GET: api/Order
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<List<Order>>> GetAllOrders()
        {
            var orders = await _orderService.GetAllOrders();
            return Ok(orders);
        }

        // ✅ USERS - View their own orders
        // GET: api/Order/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<Order>>> GetOrdersByUser(int userId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUserId = int.Parse(userIdClaim);
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            // Security: Users can only see their own orders (unless Admin)
            if (userRole != "Admin" && currentUserId != userId)
                return Forbid(); // 403 Forbidden

            var orders = await _orderService.GetOrdersByUser(userId);
            return Ok(orders);
        }

        // ✅ AUTHENTICATED USERS - View order details
        // GET: api/Order/5/details
        [HttpGet("{orderId}/details")]
        public async Task<ActionResult<List<OrderDetail>>> GetOrderDetails(int orderId)
        {
            var details = await _orderService.GetOrderDetails(orderId);
            if (details == null || details.Count == 0)
                return NotFound(new { message = $"No details found for order ID {orderId}" });

            return Ok(details);
        }

        // 🔒 ADMIN ONLY - Update order status
        // PATCH: api/Order/5/status?status=Completed
        [Authorize(Roles = "Admin")]
        [HttpPatch("{orderId}/status")]
        public async Task<ActionResult> UpdateOrderStatus(int orderId, [FromQuery] string status)
        {
            var (updatedOrderId, updatedStatus, message) = await _orderService.UpdateOrderStatus(orderId, status);
            if (updatedOrderId == 0)
                return NotFound(new { message });

            return Ok(new { updatedOrderId, updatedStatus, message });
        }
    }
}