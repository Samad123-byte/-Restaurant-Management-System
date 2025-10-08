using Microsoft.Data.SqlClient;
using ShawarmaBackend.Data;
using ShawarmaBackend.Models.DTOs.Responses;
using ShawarmaBackend.Repositories.Interfaces;
using System.Data;

namespace ShawarmaBackend.Repositories.Implementations
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly DatabaseContext _dbContext;

        public DashboardRepository(DatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DashboardSummaryResponse> GetDashboardSummary()
        {
            using var connection = _dbContext.GetConnection();
            using var command = new SqlCommand("sp_GetDashboardSummary", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new DashboardSummaryResponse
                {
                    TodayOrders = reader.GetInt32(0),
                    TodaySales = reader.GetDecimal(1),
                    AvailableItems = reader.GetInt32(2),
                    TotalCustomers = reader.GetInt32(3),
                    TotalRevenue = reader.GetDecimal(4)
                };
            }

            return null;
        }

        public async Task<object> GetDailySales(DateTime? date)
        {
            using var connection = _dbContext.GetConnection();
            using var command = new SqlCommand("sp_GetDailySales", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            if (date.HasValue)
                command.Parameters.AddWithValue("@Date", date.Value);

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new
                {
                    TotalOrders = reader.GetInt32(0),
                    TotalSales = reader.GetDecimal(1),
                    AverageSale = reader.GetDecimal(2)
                };
            }

            return null;
        }

        public async Task<object> GetMonthlySales(int? month, int? year)
        {
            using var connection = _dbContext.GetConnection();
            using var command = new SqlCommand("sp_GetMonthlySales", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            if (month.HasValue)
                command.Parameters.AddWithValue("@Month", month.Value);
            if (year.HasValue)
                command.Parameters.AddWithValue("@Year", year.Value);

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new
                {
                    TotalOrders = reader.GetInt32(0),
                    TotalSales = reader.GetDecimal(1),
                    AverageSale = reader.GetDecimal(2)
                };
            }

            return null;
        }

        public async Task<List<object>> GetYearlySales(int? year)
        {
            var yearlySales = new List<object>();

            using var connection = _dbContext.GetConnection();
            using var command = new SqlCommand("sp_GetYearlySales", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            if (year.HasValue)
                command.Parameters.AddWithValue("@Year", year.Value);

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                yearlySales.Add(new
                {
                    Month = reader.GetInt32(0),
                    TotalOrders = reader.GetInt32(1),
                    TotalSales = reader.GetDecimal(2)
                });
            }

            return yearlySales;
        }

        public async Task<List<object>> GetTopSellingItems(int topN)
        {
            var topItems = new List<object>();

            using var connection = _dbContext.GetConnection();
            using var command = new SqlCommand("sp_GetTopSellingItems", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            command.Parameters.AddWithValue("@TopN", topN);
            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                topItems.Add(new
                {
                    ItemID = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Category = reader.GetString(2),
                    TotalSold = reader.GetInt32(3),
                    TotalRevenue = reader.GetDecimal(4)
                });
            }

            return topItems;
        }

        public async Task<List<object>> GetSalesByHour(DateTime? date)
        {
            var salesByHour = new List<object>();

            using var connection = _dbContext.GetConnection();
            using var command = new SqlCommand("sp_GetSalesByHour", connection)
            {
                CommandType = CommandType.StoredProcedure
            };

            if (date.HasValue)
                command.Parameters.AddWithValue("@Date", date.Value);

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                salesByHour.Add(new
                {
                    Hour = reader.GetInt32(0),
                    TotalOrders = reader.GetInt32(1),
                    TotalSales = reader.GetDecimal(2)
                });
            }

            return salesByHour;
        }
    }
}