import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';

const Register = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(form.name, form.email, form.password);
      enqueueSnackbar('✅ Account created successfully! Please log in.', { variant: 'success' });
      setTimeout(() => {
        onSwitchToLogin();
      }, 1500);
    } catch (err) {
      enqueueSnackbar(err || 'Registration failed. Please try again.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
      {/* Decorative Header */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 px-8 py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
            <span className="text-5xl">🌯</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join Us Today!</h1>
          <p className="text-orange-100 text-sm">Create your Shawarma O'Clock account</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center">
              <span className="mr-2">👤</span>
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all duration-200 bg-gray-50 hover:bg-white hover:border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center">
              <span className="mr-2">📧</span>
              Email Address
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all duration-200 bg-gray-50 hover:bg-white hover:border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center">
              <span className="mr-2">🔒</span>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition-all duration-200 bg-gray-50 hover:bg-white hover:border-gray-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <span className="mr-2">🎉</span>
                Create Account
              </span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 space-y-4">
          <div className="text-center">
            <p className="text-gray-500 text-xs">
              By signing up, you agree to our{' '}
              <button className="text-orange-600 font-semibold hover:text-orange-700 hover:underline transition">
                Terms & Conditions
              </button>
            </p>
          </div>
          <div className="pt-4 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <button 
                onClick={onSwitchToLogin}
                className="text-orange-600 font-bold hover:text-orange-700 hover:underline transition"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;