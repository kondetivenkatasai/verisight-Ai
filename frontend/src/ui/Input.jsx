import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, icon: Icon, className = '', type = 'text', ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-400">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon size={16} className="text-surface-400 dark:text-surface-500" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full rounded-xl bg-surface-900 border border-surface-300 dark:border-white/10
            text-surface-900 dark:text-white placeholder:text-surface-400 dark:placeholder:text-surface-500
            focus:outline-none focus:ring-2 focus:ring-aegis-500/30 focus:border-aegis-500
            transition-all duration-200 text-sm font-medium
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
            ${error ? 'border-red-500/60 focus:ring-red-500/30 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 dark:text-red-400 font-medium mt-1">{error}</p>}
    </div>
  );
});

export default Input;

