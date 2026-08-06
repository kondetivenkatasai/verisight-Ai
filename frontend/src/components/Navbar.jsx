import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Button from '@/ui/Button';
import VerisightLogo from '@/ui/VerisightLogo';
import { navbarVariants } from '@/animations/variants';
import { NAV_LINKS, APP_NAME } from '@/utils/constants';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl border-b border-surface-200 dark:border-white/10 shadow-subtle-card'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <VerisightLogo size={22} />
            <span className="text-lg font-bold text-surface-900 dark:text-white tracking-tight">{APP_NAME}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Button to="/dashboard" size="sm">
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" to="/login" size="sm">
                  Sign In
                </Button>
                <Button to="/signup" size="sm">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-surface-500 hover:text-surface-900 dark:hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-xl border-b border-surface-200 dark:border-white/10"
        >
          <div className="px-4 py-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-surface-200 dark:border-white/10 flex flex-col gap-2">
              {isAuthenticated ? (
                <Button to="/dashboard" onClick={() => setMobileOpen(false)} size="sm" className="w-full">
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" to="/login" onClick={() => setMobileOpen(false)} size="sm" className="w-full">
                    Sign In
                  </Button>
                  <Button to="/signup" onClick={() => setMobileOpen(false)} size="sm" className="w-full">
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

