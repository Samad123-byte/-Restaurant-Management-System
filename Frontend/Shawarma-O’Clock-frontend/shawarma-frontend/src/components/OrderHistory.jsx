import React, { useEffect, useState } from "react";
import orderService from "../services/orderService";
import { useAuth } from "../context/AuthContext";
import { Clock, Receipt, ChevronDown, ChevronUp, Package, Calendar, DollarSign, CheckCircle, AlertCircle, ArrowLeft, Sparkles, TrendingUp, Star } from "lucide-react";

const OrderHistory = ({ onBack }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [details, setDetails] = useState([]);

  // ✅ Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getOrdersByUser(user.userID);
        setOrders(res);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user.userID]);

  // ✅ Fetch details for a specific order
  const toggleDetails = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }

    try {
      const res = await orderService.getOrderDetails(orderId);
      setDetails(res);
      setExpandedOrder(orderId);
    } catch (err) {
      console.error("Failed to load details:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-teal-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Receipt className="w-10 h-10 text-teal-400" />
            </div>
          </div>
          <p className="text-white font-bold text-3xl mb-3">Loading History...</p>
          <p className="text-white/50 text-lg">Fetching your delicious orders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      {/* Header */}
      <div className="relative bg-white/5 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-6 sticky top-0 z-20 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            {/* Icon with Glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl blur-xl opacity-50"></div>
              <div className="relative bg-gradient-to-br from-teal-500 to-cyan-500 p-4 rounded-3xl shadow-2xl">
                <Receipt className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-black mb-2">
                <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Order History
                </span>
              </h1>
              <p className="text-white/60 text-base">Track all your delicious orders 📋</p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="group relative flex items-center gap-2 px-6 py-4 rounded-2xl transition-all font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 group-hover:from-teal-600 group-hover:to-cyan-600 transition-all"></div>
            <ArrowLeft size={20} className="relative z-10 text-white group-hover:-translate-x-1 transition-transform" />
            <span className="relative z-10 text-white hidden sm:inline">Back</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto p-4 sm:p-8">
        {orders.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-16 text-center">
            {/* Empty State Icon */}
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full blur-2xl opacity-30"></div>
              <div className="relative bg-gradient-to-br from-teal-500/20 to-cyan-500/20 w-32 h-32 rounded-full flex items-center justify-center border border-teal-500/30">
                <Receipt className="w-16 h-16 text-teal-400" />
              </div>
            </div>
            <h2 className="text-4xl font-black text-white mb-4">No Orders Yet</h2>
            <p className="text-white/60 mb-8 text-xl max-w-md mx-auto">
              You haven't placed any orders yet. Start ordering delicious food!
            </p>
            <button
              onClick={onBack}
              className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 group-hover:from-teal-600 group-hover:to-cyan-600 transition-all"></div>
              <Sparkles className="relative z-10 w-6 h-6 text-white" />
              <span className="relative z-10 text-white text-lg">Browse Menu</span>
            </button>
          </div>
        ) : (
          <div>
            {/* Premium Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {/* Total Orders */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-all"></div>
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-xl">
                      <Package className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-white/70 font-semibold text-lg">Total Orders</span>
                  </div>
                  <p className="text-5xl font-black text-white">{orders.length}</p>
                  <div className="mt-3 flex items-center gap-2 text-blue-400 text-sm">
                    <TrendingUp size={16} />
                    <span>All time</span>
                  </div>
                </div>
              </div>

              {/* Completed Orders */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-all"></div>
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-xl">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-white/70 font-semibold text-lg">Completed</span>
                  </div>
                  <p className="text-5xl font-black text-white">
                    {orders.filter(o => o.status === "Completed").length}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle size={16} />
                    <span>Delivered</span>
                  </div>
                </div>
              </div>

              {/* Total Spent */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition-all"></div>
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-4 rounded-2xl shadow-xl">
                      <DollarSign className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-white/70 font-semibold text-lg">Total Spent</span>
                  </div>
                  <p className="text-5xl font-black text-white">
                    Rs. {orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(0)}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-teal-400 text-sm">
                    <Star size={16} className="fill-teal-400" />
                    <span>Lifetime value</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
              {orders.map((order, index) => (
                <div
                  key={order.orderID}
                  className="group relative"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Glow Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl blur opacity-0 group-hover:opacity-30 transition-all duration-500"></div>
                  
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300 shadow-2xl">
                    <div
                      className="p-8 cursor-pointer"
                      onClick={() => toggleDetails(order.orderID)}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        {/* Left: Order Info */}
                        <div className="flex items-start gap-5">
                          <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl blur-md opacity-50"></div>
                            <div className="relative bg-gradient-to-br from-teal-500 to-cyan-500 p-5 rounded-2xl shadow-xl">
                              <Receipt className="w-8 h-8 text-white" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-3xl font-black text-white mb-3">
                              Order #{order.orderID}
                            </h3>
                            <div className="flex flex-wrap gap-3 text-sm">
                              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-xl text-white/80">
                                <Calendar size={16} className="text-teal-400" />
                                {new Date(order.orderDate).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-xl text-white/80">
                                <Clock size={16} className="text-cyan-400" />
                                {new Date(order.orderDate).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Amount & Status */}
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm text-white/50 mb-2 font-semibold uppercase tracking-wider">Total</p>
                            <p className="text-4xl font-black bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                              Rs. {order.totalAmount.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold shadow-xl ${
                                order.status === "Completed"
                                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                                  : "bg-gradient-to-r from-orange-500 to-amber-600 text-white"
                              }`}
                            >
                              {order.status === "Completed" ? (
                                <CheckCircle size={18} />
                              ) : (
                                <AlertCircle size={18} />
                              )}
                              {order.status}
                            </span>
                            <div className="text-teal-400 transition-transform group-hover:scale-110">
                              {expandedOrder === order.orderID ? (
                                <ChevronUp size={28} strokeWidth={3} />
                              ) : (
                                <ChevronDown size={28} strokeWidth={3} />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedOrder === order.orderID && details.length > 0 && (
                      <div className="bg-white/5 border-t border-white/10 p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-3 rounded-xl">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="font-black text-white text-2xl">Order Items</h4>
                        </div>
                        <div className="grid gap-4">
                          {details.map((d, idx) => (
                            <div
                              key={idx}
                              className="group/item relative bg-white/5 backdrop-blur-sm border border-white/10 px-6 py-5 rounded-2xl hover:bg-white/10 transition-all hover:border-white/20"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="bg-gradient-to-br from-teal-500 to-cyan-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl">
                                    {d.quantity}x
                                  </div>
                                  <span className="font-bold text-white text-xl">
                                    {d.itemName}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-white/50 mb-1 uppercase tracking-wider font-semibold">Subtotal</p>
                                  <p className="text-2xl font-black bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                    Rs. {d.subtotal.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Order Summary */}
                        <div className="mt-8 pt-6 border-t border-white/10">
                          <div className="relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl blur opacity-30"></div>
                            <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                              <div className="flex justify-between items-center">
                                <span className="text-2xl font-bold text-white">Order Total</span>
                                <span className="text-5xl font-black bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                  Rs. {order.totalAmount.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default OrderHistory;