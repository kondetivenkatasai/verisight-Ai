import { forwardRef } from 'react';

const Textarea = forwardRef(function Textarea(
  { label, error, className = '', rows = 4, ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-400">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full rounded-xl bg-surface-900 border border-surface-300 dark:border-white/10
          text-surface-900 dark:text-white placeholder:text-surface-400 dark:placeholder:text-surface-500
          focus:outline-none focus:ring-2 focus:ring-aegis-500/30 focus:border-aegis-500
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

