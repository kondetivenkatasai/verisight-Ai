import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  { label, error, options = [], placeholder = 'Select...', className = '', ...props },
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
        <select
          ref={ref}
          className={`
            w-full appearance-none rounded-xl bg-surface-900/50 border border-surface-700/50
            text-surface-100 focus:outline-none focus:ring-2 focus:ring-aegis-500/40
            focus:border-aegis-500/50 transition-all duration-200
            pl-4 pr-10 py-2.5 text-sm cursor-pointer
            ${error ? 'border-red-500/50 focus:ring-red-500/40' : ''}
            ${className}
          `}
          {...props}
        >
          <option value="" className="bg-surface-900 text-surface-400">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-surface-900 text-surface-100"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown size={16} className="text-surface-500" />
        </div>
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
});

export default Select;
