import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  { label, error, options = [], placeholder = 'Select...', className = '', ...props },
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
        <select
          ref={ref}
          className={`
            w-full appearance-none rounded-xl bg-surface-900 border border-surface-300 dark:border-white/10
            text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-aegis-500/30
            focus:border-aegis-500 transition-all duration-200
            pl-4 pr-10 py-2.5 text-sm font-medium cursor-pointer
            ${error ? 'border-red-500/60 focus:ring-red-500/30 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          <option value="" className="bg-white dark:bg-[#111318] text-surface-500">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-white dark:bg-[#111318] text-surface-900 dark:text-white"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
          <ChevronDown size={16} className="text-surface-400 dark:text-surface-500" />
        </div>
      </div>
      {error && <p className="text-xs text-red-500 dark:text-red-400 font-medium mt-1">{error}</p>}
    </div>
  );
});

export default Select;

