using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShawarmaBackend.Services.Interfaces;

namespace ShawarmaBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // 🔒 ALL ENDPOINTS REQUIRE ADMIN ROLE
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(IDashboardService dashboardService, ILogger<DashboardController> logger)
        {
            _dashboardService = dashboardService;
            _logger = logger;
        }

        // 🔒 ADMIN ONLY - Dashboard summary with KPIs
        [HttpGet("summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            try
            {
                var summary = await _dashboardService.GetDashboardSummary();
                return Ok(summary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting dashboard summary");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // 🔒 ADMIN ONLY - Daily sales report
        [HttpGet("daily-sales")]
        public async Task<IActionResult> GetDailySales([FromQuery] DateTime? date)
        {
            try
            {
                var sales = await _dashboardService.GetDailySales(date);
                return Ok(sales);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting daily sales");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // 🔒 ADMIN ONLY - Monthly sales report
        [HttpGet("monthly-sales")]
        public async Task<IActionResult> GetMonthlySales([FromQuery] int? month, [FromQuery] int? year)
        {
            try
            {
                var sales = await _dashboardService.GetMonthlySales(month, year);
                return Ok(sales);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting monthly sales");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // 🔒 ADMIN ONLY - Yearly sales report
        [HttpGet("yearly-sales")]
        public async Task<IActionResult> GetYearlySales([FromQuery] int? year)
        {
            try
            {
                var sales = await _dashboardService.GetYearlySales(year);
                return Ok(sales);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting yearly sales");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // 🔒 ADMIN ONLY - Top selling items analytics
        [HttpGet("top-selling-items")]
        public async Task<IActionResult> GetTopSellingItems([FromQuery] int topN = 5)
        {
            try
            {
                var items = await _dashboardService.GetTopSellingItems(topN);
                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting top-selling items");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // 🔒 ADMIN ONLY - Peak hours analysis
        [HttpGet("sales-by-hour")]
        public async Task<IActionResult> GetSalesByHour([FromQuery] DateTime? date)
        {
            try
            {
                var sales = await _dashboardService.GetSalesByHour(date);
                return Ok(sales);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting sales by hour");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}