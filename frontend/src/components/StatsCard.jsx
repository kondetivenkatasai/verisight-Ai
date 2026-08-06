import { motion } from 'framer-motion';
import { staggerItem } from '@/animations/variants';

export default function StatsCard({ title, value, change, icon: Icon, color = 'aegis' }) {
  const colorMap = {
    aegis: {
      gradient: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600',
      shadow: 'shadow-indigo-500/15',
    },
    emerald: {
      gradient: 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600',
      shadow: 'shadow-cyan-500/15',
    },
    amber: {
      gradient: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700',
      shadow: 'shadow-blue-500/15',
    },
    red: {
      gradient: 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500',
      shadow: 'shadow-rose-500/15',
    },
  };

  const colors = colorMap[color] || colorMap.aegis;

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl ${colors.gradient} ${colors.shadow} p-5 text-white shadow-xl relative overflow-hidden border border-white/10 group cursor-pointer`}
    >
      {/* Decorative inner glow circle */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none group-hover:scale-125 transition-transform" />

      <div className="flex items-start justify-between relative z-10 mb-2">
        <span className="text-[11px] font-semibold tracking-wider text-white/80 uppercase">
          {title}
        </span>
        <div className="p-2.5 rounded-full bg-white/20 text-white backdrop-blur-md shadow-inner shrink-0 group-hover:scale-110 transition-transform">
          <Icon size={18} />
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-3xl font-extrabold text-white tracking-tight mb-1">{value}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/90 font-medium">Verisight Metric</span>
          {change !== undefined && (
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full text-white">
              {change >= 0 ? '+' : ''}{change}%
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}




