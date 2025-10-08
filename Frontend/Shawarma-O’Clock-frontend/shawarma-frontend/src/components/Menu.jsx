import React, { useEffect, useState } from "react";
import menuService from "../services/menuService";
import orderService from "../services/orderService";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "notistack";

const Menu = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await menuService.getAvailableMenuItems();
        setMenuItems(data);
      } catch (error) {
        console.error("Error loading menu:", error);
        enqueueSnackbar("⚠️ Failed to load menu", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [enqueueSnackbar]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((x) => x.itemID === item.itemID);
      if (existing) {
        enqueueSnackbar(`✅ ${item.name} quantity increased!`, { variant: "success" });
        return prev.map((x) =>
          x.itemID === item.itemID ? { ...x, quantity: x.quantity + 1 } : x
        );
      }
      enqueueSnackbar(`🛒 ${item.name} added to cart!`, { variant: "success" });
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    const item = cart.find((x) => x.itemID === id);
    setCart((prev) => prev.filter((x) => x.itemID !== id));
    enqueueSnackbar(`🗑️ ${item.name} removed from cart`, { variant: "info" });
  };

  const updateQuantity = (id, qty) => {
    setCart((prev) =>
      prev.map((x) => (x.itemID === id ? { ...x, quantity: qty } : x))
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (!cart.length) {
      enqueueSnackbar("🛒 Your cart is empty!", { variant: "warning" });
      return;
    }

    try {
      const orderDetails = cart.map((item) => ({
        itemID: item.itemID,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      const res = await orderService.placeOrder(user.userID, total, orderDetails);
      enqueueSnackbar("✅ Order placed successfully!", { variant: "success" });
      setCart([]);
      console.log("Order response:", res);
    } catch (error) {
      console.error("Order failed:", error);
      enqueueSnackbar("❌ Failed to place order", { variant: "error" });
    }
  };

  // Group menu by category
  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-amber-700">
        Loading menu...
      </div>
    );

  return (
    <div className="flex flex-col lg:flex-row bg-amber-50 min-h-screen">
      {/* ---------------- Menu Section ---------------- */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4 text-amber-800">
          🍴 Menu Items
        </h1>

        {Object.keys(groupedMenu).map((category) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 text-amber-700">
              {category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {groupedMenu[category].map((item) => (
                <div
                  key={item.itemID}
                  className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
                >
                  <img
                    src={item.imagePath || "/placeholder.png"}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="text-amber-700 font-bold mt-2">
                    Rs {item.price}
                  </p>
                  <button
                    onClick={() => addToCart(item)}
                    className="mt-3 w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- Cart Section ---------------- */}
      <div className="w-full lg:w-96 bg-white border-l border-amber-100 p-6 shadow-inner">
        <h2 className="text-2xl font-bold text-amber-800 mb-4">🛒 Cart</h2>

        {cart.length === 0 ? (
          <p className="text-gray-500 italic">Your cart is empty</p>
        ) : (
          <>
            <ul className="space-y-4">
              {cart.map((item) => (
                <li
                  key={item.itemID}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <div className="flex items-center mt-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.itemID, Math.max(1, item.quantity - 1))
                        }
                        className="px-2 bg-amber-100 rounded"
                      >
                        -
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.itemID, item.quantity + 1)
                        }
                        className="px-2 bg-amber-100 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-700 font-semibold">
                      Rs {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.itemID)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t mt-4 pt-4">
              <p className="font-bold text-lg text-amber-800">
                Total: Rs {total.toFixed(2)}
              </p>
              <button
                onClick={placeOrder}
                className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;