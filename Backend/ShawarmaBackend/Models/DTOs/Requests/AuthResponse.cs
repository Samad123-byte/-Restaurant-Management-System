namespace ShawarmaBackend.Models.DTOs.Responses
{
    public class AuthResponse
    {
        public int UserID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string Token { get; set; }
        public string Message { get; set; }
    }
}