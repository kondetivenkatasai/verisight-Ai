import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, icon: Icon, className = '', type = 'text', ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-surface-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon size={16} className="text-surface-500" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full rounded-xl bg-surface-900/50 border border-surface-700/50 text-surface-100
            placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-aegis-500/40
            focus:border-aegis-500/50 transition-all duration-200
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 text-sm
            ${error ? 'border-red-500/50 focus:ring-red-500/40' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
});

export default Input;
