// src/services/orderService.js
import apiClient from './apiClient';

const orderService = {
  // Place new order
  async placeOrder(userId, totalAmount, orderDetails) {
    try {
      const response = await apiClient.post('/Order', {
        userID: userId,
        totalAmount: totalAmount,
        orderDetails: orderDetails.map(item => ({
          itemID: item.itemID,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to place order';
    }
  },

  // Get all orders with customer details (Admin only) - ENHANCED
  async getAllOrders() {
    try {
      const response = await apiClient.get('/Order');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch orders';
    }
  },

  // Get orders by user
  async getOrdersByUser(userId) {
    try {
      const response = await apiClient.get(`/Order/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user orders';
    }
  },

  // Get order details with items - ENHANCED
  async getOrderDetails(orderId) {
    try {
      const response = await apiClient.get(`/Order/${orderId}/details`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch order details';
    }
  },

  // Update order status (Admin only)
  async updateOrderStatus(orderId, status) {
    try {
      const response = await apiClient.patch(`/Order/${orderId}/status?status=${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update order status';
    }
  },

  // Search orders (Admin only) - NEW
  async searchOrders(searchTerm = null, status = null, fromDate = null, toDate = null) {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('searchTerm', searchTerm);
      if (status && status !== 'All') params.append('status', status);
      if (fromDate) params.append('fromDate', fromDate);
      if (toDate) params.append('toDate', toDate);
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await apiClient.get(`/Order/search${queryString}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to search orders';
    }
  },

  // Get order statistics (Admin only) - NEW
  async getOrderStatistics() {
    try {
      const response = await apiClient.get('/Order/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch order statistics';
    }
  },
};

export default orderService;