import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock } from 'lucide-react';
import RadialGlowButton from '@/ui/RadialGlowButton';
import Input from '@/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { fadeUp } from '@/animations/variants';
import { APP_NAME } from '@/utils/constants';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="relative min-h-screen bg-surface-950 flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Hero Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-b from-aegis-500/20 via-purple-500/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="p-2.5 rounded-2xl bg-aegis-500/10 border border-aegis-500/20 text-aegis-600 dark:text-aegis-400 group-hover:scale-105 transition-transform">
              <Shield size={28} />
            </div>
            <span className="text-2xl font-black text-surface-900 dark:text-white tracking-tight">{APP_NAME}</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight mb-1">Welcome back</h1>
          <p className="text-surface-600 dark:text-surface-400 text-sm font-normal">Sign in to access your decision workspace</p>
        </div>

        {/* Form Container */}
        <div className="rounded-3xl bg-surface-900 border border-surface-300 dark:border-white/[0.08] backdrop-blur-xl p-8 shadow-elevated-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs font-semibold text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <RadialGlowButton
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Sign In
            </RadialGlowButton>
          </form>

          <div className="mt-6 text-center pt-5 border-t border-surface-200 dark:border-white/5">
            <p className="text-xs font-medium text-surface-600 dark:text-surface-400">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-aegis-600 dark:text-aegis-400 hover:text-aegis-500 font-bold transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

