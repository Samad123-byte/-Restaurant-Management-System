import React, { useEffect, useState } from "react";
import menuService from "../services/menuService";
import orderService from "../services/orderService";
import { useAuth } from "../context/AuthContext";
import { Plus, Minus, Trash2, ShoppingCart, ArrowLeft, ShoppingBag, Search, Sparkles, Check } from "lucide-react";
import { useSnackbar } from "notistack";

const OrderPage = ({ onBack, onNavigate }) => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch available menu items
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await menuService.getAvailableMenuItems();
        setMenuItems(data);
      } catch (error) {
        console.error("Failed to load menu:", error);
        enqueueSnackbar("⚠️ Failed to load menu items", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [enqueueSnackbar]);

  // Add item to cart - WITHOUT notifications to prevent duplicates
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.itemID === item.itemID);
      if (existing) {
        return prev.map((x) =>
          x.itemID === item.itemID ? { ...x, quantity: x.quantity + 1 } : x
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Remove item
  const removeFromCart = (itemID) => {
    const item = cart.find((x) => x.itemID === itemID);
    setCart((prev) => prev.filter((x) => x.itemID !== itemID));
    enqueueSnackbar(`🗑️ ${item.name} removed from cart`, { variant: "info" });
  };

  // Change quantity
  const changeQuantity = (itemID, delta) => {
    setCart((prev) =>
      prev
        .map((x) =>
          x.itemID === itemID
            ? { ...x, quantity: Math.max(1, x.quantity + delta) }
            : x
        )
        .filter((x) => x.quantity > 0)
    );
  };

  const total = cart.reduce((sum, x) => sum + x.price * x.quantity, 0);

  // Place Order - FIXED: Removed duplicate notification
  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      enqueueSnackbar("🛒 Your cart is empty!", { variant: "warning" });
      return;
    }

    setPlacingOrder(true);
    try {
      const orderDetails = cart.map((item) => ({
        itemID: item.itemID,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));
      const result = await orderService.placeOrder(
        user.userID,
        total,
        orderDetails
      );
      
      // SINGLE notification here
      enqueueSnackbar("🎉 Order placed successfully!", { variant: "success" });
      console.log("Order response:", result);
      setCart([]);
      
      // Navigate after a delay
      setTimeout(() => onNavigate("history"), 1500);
    } catch (err) {
      enqueueSnackbar("❌ Failed to place order. Please try again.", { variant: "error" });
      console.error(err);
    } finally {
      setPlacingOrder(false);
    }
  };

  // Filter menu items based on search query
  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-pink-300 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-yellow-400 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-5xl">
              🌯
            </div>
          </div>
          <p className="text-white font-black text-3xl mb-3 animate-pulse">Loading Menu...</p>
          <p className="text-pink-200 text-lg font-medium">Preparing delicious items for you</p>
        </div>
      </div>
    );

  // Group items by category
  const groupedItems = filteredMenuItems.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-orange-600 to-pink-600 shadow-2xl border-b-4 border-yellow-400 px-4 sm:px-6 py-5 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white font-bold hover:text-yellow-300 transition-all group bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-xl hover:shadow-xl border-2 border-white/40 hover:border-yellow-300 hover:scale-105 transform"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
            <span className="text-base">Back</span>
          </button>
          {cart.length > 0 && (
            <div className="relative flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-5 py-2.5 rounded-xl font-black shadow-xl animate-bounce border-2 border-white">
              <ShoppingCart size={20} strokeWidth={3} />
              <span className="text-base">{cart.length} items</span>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse flex items-center justify-center text-xs font-black">
                ✓
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT: Menu */}
          <div className="flex-1">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-3 flex items-center justify-center lg:justify-start gap-3 drop-shadow-2xl">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-2xl shadow-xl animate-pulse border-3 border-white">
                  <ShoppingBag className="w-8 h-8 text-purple-900" strokeWidth={3} />
                </div>
                <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                  Our Menu
                </span>
              </h2>
              <p className="text-pink-100 text-base mb-6 font-bold drop-shadow-lg">
                Tap on any item to add it instantly!
              </p>
              
              {/* Enhanced Search Bar */}
              <div className="relative max-w-2xl mx-auto lg:mx-0">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border-3 border-yellow-400">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-600 w-5 h-5" strokeWidth={3} />
                  <input
                    type="text"
                    placeholder="Search items, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-24 py-3.5 rounded-2xl focus:outline-none focus:ring-3 focus:ring-yellow-400 transition-all text-base font-bold text-purple-900 placeholder-purple-400 bg-transparent"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 font-bold px-4 py-2 rounded-xl transition-all shadow-lg hover:scale-105"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* No Results */}
            {filteredMenuItems.length === 0 ? (
              <div className="text-center py-16 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border-3 border-pink-400">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-6xl">🔍</span>
                </div>
                <p className="text-white text-2xl font-black mb-3">No items found</p>
                <p className="text-pink-200 text-base mb-6 font-medium">
                  Try searching for "{searchQuery}" didn't return any results
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all font-black text-base shadow-xl hover:scale-105 border-3 border-white"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="mb-12">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b-3 border-yellow-400">
                    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2.5 rounded-xl shadow-xl border-2 border-white">
                      <Sparkles className="w-6 h-6 text-purple-900" strokeWidth={3} />
                    </div>
                    <h3 className="text-3xl font-black text-white drop-shadow-xl">
                      {category}
                    </h3>
                    <span className="ml-auto bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-black border-2 border-white/40 shadow-lg">
                      {items.length} items
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {items.map((item) => (
                      <div
                        key={item.itemID}
                        onClick={() => addToCart(item)}
                        className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-3 border-yellow-400 hover:border-pink-400 transform hover:-translate-y-2 cursor-pointer"
                      >
                        {/* Image Container */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100">
                          <img
                            src={item.imagePath || "/placeholder.png"}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23fef3c7'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23f59e0b' font-size='24' font-weight='bold'%3E%F0%9F%8D%BD%EF%B8%8F No Image%3C/text%3E%3C/svg%3E";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* Price Badge */}
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-2 rounded-xl shadow-xl border-2 border-white">
                            <p className="text-purple-900 font-black text-base">
                              Rs. {item.price}
                            </p>
                          </div>
                          
                          {/* Hover Add Icon */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4 shadow-2xl transform scale-75 group-hover:scale-100 transition-transform border-3 border-white">
                              <Plus size={32} className="text-purple-900" strokeWidth={4} />
                            </div>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-4">
                          <h4 className="font-black text-purple-900 text-lg mb-2 group-hover:text-pink-600 transition-colors line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-gray-600 text-sm mb-3 flex items-center gap-2 font-bold">
                            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"></span>
                            {item.category}
                          </p>
                          <div className="flex items-center justify-between pt-3 border-t-2 border-yellow-400">
                            <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-black text-2xl">
                              Rs. {item.price}
                            </div>
                            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg group-hover:from-pink-600 group-hover:to-purple-700 transition-all flex items-center gap-2 transform group-hover:scale-110 border-2 border-white">
                              <Plus size={16} strokeWidth={3} />
                              Add
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT: Cart */}
          <div className="lg:w-[380px]">
            <div className="lg:sticky lg:top-24 bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl p-5 border-3 border-yellow-400">
              <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-purple-200">
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 flex items-center gap-2">
                  <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2 rounded-xl shadow-lg">
                    <ShoppingCart className="w-6 h-6 text-white" strokeWidth={3} />
                  </div>
                  Your Cart
                </h2>
                {cart.length > 0 && (
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 text-lg font-black px-4 py-2 rounded-full shadow-lg border-2 border-white">
                    {cart.length}
                  </span>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <ShoppingCart className="w-12 h-12 text-purple-500" strokeWidth={3} />
                  </div>
                  <p className="text-purple-900 font-black text-lg mb-2">Your cart is empty</p>
                  <p className="text-gray-600 text-sm font-medium">Start adding items!</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map((item) => (
                      <div
                        key={item.itemID}
                        className="group relative flex gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-pink-400 hover:shadow-lg transition-all"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-purple-900 mb-2 truncate text-base">{item.name}</p>
                          <p className="text-sm text-white font-black mb-3 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1.5 rounded-lg inline-block shadow-md">
                            Rs. {item.price} × {item.quantity} = Rs. {(item.price * item.quantity).toFixed(2)}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 bg-white rounded-xl border-2 border-purple-300 px-3 py-2 shadow-md">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  changeQuantity(item.itemID, -1);
                                }}
                                className="text-purple-600 hover:text-pink-600 transition-all hover:scale-110 transform"
                              >
                                <Minus size={18} strokeWidth={3} />
                              </button>
                              <span className="font-black text-purple-900 min-w-[28px] text-center text-lg">
                                {item.quantity}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  changeQuantity(item.itemID, 1);
                                }}
                                className="text-purple-600 hover:text-pink-600 transition-all hover:scale-110 transform"
                              >
                                <Plus size={18} strokeWidth={3} />
                              </button>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromCart(item.itemID);
                              }}
                              className="ml-auto p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all hover:scale-105 transform shadow-md border-2 border-red-200 hover:border-red-500"
                            >
                              <Trash2 size={18} strokeWidth={3} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-purple-200 pt-5">
                    <div className="flex justify-between items-center mb-5 bg-gradient-to-r from-purple-100 to-pink-100 p-5 rounded-xl border-2 border-purple-300 shadow-lg">
                      <span className="text-lg font-black text-purple-900">Total:</span>
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                        Rs. {total.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={placingOrder}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl transition-all font-black text-lg shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border-3 border-white"
                    >
                      {placingOrder ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                          Placing Order...
                        </>
                      ) : (
                        <>
                          <Check size={22} strokeWidth={3} />
                          Place Order
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, #e9d5ff, #fbcfe8);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a855f7, #ec4899);
          border-radius: 10px;
          border: 2px solid white;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #9333ea, #db2777);
        }
      `}</style>
    </div>
  );
};

export default OrderPage;