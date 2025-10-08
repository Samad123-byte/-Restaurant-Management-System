namespace ShawarmaBackend.Models.DTOs.Responses
{
    public class DashboardSummaryResponse
    {
        public int TodayOrders { get; set; }
        public decimal TodaySales { get; set; }
        public int AvailableItems { get; set; }
        public int TotalCustomers { get; set; }
        public decimal TotalRevenue { get; set; }
    }
}