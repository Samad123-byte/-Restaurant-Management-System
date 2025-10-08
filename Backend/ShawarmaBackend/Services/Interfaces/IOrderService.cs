using ShawarmaBackend.Models.Domain;
using ShawarmaBackend.Models.DTOs.Requests;

namespace ShawarmaBackend.Services.Interfaces
{
    public interface IOrderService
    {
        Task<(int orderId, string message)> PlaceOrder(PlaceOrderRequest request);
        Task<List<Order>> GetAllOrders();
        Task<List<Order>> GetOrdersByUser(int userId);
        Task<List<OrderDetail>> GetOrderDetails(int orderId);
        Task<(int orderId, string status, string message)> UpdateOrderStatus(int orderId, string status);
    }
}