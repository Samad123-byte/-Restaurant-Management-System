using ShawarmaBackend.Models.DTOs.Responses;
using ShawarmaBackend.Repositories.Interfaces;
using ShawarmaBackend.Services.Interfaces;

namespace ShawarmaBackend.Services.Implementations
{
    public class DashboardService : IDashboardService
    {
        private readonly IDashboardRepository _dashboardRepository;

        public DashboardService(IDashboardRepository dashboardRepository)
        {
            _dashboardRepository = dashboardRepository;
        }

        public async Task<DashboardSummaryResponse> GetDashboardSummary()
        {
            return await _dashboardRepository.GetDashboardSummary();
        }

        public async Task<object> GetDailySales(DateTime? date)
        {
            return await _dashboardRepository.GetDailySales(date);
        }

        public async Task<object> GetMonthlySales(int? month, int? year)
        {
            // Validate month
            if (month.HasValue && (month.Value < 1 || month.Value > 12))
            {
                throw new ArgumentException("Month must be between 1 and 12");
            }

            // Validate year
            if (year.HasValue && (year.Value < 2000 || year.Value > DateTime.Now.Year))
            {
                throw new ArgumentException("Invalid year");
            }

            return await _dashboardRepository.GetMonthlySales(month, year);
        }

        public async Task<List<object>> GetYearlySales(int? year)
        {
            // Validate year
            if (year.HasValue && (year.Value < 2000 || year.Value > DateTime.Now.Year))
            {
                throw new ArgumentException("Invalid year");
            }

            return await _dashboardRepository.GetYearlySales(year);
        }

        public async Task<List<object>> GetTopSellingItems(int topN)
        {
            // Validate topN
            if (topN <= 0 || topN > 100)
            {
                topN = 10; // Default to 10
            }

            return await _dashboardRepository.GetTopSellingItems(topN);
        }

        public async Task<List<object>> GetSalesByHour(DateTime? date)
        {
            return await _dashboardRepository.GetSalesByHour(date);
        }
    }
}