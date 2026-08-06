import { motion } from 'framer-motion';
import RadialGlowButton from './RadialGlowButton';

const variants = {
  primary: '',
  secondary:
    'bg-surface-800 hover:bg-surface-700 text-surface-100 border border-surface-700 hover:border-surface-600',
  outline:
    'bg-transparent hover:bg-aegis-600/10 text-aegis-400 border border-aegis-500/30 hover:border-aegis-500',
  ghost:
    'bg-transparent hover:bg-surface-800 text-surface-300 hover:text-surface-100',
  danger:
    'bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 hover:border-red-500/40',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
  xl: 'px-8 py-3 text-lg',
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
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-xl
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      ) : null}
      {children}
    </motion.button>
  );
}
