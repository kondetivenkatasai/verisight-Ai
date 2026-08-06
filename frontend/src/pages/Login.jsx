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
    <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4">
      {/* Background pattern */}
      <div className="absolute inset-0 dot-pattern opacity-20" />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="p-2 rounded-xl bg-aegis-600/20">
              <Shield size={28} className="text-aegis-400" />
            </div>
            <span className="text-2xl font-bold text-white">{APP_NAME}</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-surface-400 text-sm">Sign in to continue to your dashboard</p>
        </div>

        {/* Form */}
        <div className="rounded-2xl bg-surface-900/50 border border-surface-700/30 backdrop-blur-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
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

          <div className="mt-6 text-center">
            <p className="text-sm text-surface-400">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-aegis-400 hover:text-aegis-300 font-medium transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
