import { forwardRef } from 'react';

const Textarea = forwardRef(function Textarea(
  { label, error, className = '', rows = 4, ...props },
  ref
) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-surface-300">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full rounded-xl bg-surface-900/50 border border-surface-700/50 text-surface-100
          placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-aegis-500/40
          focus:border-aegis-500/50 transition-all duration-200 resize-none
          px-4 py-2.5 text-sm
          ${error ? 'border-red-500/50 focus:ring-red-500/40' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
});

export default Textarea;
