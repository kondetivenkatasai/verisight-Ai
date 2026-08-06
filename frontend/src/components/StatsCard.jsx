import { motion } from 'framer-motion';
import { staggerItem } from '@/animations/variants';

export default function StatsCard({ title, value, change, icon: Icon, color = 'aegis' }) {
  const colorMap = {
    aegis: { icon: 'text-aegis-400', bg: 'bg-aegis-500/10', border: 'border-aegis-500/20' },
    emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    amber: { icon: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    red: { icon: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    cyan: { icon: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  };

  const colors = colorMap[color] || colorMap.aegis;

  return (
    <motion.div
      variants={staggerItem}
      className={`rounded-2xl bg-surface-900/50 border ${colors.border} p-5 hover:border-opacity-50 transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${colors.bg}`}>
          <Icon size={20} className={colors.icon} />
        </div>
        {change !== undefined && (
          <span
            className={`text-xs font-medium ${
              change >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-surface-400">{title}</p>
    </motion.div>
  );
}
