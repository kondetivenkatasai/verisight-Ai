import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import RadialGlowButton from './RadialGlowButton';

const variants = {
  primary: '',
  secondary:
    'bg-gray-100 dark:bg-[#1e2942] hover:bg-gray-200 dark:hover:bg-[#2a3a5c] text-gray-900 dark:text-white border border-gray-250 dark:border-[#33466e] shadow-sm font-bold',
  outline:
    'bg-transparent hover:bg-purple-500/10 dark:hover:bg-blue-500/10 text-purple-600 dark:text-blue-400 border border-purple-500/30 dark:border-blue-500/30 font-semibold',
  ghost:
    'bg-transparent hover:bg-gray-100 dark:hover:bg-[#1c273e] text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-semibold',
  danger:
    'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:border-rose-500/50 font-bold',
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
  to,
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
        to={to}
        type={type}
        {...props}
      >
        {children}
      </RadialGlowButton>
    );
  }

  const Component = to ? motion(Link) : motion.button;
  const linkProps = to ? { to, onClick } : { type, onClick };

  return (
    <Component
      whileHover={{ scale: disabled || loading ? 1 : 1.015, y: disabled || loading ? 0 : -1 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98, y: 0 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl
        transition-colors duration-200 cursor-pointer select-none
        focus:outline-none focus-visible:ring-2 focus-visible:ring-aegis-500/50
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...linkProps}
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
    </Component>
  );
}

