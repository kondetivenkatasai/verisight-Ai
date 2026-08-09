import { forwardRef } from 'react';

const Textarea = forwardRef(function Textarea(
  { label, error, className = '', rows = 4, ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full rounded-xl bg-white dark:bg-[#1a233a] border border-gray-200 dark:border-[#2a3a5e]
          text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/20 dark:focus:ring-blue-500/20 focus:border-[#9a55ff] dark:focus:border-blue-500
          transition-all duration-200 resize-none font-medium text-sm px-4 py-2.5
          ${error ? 'border-red-500/60 focus:ring-red-500/30 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500 dark:text-red-400 font-medium mt-1">{error}</p>}
    </div>
  );
});

export default Textarea;


