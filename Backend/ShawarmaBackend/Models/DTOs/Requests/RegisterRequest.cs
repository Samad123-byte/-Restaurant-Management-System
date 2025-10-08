using System.ComponentModel.DataAnnotations;

namespace ShawarmaBackend.Models.DTOs.Requests
{
    public class RegisterRequest
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        public string Role { get; set; } = "Customer";
    }
}