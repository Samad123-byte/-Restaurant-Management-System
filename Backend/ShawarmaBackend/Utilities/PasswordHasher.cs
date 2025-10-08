using BCrypt.Net;

namespace ShawarmaBackend.Utilities
{
    public static class PasswordHasher
    {
        /// <summary>
        /// Hashes a password using BCrypt
        /// </summary>
        public static string HashPassword(string password)
        {
            // Generate a hash with work factor 11 (matches your $2a$11$ prefix)
            return BCrypt.Net.BCrypt.HashPassword(password, 11);
        }

        /// <summary>
        /// Verifies a password against a BCrypt hash
        /// </summary>
        public static bool VerifyPassword(string password, string hash)
        {
            try
            {
                // BCrypt.Net.BCrypt.Verify handles the comparison
                return BCrypt.Net.BCrypt.Verify(password, hash);
            }
            catch
            {
                // If there's any error in verification, return false
                return false;
            }
        }
    }
}