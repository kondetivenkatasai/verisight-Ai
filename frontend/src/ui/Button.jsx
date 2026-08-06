import { motion } from 'framer-motion';
import RadialGlowButton from './RadialGlowButton';

const variants = {
  primary: '',
  secondary:
    'bg-surface-850 hover:bg-surface-800 text-surface-700 dark:text-surface-100 border border-surface-300 dark:border-white/10 hover:border-surface-400 dark:hover:border-white/20 shadow-subtle-card',
  outline:
    'bg-transparent hover:bg-aegis-500/10 text-aegis-500 dark:text-aegis-400 border border-aegis-500/30 hover:border-aegis-500',
  ghost:
    'bg-transparent hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100',
  danger:
    'bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 border border-red-500/20 hover:border-red-500/40',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs font-medium',
  md: 'px-4 py-2 text-sm font-medium',
  lg: 'px-6 py-2.5 text-base font-semibold',
  xl: 'px-8 py-3 text-lg font-semibold',
};

export { RadialGlowButton };

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  onClick,
  type = 'button',
  ...props
}) {
  if (variant === 'primary') {
    return (
      <RadialGlowButton
        size={size}
        className={className}
        disabled={disabled}
        loading={loading}
        icon={Icon}
        onClick={onClick}
        type={type}
        {...props}
      >
        {children}
      </RadialGlowButton>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.015, y: disabled || loading ? 0 : -1 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98, y: 0 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl
        transition-colors duration-200 cursor-pointer select-none
        focus:outline-none focus-visible:ring-2 focus-visible:ring-aegis-500/50
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="shrink-0 transition-transform group-hover:scale-105" />
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
}

