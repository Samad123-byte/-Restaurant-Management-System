using System.ComponentModel.DataAnnotations;

namespace ShawarmaBackend.Models.DTOs.Requests
{
    public class AddMenuItemRequest
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Category { get; set; }

        [Required]
        [Range(0.01, 999999.99)]
        public decimal Price { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }

        public string ImagePath { get; set; }

        public bool IsAvailable { get; set; } = true;
    }
}