using ShawarmaBackend.Models.Domain;
using ShawarmaBackend.Models.DTOs.Requests;
using ShawarmaBackend.Repositories.Interfaces;
using ShawarmaBackend.Services.Interfaces;

namespace ShawarmaBackend.Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IMenuRepository _menuRepository;

        public OrderService(IOrderRepository orderRepository, IMenuRepository menuRepository)
        {
            _orderRepository = orderRepository;
            _menuRepository = menuRepository;
        }

        public async Task<(int orderId, string message)> PlaceOrder(PlaceOrderRequest request)
        {
            // Validate order has items
            if (request.OrderDetails == null || !request.OrderDetails.Any())
            {
                return (-1, "Order must contain at least one item");
            }

            // Validate stock availability
            foreach (var item in request.OrderDetails)
            {
                var menuItem = await _menuRepository.GetMenuItemById(item.ItemID);

                if (menuItem == null)
                {
                    return (-1, $"Item with ID {item.ItemID} not found");
                }

                if (!menuItem.IsAvailable)
                {
                    return (-1, $"{menuItem.Name} is not available");
                }

                if (menuItem.Quantity < item.Quantity)
                {
                    return (-1, $"Insufficient stock for {menuItem.Name}. Available: {menuItem.Quantity}");
                }
            }

            // Calculate and validate total amount
            decimal calculatedTotal = request.OrderDetails.Sum(x => x.Subtotal);
            if (Math.Abs(calculatedTotal - request.TotalAmount) > 0.01m)
            {
                return (-1, "Total amount mismatch");
            }

            // Place order
            return await _orderRepository.PlaceOrder(request);
        }

        public async Task<List<Order>> GetAllOrders()
        {
            return await _orderRepository.GetAllOrders();
        }

        public async Task<List<Order>> GetOrdersByUser(int userId)
        {
            return await _orderRepository.GetOrdersByUser(userId);
        }

        public async Task<List<OrderDetail>> GetOrderDetails(int orderId)
        {
            return await _orderRepository.GetOrderDetails(orderId);
        }

        public async Task<(int orderId, string status, string message)> UpdateOrderStatus(int orderId, string status)
        {
            // Validate status
            var validStatuses = new[] { "Pending", "Preparing", "Ready", "Completed", "Cancelled" };
            if (!validStatuses.Contains(status))
            {
                return (-1, status, "Invalid status");
            }

            return await _orderRepository.UpdateOrderStatus(orderId, status);
        }
    }
}