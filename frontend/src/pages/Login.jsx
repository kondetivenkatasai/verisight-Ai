import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { fadeUp } from '@/animations/variants';
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, loginWithGoogle, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleGoogleLogin = async (googlePayload) => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle(googlePayload);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Google authentication failed');
    } finally {
      setGoogleLoading(false);
    }
  };

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
    <div className="relative min-h-screen bg-[#090D18] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden select-none">
      {/* Background Soft Floating Glow Accents */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.55, 0.35],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-[rgba(37,99,235,0.18)] rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, -25, 0],
          y: [0, 25, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] bg-[rgba(59,130,246,0.12)] rounded-full blur-3xl pointer-events-none"
      />

      {/* Main Split-Screen Container */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl bg-[#111827] rounded-3xl border border-white/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col md:flex-row min-h-[520px]"
      >
        {/* Left Panel - Dashboard Style Gradient Banner */}
        <div
          className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center relative overflow-hidden text-white"
          style={{
            background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 35%, #4F46E5 70%, #7C3AED 100%)',
          }}
        >
          {/* Glowing Circle Overlays */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-[rgba(59,130,246,0.15)] rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[rgba(59,130,246,0.15)] rounded-full blur-3xl pointer-events-none" />

          {/* Decorative Lines Top-Left */}
          <svg
            className="absolute -top-6 -left-6 w-56 h-56 text-white/[0.12] pointer-events-none"
            viewBox="0 0 200 200"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M10,10 Q80,30 60,100 T10,180" />
            <path d="M30,10 Q100,40 80,110 T20,190" />
            <path d="M50,10 Q120,50 100,120 T30,200" />
            <path d="M70,10 Q140,60 120,130 T40,210" />
          </svg>

          {/* Decorative Lines Bottom-Right */}
          <svg
            className="absolute -bottom-8 -right-8 w-64 h-64 text-white/[0.12] pointer-events-none"
            viewBox="0 0 200 200"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
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
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight mb-2 sm:mb-3">
              Welcome back!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
              You can sign in to access with your existing account.
            </p>
          </div>
        </div>

        {/* Right Panel - Login Form Area */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 bg-[#111827] flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/[0.06]">
          <div className="max-w-sm mx-auto w-full">
            {/* Auth Mode Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#0F172A] rounded-full border border-white/[0.08] mb-6">
              <Link
                to="/login"
                className="flex-1 py-1.5 text-center text-xs font-semibold rounded-full bg-[#2563EB] text-white shadow-sm transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="flex-1 py-1.5 text-center text-xs font-semibold rounded-full text-[#94A3B8] hover:text-[#F8FAFC] transition-all"
              >
                Create Account
              </Link>
            </div>

            {/* Header */}
            <h2 className="text-2xl font-bold text-[#F8FAFC] tracking-tight mb-5">
              Sign In
            </h2>

            {/* Error message */}
            {error && (
              <div className="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-semibold text-rose-400 text-center">
                {error}
              </div>
            )}

            {/* Google Sign-In Button */}
            <div className="mb-4">
              <GoogleSignInButton
                onClick={handleGoogleLogin}
                loading={googleLoading}
                text="Sign in with Google"
              />
            </div>

            {/* Divider */}
            <div className="relative mb-5 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.08]" />
              </div>
              <span className="relative bg-[#111827] px-3 text-[11px] font-medium uppercase tracking-wider text-[#94A3B8]">
                or continue with
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username / Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                  <User size={16} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Username or email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-white/[0.08] text-xs sm:text-sm text-[#F8FAFC] placeholder-[#64748B] bg-[#0F172A] focus:outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/15 transition-all"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-full border border-white/[0.08] text-xs sm:text-sm text-[#F8FAFC] placeholder-[#64748B] bg-[#0F172A] focus:outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94A3B8] hover:text-[#F8FAFC] focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Options: Remember me & Forgot password */}
              <div className="flex items-center justify-between text-xs text-[#94A3B8] pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-white/15 bg-[#0F172A] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[#60A5FA] hover:text-[#93C5FD] transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'linear-gradient(90deg, #2563EB, #3B82F6, #4F46E5)',
                }}
                className="w-full py-3 px-6 rounded-full text-white font-semibold text-xs sm:text-sm shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(37,99,235,0.35)] active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-white" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Account Redirect Link */}
            <div className="mt-6 text-center">
              <p className="text-xs text-[#94A3B8] font-medium">
                New here?{' '}
                <Link to="/signup" className="text-[#60A5FA] font-semibold hover:text-[#93C5FD] hover:underline">
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




