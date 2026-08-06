import { motion } from 'framer-motion';

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
  xl: 'px-9 py-3.5 text-lg font-semibold',
};

export default function RadialGlowButton({
  children,
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.03 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center gap-2.5 font-medium rounded-xl text-white
        bg-gradient-to-r from-aegis-600 via-indigo-600 to-purple-600
        hover:from-aegis-500 hover:via-indigo-500 hover:to-purple-500
        shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(99,102,241,0.7)]
        border border-aegis-400/30 backdrop-blur-md
        transition-all duration-300 cursor-pointer overflow-hidden group
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        ${sizes[size]} ${className}
      `}
      {...props}
    >
      {/* Background radial shimmer */}
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.25),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
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
