import React from "react";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart, Package, BarChart3, Clock, Sparkles, TrendingUp, Award, Star } from "lucide-react";

const Index = ({ onNavigate }) => {
  const { user, isAdmin } = useAuth();

  const menuCards = [
    {
      id: "order",
      title: "🛒 Order Now",
      description: "Delicious shawarmas, juicy burgers & more — freshly made for you!",
      icon: ShoppingCart,
      gradient: "from-amber-400 via-orange-500 to-red-500",
      hoverGradient: "from-amber-500 via-orange-600 to-red-600",
      bgGlow: "bg-orange-500/20",
      accessible: true,
      badge: "Popular",
      badgeColor: "bg-red-500"
    },
    {
      id: "history",
      title: "🕐 Order History",
      description: "View your past orders & track your favorites",
      icon: Clock,
      gradient: "from-cyan-400 via-teal-500 to-emerald-500",
      hoverGradient: "from-cyan-500 via-teal-600 to-emerald-600",
      bgGlow: "bg-teal-500/20",
      accessible: !isAdmin(),
      badge: "Track",
      badgeColor: "bg-teal-500"
    },
    {
      id: "inventory",
      title: "📦 Inventory",
      description: "Manage menu items & stock levels",
      icon: Package,
      gradient: "from-blue-400 via-indigo-500 to-purple-500",
      hoverGradient: "from-blue-500 via-indigo-600 to-purple-600",
      bgGlow: "bg-indigo-500/20",
      accessible: isAdmin(),
      badge: "Admin",
      badgeColor: "bg-indigo-500"
    },
    {
      id: "dashboard",
      title: "📊 Dashboard",
      description: "Analyze sales & performance insights",
      icon: BarChart3,
      gradient: "from-purple-400 via-pink-500 to-rose-500",
      hoverGradient: "from-purple-500 via-pink-600 to-rose-600",
      bgGlow: "bg-pink-500/20",
      accessible: isAdmin(),
      badge: "Analytics",
      badgeColor: "bg-pink-500"
    },
  ];

  const accessibleCards = menuCards.filter((c) => c.accessible);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          {/* Animated Food Icon */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative text-9xl animate-bounce">🌯</div>
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2">
              <Sparkles className="w-6 h-6 text-white animate-spin" style={{animationDuration: '3s'}} />
            </div>
          </div>

          {/* Main Title with Glowing Effect */}
          <div className="relative mb-8">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-2 relative">
              <span className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent blur-lg opacity-70">
                Shawarma O'Clock!
              </span>
              <span className="relative bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Shawarma O'Clock!
              </span>
            </h1>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse delay-100" />
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse delay-200" />
            </div>
          </div>

          {/* Welcome Card with Glass Morphism */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 mb-6">
              <p className="text-2xl sm:text-3xl text-white/90 font-semibold mb-6 italic">
                "Good food is the foundation of genuine happiness." 🍔
              </p>
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl border border-orange-500/30 shadow-lg">
                <span className="text-xl text-white/70">Welcome back,</span>
                <span className="text-2xl font-black bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                  {user?.name}
                </span>
                <span className="text-xl text-white/70">! 🎉</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-lg rounded-2xl border border-orange-500/20 p-4">
                <TrendingUp className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <p className="text-white/60 text-xs mb-1">Fresh</p>
                <p className="text-white font-bold text-lg">Daily</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-4">
                <Award className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-white/60 text-xs mb-1">Quality</p>
                <p className="text-white font-bold text-lg">Premium</p>
              </div>
              <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 backdrop-blur-lg rounded-2xl border border-teal-500/20 p-4">
                <Sparkles className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                <p className="text-white/60 text-xs mb-1">Service</p>
                <p className="text-white font-bold text-lg">Fast</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Cards with Ultra-Modern Design */}
        <div className={`grid gap-6 ${
          accessibleCards.length === 1 
            ? "grid-cols-1 max-w-md mx-auto" 
            : accessibleCards.length === 2
            ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        }`}>
          {accessibleCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className="group relative"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Glow Effect on Hover */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${card.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-500`}></div>
                
                {/* Card Container */}
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden transition-all duration-500 group-hover:border-white/30 group-hover:bg-white/10 h-full">
                  {/* Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`${card.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                      {card.badge}
                    </span>
                  </div>

                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500`}></div>

                  {/* Card Content */}
                  <div className="relative p-8 flex flex-col items-center text-center h-full">
                    {/* Icon with Floating Animation */}
                    <div className="relative mb-6">
                      <div className={`absolute inset-0 ${card.bgGlow} rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500`}></div>
                      <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl`}>
                        <IconComponent className="w-10 h-10 text-white" strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-black text-white mb-3 group-hover:scale-105 transition-transform duration-300">
                      {card.title}
                    </h2>

                    {/* Description */}
                    <p className="text-white/60 text-sm leading-relaxed mb-6 flex-grow">
                      {card.description}
                    </p>

                    {/* Action Indicator */}
                    <div className={`w-full h-1.5 rounded-full bg-gradient-to-r ${card.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 shadow-lg`}></div>

                    {/* Hover Arrow */}
                    <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-300">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${card.gradient} flex items-center justify-center shadow-xl`}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Corner Decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Role Badge with Premium Look */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-4 px-10 py-5 rounded-3xl shadow-2xl border transition-all duration-300 hover:shadow-3xl hover:scale-105 backdrop-blur-xl"
            style={{
              background: isAdmin()
                ? "linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)"
                : "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)",
              borderColor: isAdmin() ? "rgba(147, 51, 234, 0.3)" : "rgba(16, 185, 129, 0.3)"
            }}
          >
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${
              isAdmin() 
                ? "from-purple-500 to-pink-500" 
                : "from-emerald-500 to-teal-500"
            } flex items-center justify-center shadow-xl`}>
              <span className="text-2xl">{isAdmin() ? "👑" : "🎉"}</span>
            </div>
            <div className="text-left">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">
                Access Level
              </p>
              <p className={`text-xl font-black ${
                isAdmin() 
                  ? "bg-gradient-to-r from-purple-400 to-pink-400" 
                  : "bg-gradient-to-r from-emerald-400 to-teal-400"
              } bg-clip-text text-transparent`}>
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="mt-16 text-center">
          <p className="text-white/30 text-sm italic">
            "Life is too short for bad food" ✨
          </p>
        </div>
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
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
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

export default Index;