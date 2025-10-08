// src/services/authService.js
import apiClient from './apiClient';

const authService = {
  // Register new user
  async register(name, email, password, role = 'Customer') {
    try {
      const response = await apiClient.post('/Auth/register', {
        name,
        email,
        password,
        role,
      });
      
      // Store token and user info
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          userID: response.data.userID,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        }));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  },

  // Login user
  async login(email, password) {
    try {
      const response = await apiClient.post('/Auth/login', {
        email,
        password,
      });
      
      // Store token and user info
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          userID: response.data.userID,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        }));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Check if user is admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === 'Admin';
  },

  // Get token
  getToken() {
    return localStorage.getItem('token');
  },
};

export default authService;