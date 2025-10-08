using System.ComponentModel.DataAnnotations;

namespace ShawarmaBackend.Models.DTOs.Requests
{
    public class UpdateMenuItemRequest
    {
        [Required]
        public int ItemID { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Category { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required]
        public int Quantity { get; set; }

        public string ImagePath { get; set; }

        public bool IsAvailable { get; set; }
    }
}