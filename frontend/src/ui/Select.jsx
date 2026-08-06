import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  { label, error, options = [], placeholder = 'Select...', className = '', ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full appearance-none rounded-xl bg-white dark:bg-[#151c2e] border border-gray-200 dark:border-[#1e2942]
            text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/20 dark:focus:ring-blue-500/20
            focus:border-[#9a55ff] dark:focus:border-blue-500 transition-all duration-200
            pl-4 pr-10 py-2.5 text-sm font-medium cursor-pointer
            ${error ? 'border-red-500/60 focus:ring-red-500/30 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          <option value="" className="bg-white dark:bg-[#111726] text-gray-500 dark:text-[#7b89a6]">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-white dark:bg-[#111726] text-gray-900 dark:text-white font-medium"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
          <ChevronDown size={16} className="text-gray-400 dark:text-[#5c6b8a]" />
        </div>
      </div>
      {error && <p className="text-xs text-red-500 dark:text-red-400 font-medium mt-1">{error}</p>}
    </div>
  );
});

export default Select;


