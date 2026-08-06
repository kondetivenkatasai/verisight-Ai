import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { fadeUp } from '@/animations/variants';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#ba9ecf]/40 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden select-none">
      {/* Background Soft Wave Accent */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#9d7bb0]/30 via-[#c3aed6]/20 to-[#9d7bb0]/30 pointer-events-none" />

      {/* Main Split-Screen Container */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-purple-900/15 overflow-hidden flex flex-col md:flex-row min-h-[520px]"
      >
        {/* Left Panel - Purple Graphic Banner */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-[#77479d] via-[#633389] to-[#4a226c] text-white p-8 sm:p-12 flex flex-col justify-center relative overflow-hidden">
          {/* Topographic Lines Top-Left */}
          <svg className="absolute -top-6 -left-6 w-56 h-56 text-white/20 pointer-events-none" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10,10 Q80,30 60,100 T10,180" />
            <path d="M30,10 Q100,40 80,110 T20,190" />
            <path d="M50,10 Q120,50 100,120 T30,200" />
            <path d="M70,10 Q140,60 120,130 T40,210" />
          </svg>

          {/* Topographic Lines Bottom-Right */}
          <svg className="absolute -bottom-8 -right-8 w-64 h-64 text-white/20 pointer-events-none" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M190,190 Q120,170 140,100 T190,20" />
            <path d="M170,190 Q100,160 120,90 T180,10" />
            <path d="M150,190 Q80,150 100,80 T170,0" />
          </svg>

          {/* Dot Matrix Grid */}
          <div className="absolute top-8 right-8 grid grid-cols-3 gap-2 opacity-40 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-white rounded-full" />
            ))}
          </div>

          {/* Graphic Accent Icons */}
          <span className="absolute top-16 left-32 text-white/40 text-xl font-light select-none">+</span>
          <span className="absolute bottom-28 left-20 text-white/40 text-lg font-light select-none">+</span>
          <div className="absolute top-28 right-28 w-4 h-4 rounded-full border-2 border-white/30 pointer-events-none" />
          <div className="absolute bottom-16 left-12 w-3 h-3 rounded-full border-2 border-white/30 pointer-events-none" />

          {/* Banner Text Content */}
          <div className="relative z-10 max-w-sm">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              Welcome back!
            </h1>
            <p className="text-sm text-purple-100/90 leading-relaxed font-normal">
              You can sign in to access with your existing account.
            </p>
          </div>
        </div>

        {/* Right Panel - Login Form Area */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 bg-white flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            {/* Header */}
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight mb-6">
              Sign In
            </h2>

            {/* Error message */}
            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-600 text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username / Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User size={16} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Username or email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 text-xs sm:text-sm text-gray-700 placeholder-gray-400 bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-full border border-gray-200 text-xs sm:text-sm text-gray-700 placeholder-gray-400 bg-white focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Options: Remember me & Forgot password */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="hover:text-purple-600 transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm shadow-md shadow-purple-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Account Redirect Link */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 font-medium">
                New here?{' '}
                <Link to="/signup" className="text-purple-600 font-semibold hover:underline">
                  Create an Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}



