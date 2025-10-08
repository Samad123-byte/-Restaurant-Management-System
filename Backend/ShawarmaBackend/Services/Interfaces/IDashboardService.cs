using ShawarmaBackend.Models.DTOs.Responses;

namespace ShawarmaBackend.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardSummaryResponse> GetDashboardSummary();
        Task<object> GetDailySales(DateTime? date);
        Task<object> GetMonthlySales(int? month, int? year);
        Task<List<object>> GetYearlySales(int? year);
        Task<List<object>> GetTopSellingItems(int topN);
        Task<List<object>> GetSalesByHour(DateTime? date);
    }
}