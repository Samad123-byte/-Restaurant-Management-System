using System.ComponentModel.DataAnnotations;

namespace ShawarmaBackend.Models.DTOs.Requests
{
    public class PlaceOrderRequest
    {
        [Required]
        public int UserID { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        public List<OrderItemRequest> OrderDetails { get; set; }
    }

    public class OrderItemRequest
    {
        [Required]
        public int ItemID { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Required]
        public decimal Subtotal { get; set; }
    }
}