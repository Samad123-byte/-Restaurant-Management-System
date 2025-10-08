using Microsoft.AspNetCore.Http;
using System.Net;
using System.Text.Json;

namespace ShawarmaBackend.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // Call the next middleware in the pipeline
                await _next(context);
            }
            catch (Exception ex)
            {
                // ✅ Log the exception
                _logger.LogError(ex, "An unhandled exception occurred");

                // ✅ Don't interfere with already set status codes (401, 403, etc.)
                if (context.Response.HasStarted)
                {
                    _logger.LogWarning("Response has already started, cannot modify status code");
                    throw;
                }

                // Handle exceptions
                context.Response.ContentType = "application/json";

                // ✅ Keep existing status code if it's already set (e.g., 401, 403)
                if (context.Response.StatusCode == 200)
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                }

                var isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";

                var response = new
                {
                    message = ex.Message,
                    statusCode = context.Response.StatusCode,
                    // ✅ Only include stack trace in development
                    stackTrace = isDevelopment ? ex.StackTrace : null
                };

                var jsonResponse = JsonSerializer.Serialize(response);
                await context.Response.WriteAsync(jsonResponse);
            }
        }
    }

    // Extension method to make it easier to register middleware
    public static class ExceptionMiddlewareExtensions
    {
        public static void UseExceptionMiddleware(this IApplicationBuilder app)
        {
            app.UseMiddleware<ExceptionMiddleware>();
        }
    }
}