import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { fadeUp } from '@/animations/variants';
import { APP_NAME } from '@/utils/constants';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="relative min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden select-none">
      {/* Background Graphic Accents (Red Arcs matching design) */}
      <div className="absolute -top-32 -left-32 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-red-600 opacity-95 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-red-600 opacity-95 pointer-events-none" />

      {/* Main Split-Screen Card Container */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-black/10 overflow-hidden flex flex-col md:flex-row min-h-[580px]"
      >
        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 md:p-12 flex flex-col justify-between bg-white">
          <div>
            {/* Header / Logo */}
            <div className="text-center mb-6">
              <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase block mb-1">
                WELCOME TO
              </span>
              <div className="inline-flex items-center justify-center gap-2 mb-2">
                {/* Red Infinity Mark */}
                <svg className="w-8 h-8 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 12c-2-2.5-4-4-6.5-4A4.5 4.5 0 1 0 10 12.5L12 12zm0 0c2 2.5 4 4 6.5 4a4.5 4.5 0 1 0-4.5-4.5L12 12z" />
                </svg>
                <span className="text-2xl font-black tracking-tight text-red-600 uppercase">
                  {APP_NAME}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-normal leading-relaxed max-w-xs mx-auto">
                Log in to get in the moment updates on the things that interest you.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-600 text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Username Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 rounded-full border border-gray-200 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'SIGN IN'
                )}
              </button>
            </form>

            {/* Signup Link */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 font-medium">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="text-red-600 font-bold hover:underline">
                  Sign Up Now
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom Social Media Section */}
          <div className="mt-6 text-center">
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-gray-200 w-full" />
              <span className="bg-white px-3 text-xs text-gray-400 font-normal absolute">
                Or
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mb-3 font-normal">
              Continue with social media
            </p>

            <div className="flex items-center justify-center gap-3">
              {/* Facebook */}
              <button
                type="button"
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                title="Facebook"
              >
                <span className="font-bold text-xs">f</span>
              </button>

              {/* Twitter / X */}
              <button
                type="button"
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                title="Twitter"
              >
                <span className="font-bold text-xs">t</span>
              </button>

              {/* Google */}
              <button
                type="button"
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-red-500 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                title="Google"
              >
                <span className="font-bold text-xs">G</span>
              </button>

              {/* LinkedIn */}
              <button
                type="button"
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                title="LinkedIn"
              >
                <span className="font-bold text-xs">in</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Red Graphic / Hero Panel */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-red-600 via-rose-600 to-red-800 text-white p-12 flex-col justify-center items-center text-center relative overflow-hidden">
          {/* Background Overlay Texture / City Impression */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80')`
            }}
          />
          {/* Ambient Glow Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-red-950/60 via-transparent to-red-500/30 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 max-w-sm flex flex-col items-center">
            {/* White Logo Mark */}
            <div className="mb-4 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 12c-2-2.5-4-4-6.5-4A4.5 4.5 0 1 0 10 12.5L12 12zm0 0c2 2.5 4 4 6.5 4a4.5 4.5 0 1 0-4.5-4.5L12 12z" />
              </svg>
            </div>

            <h2 className="text-2xl font-black tracking-widest text-white uppercase mb-3">
              {APP_NAME}
            </h2>

            <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed font-light">
              Empowering real-time decision intelligence with AI verification, deep multi-layered risk analysis, and actionable workspace insights.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


