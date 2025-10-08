import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SnackbarProvider } from "notistack";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Index from "./components/Index";
import OrderPage from "./components/OrderPage";
import OrderHistory from "./components/OrderHistory";
import Inventory from "./components/Inventory";
import Dashboard from "./components/Dashboard";

const AppContent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [currentPage, setCurrentPage] = useState("index");

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-amber-50 to-orange-100">
        <h1 className="text-4xl font-bold mb-8 text-amber-800 tracking-wide">
          Shawarma O'Clock
        </h1>

        {showRegister ? (
          <Register onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <Login onSwitchToRegister={() => setShowRegister(true)} />
        )}

        <p className="mt-4 text-gray-700 text-sm">
          {showRegister ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setShowRegister(false)}
                className="text-amber-700 font-medium hover:underline"
              >
                Login
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setShowRegister(true)}
                className="text-amber-700 font-medium hover:underline"
              >
                Register
              </button>
            </>
          )}
        </p>
      </div>
    );
  }

  // ✅ When logged in – show navbar and correct page
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={logout} />

      {/* Conditional rendering of pages */}
      {currentPage === "index" && (
        <Index onNavigate={(page) => setCurrentPage(page)} />
      )}

      {currentPage === "order" && (
        <OrderPage
          onBack={() => setCurrentPage("index")}
          onNavigate={(page) => setCurrentPage(page)}
        />
      )}

      {currentPage === "history" && (
        <OrderHistory onBack={() => setCurrentPage("index")} />
      )}

      {/* 📦 Inventory Page - Admin Only */}
      {currentPage === "inventory" && (
        <Inventory onBack={() => setCurrentPage("index")} />
      )}

      {/* 📊 Dashboard Page - Admin Only */}
      {currentPage === "dashboard" && (
        <Dashboard onBack={() => setCurrentPage("index")} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SnackbarProvider 
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        autoHideDuration={3000}
      >
        <AppContent />
      </SnackbarProvider>
    </AuthProvider>
  );
}