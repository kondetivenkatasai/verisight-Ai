import { motion } from 'framer-motion';
import { staggerItem } from '@/animations/variants';

export default function StatsCard({ title, value, change, icon: Icon, color = 'aegis' }) {
  const colorMap = {
    aegis: {
      icon: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      hoverBorder: 'hover:border-sky-500/60',
      hoverShadow: 'hover:shadow-[0_0_25px_rgba(56,189,248,0.25)]',
    },
    emerald: {
      icon: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      hoverBorder: 'hover:border-emerald-500/60',
      hoverShadow: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]',
    },
    amber: {
      icon: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      hoverBorder: 'hover:border-amber-500/60',
      hoverShadow: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]',
    },
    red: {
      icon: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      hoverBorder: 'hover:border-rose-500/60',
      hoverShadow: 'hover:shadow-[0_0_25px_rgba(244,63,94,0.25)]',
    },
    cyan: {
      icon: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      hoverBorder: 'hover:border-cyan-500/60',
      hoverShadow: 'hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]',
    },
    purple: {
      icon: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      hoverBorder: 'hover:border-purple-500/60',
      hoverShadow: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]',
    },
  };

  const colors = colorMap[color] || colorMap.aegis;

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl bg-surface-900 border border-slate-200 dark:border-slate-800 p-5 shadow-subtle-card backdrop-blur-xl transition-all duration-300 ${colors.hoverBorder} ${colors.hoverShadow} group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${colors.bg} border ${colors.border} group-hover:scale-110 transition-transform`}>
          <Icon size={20} className={colors.icon} />
        </div>
        {change !== undefined && (
          <span
            className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
              change >= 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            }`}
          >
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1 group-hover:text-sky-400 transition-colors">{value}</p>
      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{title}</p>
    </motion.div>
  );
}


