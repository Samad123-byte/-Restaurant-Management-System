using Microsoft.Data.SqlClient;
using ShawarmaBackend.Data;
using ShawarmaBackend.Models.Domain;
using ShawarmaBackend.Models.DTOs.Requests;
using ShawarmaBackend.Repositories.Interfaces;
using System.Data;

namespace ShawarmaBackend.Repositories.Implementations
{
    public class OrderRepository : IOrderRepository
    {
        private readonly DatabaseContext _dbContext;

        public OrderRepository(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<(int orderId, string message)> PlaceOrder(PlaceOrderRequest orderRequest)
        {
            using var connection = _dbContext.GetConnection();
            using var command = new SqlCommand("sp_PlaceOrder", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            // Create DataTable for order details
            var orderDetailsTable = new DataTable();
            orderDetailsTable.Columns.Add("ItemID", typeof(int));
            orderDetailsTable.Columns.Add("Quantity", typeof(int));
            orderDetailsTable.Columns.Add("Subtotal", typeof(decimal));

            foreach (var item in orderRequest.OrderDetails)
            {
                orderDetailsTable.Rows.Add(item.ItemID, item.Quantity, item.Subtotal);
            }

            command.Parameters.AddWithValue("@UserID", orderRequest.UserID);
            command.Parameters.AddWithValue("@TotalAmount", orderRequest.TotalAmount);

            var tvpParam = command.Parameters.AddWithValue("@OrderDetails", orderDetailsTable);
            tvpParam.SqlDbType = SqlDbType.Structured;
            tvpParam.TypeName = "OrderDetailsTableType";

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return (reader.GetInt32(0), reader.GetString(1));
            }

            return (-1, "Failed to place order");
        }

        public async Task<List<Order>> GetAllOrders()
        {
            var orders = new List<Order>();

            using var connection = _dbContext.GetConnection();
            using var command = new SqlCommand("sp_GetAllOrders", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                orders.Add(new Order
                {
                    OrderID = reader.GetInt32(0),
                    UserID = reader.GetInt32(1),
                    CustomerName = reader.GetString(2),
                    CustomerEmail = reader.GetString(3),
                    OrderDate = reader.GetDateTime(4),
                    TotalAmount = reader.GetDecimal(5),
                    Status = reader.GetString(6)
                });
            }

            return orders;
        }

        public async Task<List<Order>> GetOrdersByUser(int userId)
        {
            var orders = new List<Order>();

            using var connection = _dbContext.GetConnection();
            using var command = new SqlCommand("sp_GetOrdersByUser", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@UserID", userId);
            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                orders.Add(new Order
                {
                    OrderID = reader.GetInt32(0),
                    UserID = reader.GetInt32(1),
                    OrderDate = reader.GetDateTime(2),
                    TotalAmount = reader.GetDecimal(3),
                    Status = reader.GetString(4)
                });
            }

            return orders;
        }

        public async Task<List<OrderDetail>> GetOrderDetails(int orderId)
        {
            var orderDetails = new List<OrderDetail>();

            using var connection = _dbContext.GetConnection();
            using var command = new SqlCommand("sp_GetOrderDetails", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@OrderID", orderId);
            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                orderDetails.Add(new OrderDetail
                {
                    OrderDetailID = reader.GetInt32(0),
                    OrderID = reader.GetInt32(1),
                    ItemID = reader.GetInt32(2),
                    ItemName = reader.GetString(3),
                    Category = reader.GetString(4),
                    Quantity = reader.GetInt32(5),
                    Subtotal = reader.GetDecimal(6)
                });
            }

            return orderDetails;
        }

        public async Task<(int orderId, string status, string message)> UpdateOrderStatus(int orderId, string status)
        {
            using var connection = _dbContext.GetConnection();
            using var command = new SqlCommand("sp_UpdateOrderStatus", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@OrderID", orderId);
            command.Parameters.AddWithValue("@Status", status);

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return (reader.GetInt32(0), reader.GetString(1), reader.GetString(2));
            }

            return (-1, status, "Failed to update order status");
        }
    }
}