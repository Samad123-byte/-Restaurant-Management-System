using ShawarmaBackend.Models.DTOs.Responses;

namespace ShawarmaBackend.Repositories.Interfaces
{
    public interface IDashboardRepository
    {
        Task<DashboardSummaryResponse> GetDashboardSummary();
        Task<object> GetDailySales(DateTime? date);
        Task<object> GetMonthlySales(int? month, int? year);
        Task<List<object>> GetYearlySales(int? year);
        Task<List<object>> GetTopSellingItems(int topN);
        Task<List<object>> GetSalesByHour(DateTime? date);
    }
}