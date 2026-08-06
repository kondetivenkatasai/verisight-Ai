import { PRIORITY_COLORS, STATUS_COLORS } from '@/utils/constants';
import { capitalize } from '@/utils/formatters';

export default function Badge({ type = 'status', value, className = '' }) {
  const colorMap = type === 'priority' ? PRIORITY_COLORS : STATUS_COLORS;
  const colors = colorMap[value] || { bg: 'bg-surface-700/30', text: 'text-surface-400', border: 'border-surface-600/30' };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        border ${colors.bg} ${colors.text} ${colors.border} ${className}
      `}
    >
      {capitalize(value)}
    </span>
  );
}
