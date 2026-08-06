import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const sizes = {
  sm: 'px-3.5 py-1.5 text-xs font-semibold',
  md: 'px-4.5 py-2 text-sm font-semibold',
  lg: 'px-6 py-2.5 text-base font-semibold',
  xl: 'px-8 py-3.5 text-lg font-semibold',
};

export default function RadialGlowButton({
  children,
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  onClick,
  to,
  type = 'button',
  ...props
}) {
  const Component = to ? motion(Link) : motion.button;
  const linkProps = to ? { to, onClick } : { type, onClick };

  return (
    <Component
      whileHover={{ scale: disabled || loading ? 1 : 1.02, y: disabled || loading ? 0 : -1 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98, y: 0 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center gap-2 rounded-xl text-white font-semibold
        bg-gradient-to-r from-aegis-600 via-indigo-600 to-purple-600
        hover:from-aegis-500 hover:via-indigo-500 hover:to-purple-500
        shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]
        border border-white/20 dark:border-white/20
        transition-all duration-200 cursor-pointer overflow-hidden group select-none
        focus:outline-none focus-visible:ring-2 focus-visible:ring-aegis-400
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none
        ${sizes[size]} ${className}
      `}
      {...linkProps}
      {...props}
    >
      {/* Background radial shimmer */}
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.3),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {loading ? (
        <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' || size === 'xl' ? 20 : 16} className="shrink-0 transition-transform group-hover:scale-110" />
      ) : null}

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

