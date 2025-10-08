import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="relative bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-white shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      
      <div className="relative px-6 py-5 flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo Section */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 blur-lg rounded-full animate-pulse"></div>
            <span className="relative text-4xl transform group-hover:scale-110 transition-transform duration-300">
              🥙
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Shawarma O'Clock
          </h1>
        </div>

        {/* User Section */}
        {isAuthenticated() ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
              <span className="text-sm font-medium">
                Welcome, <strong className="text-amber-100">{user?.name}</strong>
              </span>
              {user?.role === 'Admin' && (
                <span className="flex items-center gap-1 text-xs bg-white text-amber-700 px-3 py-1 rounded-lg font-bold shadow-md">
                  <span>👑</span> Admin
                </span>
              )}
            </div>
            
            <button
              onClick={logout}
              className="group relative px-6 py-2.5 bg-white text-amber-700 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-amber-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                <span className="hidden sm:inline">Logout</span>
                <span className="text-lg">🚪</span>
              </span>
            </button>
          </div>
        ) : (
          <span className="text-sm italic opacity-80 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
            Please log in
          </span>
        )}
      </div>

      {/* Bottom Border Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-50"></div>
    </nav>
  );
};

export default Navbar;