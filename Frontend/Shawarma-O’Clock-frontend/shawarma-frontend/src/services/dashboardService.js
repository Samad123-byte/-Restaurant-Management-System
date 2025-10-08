// src/services/dashboardService.js
import apiClient from './apiClient';

const dashboardService = {
  // Get dashboard summary (Admin only)
  async getDashboardSummary() {
    try {
      const response = await apiClient.get('/Dashboard/summary');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch dashboard summary';
    }
  },

  // Get daily sales (Admin only)
  async getDailySales(date = null) {
    try {
      const params = date ? `?date=${date}` : '';
      const response = await apiClient.get(`/Dashboard/daily-sales${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch daily sales';
    }
  },

  // Get monthly sales (Admin only)
  async getMonthlySales(month = null, year = null) {
    try {
      const params = new URLSearchParams();
      if (month) params.append('month', month);
      if (year) params.append('year', year);
      const queryString = params.toString() ? `?${params.toString()}` : '';
      
      const response = await apiClient.get(`/Dashboard/monthly-sales${queryString}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch monthly sales';
    }
  },

  // Get yearly sales (Admin only)
  async getYearlySales(year = null) {
    try {
      const params = year ? `?year=${year}` : '';
      const response = await apiClient.get(`/Dashboard/yearly-sales${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch yearly sales';
    }
  },

  // Get top selling items (Admin only)
  async getTopSellingItems(topN = 5) {
    try {
      const response = await apiClient.get(`/Dashboard/top-selling-items?topN=${topN}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch top selling items';
    }
  },

  // Get sales by hour (Admin only)
  async getSalesByHour(date = null) {
    try {
      const params = date ? `?date=${date}` : '';
      const response = await apiClient.get(`/Dashboard/sales-by-hour${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch sales by hour';
    }
  },
};

export default dashboardService;