// src/services/menuService.js
import apiClient from './apiClient';

const menuService = {
  // Get all menu items (Admin)
  async getAllMenuItems() {
    try {
      const response = await apiClient.get('/Menu');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch menu items';
    }
  },

  // Get available menu items (Public)
  async getAvailableMenuItems() {
    try {
      const response = await apiClient.get('/Menu/available');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch available items';
    }
  },

  // Get menu item by ID
  async getMenuItemById(id) {
    try {
      const response = await apiClient.get(`/Menu/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch item details';
    }
  },

  // Add new menu item (Admin only)
  async addMenuItem(itemData) {
    try {
      const response = await apiClient.post('/Menu', itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to add menu item';
    }
  },

  // Update menu item (Admin only)
  async updateMenuItem(itemData) {
    try {
      const response = await apiClient.put('/Menu', itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update menu item';
    }
  },

  // Delete menu item (Admin only)
  async deleteMenuItem(id) {
    try {
      const response = await apiClient.delete(`/Menu/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete menu item';
    }
  },

  // Update stock (Admin only)
  async updateStock(id, quantity) {
    try {
      const response = await apiClient.patch(`/Menu/stock/${id}?quantity=${quantity}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update stock';
    }
  },
};

export default menuService;