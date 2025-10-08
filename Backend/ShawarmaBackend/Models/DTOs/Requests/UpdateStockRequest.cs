using System.ComponentModel.DataAnnotations;

namespace ShawarmaBackend.Models.DTOs.Requests
{
    public class UpdateStockRequest
    {
        [Required]
        public int ItemID { get; set; }

        [Required]
        public int Quantity { get; set; }
    }
}
