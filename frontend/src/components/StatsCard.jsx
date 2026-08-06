import { motion } from 'framer-motion';
import { staggerItem } from '@/animations/variants';
import { MoreHorizontal } from 'lucide-react';

export default function StatsCard({ title, value, change, icon: Icon, color = 'aegis' }) {
  const colorMap = {
    aegis: {
      icon: 'text-purple-600',
      bg: 'bg-purple-100/80',
    },
    emerald: {
      icon: 'text-cyan-600',
      bg: 'bg-cyan-100/80',
    },
    amber: {
      icon: 'text-amber-600',
      bg: 'bg-amber-100/80',
    },
    red: {
      icon: 'text-rose-500',
      bg: 'bg-rose-100/80',
    },
  };

  const colors = colorMap[color] || colorMap.aegis;

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -2 }}
      className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-2xl ${colors.bg}`}>
          <Icon size={20} className={colors.icon} />
        </div>
        <button className="text-gray-300 hover:text-gray-500 transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>
      <div>
        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-0.5">{value}</p>
        <p className="text-xs font-medium text-gray-400">{title}</p>
      </div>
    </motion.div>
  );
}



