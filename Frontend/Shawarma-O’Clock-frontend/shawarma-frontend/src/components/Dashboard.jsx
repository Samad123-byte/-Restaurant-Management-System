import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, TrendingUp, ShoppingBag, DollarSign, Clock, Package, ArrowLeft, RefreshCw, Search, Eye, User, Calendar } from 'lucide-react';
import { useSnackbar } from 'notistack';
import * as Chart from 'chart.js';
import dashboardService from '../services/dashboardService';
import orderService from '../services/orderService';

const Dashboard = ({ onBack }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('daily');
  const [activeTab, setActiveTab] = useState('analytics');
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    topItems: [],
    salesByHour: [],
    salesTrend: []
  });

  // Orders state
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);

  const salesChartRef = useRef(null);
  const hourlyChartRef = useRef(null);
  const topItemsChartRef = useRef(null);
  const salesChartInstance = useRef(null);
  const hourlyChartInstance = useRef(null);
  const topItemsChartInstance = useRef(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch data when timeRange changes or component mounts
  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchDashboardData();
    } else {
      fetchOrders();
    }
  }, [timeRange, activeTab]);

  // Auto-refresh every 10 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      console.log('Auto-refreshing dashboard...');
      // Always fetch dashboard data for analytics refresh
      fetchDashboardData();
      if (activeTab === 'orders') {
        fetchOrders();
      }
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, timeRange, activeTab]);

  useEffect(() => {
    if (!loading && dashboardData && activeTab === 'analytics') {
      createCharts();
    }
    
    return () => {
      if (salesChartInstance.current) salesChartInstance.current.destroy();
      if (hourlyChartInstance.current) hourlyChartInstance.current.destroy();
      if (topItemsChartInstance.current) topItemsChartInstance.current.destroy();
    };
  }, [loading, dashboardData, timeRange, activeTab]);

  // Filter orders when search term or status changes
  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, orders]);

  const normalizeData = (data) => {
    if (Array.isArray(data)) {
      return data.map(item => normalizeData(item));
    }
    
    if (data && typeof data === 'object') {
      const normalized = {};
      for (let key in data) {
        const lowerKey = key.charAt(0).toLowerCase() + key.slice(1);
        normalized[lowerKey] = data[key];
      }
      return normalized;
    }
    
    return data;
  };

  const fetchDashboardData = async () => {
    try {
      // REMOVED the early return - always fetch analytics data for auto-refresh
      setLoading(true);
      
      const [summaryRaw, topItemsRaw, hourlyRaw] = await Promise.all([
        dashboardService.getDashboardSummary(),
        dashboardService.getTopSellingItems(5),
        dashboardService.getSalesByHour()
      ]);

      const summary = normalizeData(summaryRaw);
      const topItems = normalizeData(topItemsRaw);
      const hourly = normalizeData(hourlyRaw);

      let salesTrendRaw = [];
      if (timeRange === 'daily') {
        salesTrendRaw = await dashboardService.getDailySales();
      } else if (timeRange === 'monthly') {
        salesTrendRaw = await dashboardService.getMonthlySales();
      } else {
        salesTrendRaw = await dashboardService.getYearlySales();
      }

      const salesTrend = normalizeData(salesTrendRaw);

      const summaryData = summary.$values || summary.data || summary;
      const topItemsData = topItems.$values || topItems.data || topItems;
      const hourlyData = hourly.$values || hourly.data || hourly;
      const salesTrendData = salesTrend.$values || salesTrend.data || salesTrend;

      const totalSales = summaryData.totalRevenue || summaryData.todaySales || summaryData.totalSales || 0;
      const totalOrders = summaryData.todayOrders || summaryData.totalOrders || 0;
      const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

      const processedTopItems = Array.isArray(topItemsData) 
        ? topItemsData.map(item => ({
            ...item,
            quantity: item.totalSold || item.quantity || 0,
            revenue: item.totalRevenue || item.revenue || 0
          }))
        : [];

      let processedSalesTrend = [];
      if (Array.isArray(salesTrendData)) {
        processedSalesTrend = salesTrendData;
      } else if (salesTrendData && typeof salesTrendData === 'object') {
        processedSalesTrend = [{
          label: timeRange.charAt(0).toUpperCase() + timeRange.slice(1),
          sales: salesTrendData.totalSales || 0,
          orders: salesTrendData.totalOrders || 0
        }];
      }

      setDashboardData({
        totalSales: totalSales,
        totalOrders: totalOrders,
        avgOrderValue: avgOrderValue,
        topItems: processedTopItems,
        salesByHour: Array.isArray(hourlyData) ? hourlyData : [],
        salesTrend: processedSalesTrend
      });

      setLoading(false);
      console.log('✅ Dashboard data updated:', {
        totalSales,
        totalOrders,
        avgOrderValue,
        topItemsCount: processedTopItems.length,
        hourlyDataCount: (Array.isArray(hourlyData) ? hourlyData : []).length,
        salesTrendCount: processedSalesTrend.length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      enqueueSnackbar('❌ Failed to load dashboard data', { variant: 'error' });
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const ordersRaw = await orderService.getAllOrders();
      const normalized = normalizeData(ordersRaw);
      const ordersData = normalized.$values || normalized.data || normalized;
      
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      console.log('✅ Orders updated:', ordersData.length);
    } catch (error) {
      console.error('Error fetching orders:', error);
      enqueueSnackbar('❌ Failed to load orders', { variant: 'error' });
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const order = orders.find(o => (o.orderID || o.orderId) === orderId);
      console.log('Selected Order Data:', order);
      setSelectedOrder(order);
      
      const detailsRaw = await orderService.getOrderDetails(orderId);
      const normalized = normalizeData(detailsRaw);
      const detailsData = normalized.$values || normalized.data || normalized;
      
      setOrderDetails(Array.isArray(detailsData) ? detailsData : []);
    } catch (error) {
      console.error('Error fetching order details:', error);
      enqueueSnackbar('❌ Failed to load order details', { variant: 'error' });
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => 
        (order.status || order.orderStatus) === statusFilter
      );
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(order => {
        const orderId = (order.orderID || order.orderId || '').toString();
        const userName = (order.customerName || order.userName || order.name || '').toLowerCase();
        const email = (order.customerEmail || order.userEmail || order.email || '').toLowerCase();
        
        return orderId.includes(search) || 
               userName.includes(search) || 
               email.includes(search);
      });
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      enqueueSnackbar('✅ Order status updated', { variant: 'success' });
      
      // Refresh both orders AND dashboard data after status update
      await Promise.all([
        fetchOrders(),
        fetchDashboardData()
      ]);
      
      if (selectedOrder && (selectedOrder.orderID || selectedOrder.orderId) === orderId) {
        fetchOrderDetails(orderId);
      }
    } catch (error) {
      enqueueSnackbar('❌ Failed to update status', { variant: 'error' });
    }
  };

  const createCharts = () => {
    if (salesChartInstance.current) salesChartInstance.current.destroy();
    if (hourlyChartInstance.current) hourlyChartInstance.current.destroy();
    if (topItemsChartInstance.current) topItemsChartInstance.current.destroy();

    Chart.Chart.register(
      Chart.CategoryScale,
      Chart.LinearScale,
      Chart.BarElement,
      Chart.LineElement,
      Chart.PointElement,
      Chart.BarController,
      Chart.LineController,
      Chart.Title,
      Chart.Tooltip,
      Chart.Legend,
      Chart.Filler
    );

    // Sales Trend Chart
    if (salesChartRef.current && dashboardData.salesTrend.length > 0) {
      const ctx = salesChartRef.current.getContext('2d');
      salesChartInstance.current = new Chart.Chart(ctx, {
        type: 'line',
        data: {
          labels: dashboardData.salesTrend.map(d => d.label || d.date || d.period || d.day || d.month || d.year),
          datasets: [{
            label: 'Sales (Rs)',
            data: dashboardData.salesTrend.map(d => d.sales || d.totalSales || d.amount || 0),
            borderColor: 'rgb(245, 158, 11)',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: 'rgb(245, 158, 11)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: `Sales Trend (${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)})`,
              font: { size: 18, weight: 'bold' },
              color: '#92400e'
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              callbacks: {
                label: function(context) {
                  return 'Sales: Rs ' + context.parsed.y.toLocaleString();
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return 'Rs ' + value.toLocaleString();
                }
              }
            }
          }
        }
      });
    }

    // Hourly Sales Chart
    if (hourlyChartRef.current && dashboardData.salesByHour.length > 0) {
      const ctx = hourlyChartRef.current.getContext('2d');
      hourlyChartInstance.current = new Chart.Chart(ctx, {
        type: 'bar',
        data: {
          labels: dashboardData.salesByHour.map(d => d.hour || d.time || d.period),
          datasets: [{
            label: 'Sales (Rs)',
            data: dashboardData.salesByHour.map(d => d.sales || d.totalSales || d.amount || 0),
            backgroundColor: 'rgba(249, 115, 22, 0.8)',
            borderRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Peak Hours Analysis',
              font: { size: 18, weight: 'bold' },
              color: '#92400e'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return 'Rs ' + value.toLocaleString();
                }
              }
            }
          }
        }
      });
    }

    // Top Items Chart
    if (topItemsChartRef.current && dashboardData.topItems.length > 0) {
      const ctx = topItemsChartRef.current.getContext('2d');
      topItemsChartInstance.current = new Chart.Chart(ctx, {
        type: 'bar',
        data: {
          labels: dashboardData.topItems.map(item => item.name || item.itemName),
          datasets: [{
            label: 'Revenue (Rs)',
            data: dashboardData.topItems.map(item => item.revenue || item.totalRevenue || 0),
            backgroundColor: [
              'rgba(245, 158, 11, 0.8)',
              'rgba(249, 115, 22, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(139, 92, 246, 0.8)',
              'rgba(34, 197, 94, 0.8)'
            ],
            borderRadius: 8
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Top 5 Selling Items',
              font: { size: 18, weight: 'bold' },
              color: '#92400e'
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return 'Rs ' + value.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && activeTab === 'analytics') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-amber-800 font-semibold text-xl">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header Bar */}
      <div className="bg-white shadow-sm border-b border-amber-100 px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-amber-700 font-semibold hover:text-amber-900 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded"
              />
              Auto-refresh (10s)
            </label>
            <button
              onClick={() => {
                fetchDashboardData();
                fetchOrders();
              }}
              className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header with Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-amber-800">Admin Dashboard</h1>
              <p className="text-gray-600 text-sm mt-1">Real-time sales insights and order management</p>
            </div>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-lg border-2 border-amber-100">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-5 py-2.5 rounded-lg transition-all font-semibold ${
                activeTab === 'analytics' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-amber-50'
              }`}
            >
              📊 Analytics
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-5 py-2.5 rounded-lg transition-all font-semibold ${
                activeTab === 'orders' 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-amber-50'
              }`}
            >
              📦 Orders
            </button>
          </div>
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <>
            {/* Time Range Selector */}
            <div className="flex justify-center mb-6">
              <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-lg border-2 border-amber-100">
                <button
                  onClick={() => setTimeRange('daily')}
                  className={`px-5 py-2.5 rounded-lg transition-all font-semibold ${
                    timeRange === 'daily' 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-amber-50'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setTimeRange('monthly')}
                  className={`px-5 py-2.5 rounded-lg transition-all font-semibold ${
                    timeRange === 'monthly' 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-amber-50'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setTimeRange('yearly')}
                  className={`px-5 py-2.5 rounded-lg transition-all font-semibold ${
                    timeRange === 'yearly' 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' 
                      : 'text-gray-600 hover:bg-amber-50'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-amber-100 transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-600 text-sm font-semibold uppercase">Total Sales</h3>
                  <DollarSign className="w-10 h-10 text-amber-500" />
                </div>
                <p className="text-3xl font-bold text-gray-800">Rs {dashboardData.totalSales.toLocaleString()}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100 transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-600 text-sm font-semibold uppercase">Total Orders</h3>
                  <ShoppingBag className="w-10 h-10 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.totalOrders}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-100 transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-600 text-sm font-semibold uppercase">Avg Order</h3>
                  <TrendingUp className="w-10 h-10 text-purple-500" />
                </div>
                <p className="text-3xl font-bold text-gray-800">Rs {dashboardData.avgOrderValue.toLocaleString()}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-pink-100 transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-600 text-sm font-semibold uppercase">Top Items</h3>
                  <Package className="w-10 h-10 text-pink-500" />
                </div>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.topItems.length}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-amber-100">
                <div className="h-80">
                  <canvas ref={salesChartRef}></canvas>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-100">
                <div className="h-80">
                  <canvas ref={hourlyChartRef}></canvas>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 border-2 border-amber-100">
                <div className="h-80">
                  <canvas ref={topItemsChartRef}></canvas>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-100">
                <h3 className="text-lg font-bold text-amber-800 mb-4">Top Sellers</h3>
                <div className="space-y-3">
                  {dashboardData.topItems.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex justify-between p-2 border-b">
                      <div>
                        <p className="font-semibold">{item.name || item.itemName}</p>
                        <p className="text-sm text-gray-500">{item.quantity} sold</p>
                      </div>
                      <p className="font-bold text-amber-700">Rs {(item.revenue || 0).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <>
            {/* Search and Filter */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-amber-100 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by Order ID, Customer Name, or Email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 outline-none"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 outline-none"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">Order ID</th>
                      <th className="px-6 py-4 text-left">Customer</th>
                      <th className="px-6 py-4 text-left">Date</th>
                      <th className="px-6 py-4 text-left">Amount</th>
                      <th className="px-6 py-4 text-left">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <tr key={index} className="border-b hover:bg-amber-50 transition-colors">
                        <td className="px-6 py-4 font-semibold">#{order.orderID || order.orderId}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold">{order.customerName || order.userName || order.name || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{order.customerEmail || order.userEmail || order.email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {new Date(order.orderDate || order.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-bold text-amber-700">
                          Rs {(order.totalAmount || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status || order.orderStatus)}`}>
                            {order.status || order.orderStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => fetchOrderDetails(order.orderID || order.orderId)}
                            className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 mx-auto"
                          >
                            <Eye size={16} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>No orders found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Order Details #{selectedOrder.orderID || selectedOrder.orderId}</h2>
                      <button
                        onClick={() => {
                          setSelectedOrder(null);
                          setOrderDetails([]);
                        }}
                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-100">
                        <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                          <User size={20} />
                          Customer Information
                        </h3>
                        <p className="text-gray-700"><span className="font-semibold">Name:</span> {selectedOrder.customerName || selectedOrder.userName || selectedOrder.name || 'N/A'}</p>
                        <p className="text-gray-700"><span className="font-semibold">Email:</span> {selectedOrder.customerEmail || selectedOrder.userEmail || selectedOrder.email || 'N/A'}</p>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-100">
                        <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                          <Calendar size={20} />
                          Order Information
                        </h3>
                        <p className="text-gray-700"><span className="font-semibold">Date:</span> {new Date(selectedOrder.orderDate || selectedOrder.date).toLocaleString()}</p>
                        <p className="text-gray-700"><span className="font-semibold">Total:</span> Rs {(selectedOrder.totalAmount || 0).toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="mb-6 bg-purple-50 p-4 rounded-xl border-2 border-purple-100">
                      <h3 className="font-bold text-purple-800 mb-3">Update Order Status</h3>
                      <div className="flex gap-2 flex-wrap">
                        {['Pending', 'In Progress', 'Completed', 'Cancelled'].map(status => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(selectedOrder.orderID || selectedOrder.orderId, status)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                              (selectedOrder.status || selectedOrder.orderStatus) === status
                                ? 'bg-purple-600 text-white'
                                : 'bg-white border-2 border-purple-200 text-purple-700 hover:bg-purple-100'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Package size={20} />
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {orderDetails.map((detail, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-gray-800">{detail.itemName || detail.name}</p>
                              <p className="text-sm text-gray-500">
                                Quantity: {detail.quantity} × Rs {(detail.price || detail.itemPrice || 0).toLocaleString()}
                              </p>
                            </div>
                            <p className="font-bold text-amber-700 text-lg">
                              Rs {(detail.subtotal || (detail.quantity * (detail.price || detail.itemPrice || 0))).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>

                      {orderDetails.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <p>Loading order details...</p>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t-2 border-gray-300">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-gray-800">Total Amount:</span>
                          <span className="text-2xl font-bold text-amber-700">
                            Rs {(selectedOrder.totalAmount || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;