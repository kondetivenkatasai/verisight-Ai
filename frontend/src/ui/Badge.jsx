import { PRIORITY_COLORS, STATUS_COLORS } from '@/utils/constants';
import { capitalize } from '@/utils/formatters';

export default function Badge({ type = 'status', value, className = '' }) {
  const colorMap = type === 'priority' ? PRIORITY_COLORS : STATUS_COLORS;
  const colors = colorMap[value] || { bg: 'bg-surface-200 dark:bg-surface-800', text: 'text-surface-700 dark:text-surface-300', border: 'border-surface-300 dark:border-white/10' };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase
        border ${colors.bg} ${colors.text} ${colors.border} ${className}
      `}
    >
      {capitalize(value)}
    </span>
  );
}

