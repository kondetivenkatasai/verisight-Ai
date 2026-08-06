import { motion } from 'framer-motion';
import { staggerItem } from '@/animations/variants';

export default function StatsCard({ title, value, change, icon: Icon, color = 'aegis' }) {
  const colorMap = {
    aegis: {
      gradient: 'bg-gradient-to-r from-[#ffbf96] via-[#fe7096] to-[#fe7096]',
      shadow: 'shadow-rose-500/20',
      label: 'Increased by 60%',
    },
    emerald: {
      gradient: 'bg-gradient-to-r from-[#90caf9] via-[#047fff] to-[#047fff]',
      shadow: 'shadow-blue-500/20',
      label: 'Decreased by 10%',
    },
    amber: {
      gradient: 'bg-gradient-to-r from-[#84d9d2] via-[#07cdae] to-[#07cdae]',
      shadow: 'shadow-teal-500/20',
      label: 'Increased by 5%',
    },
    red: {
      gradient: 'bg-gradient-to-r from-[#da8cff] via-[#9a55ff] to-[#9a55ff]',
      shadow: 'shadow-purple-500/20',
      label: 'Critical Priority',
    },
  };

  const colors = colorMap[color] || colorMap.aegis;

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl ${colors.gradient} ${colors.shadow} p-6 text-white shadow-xl relative overflow-hidden group cursor-pointer`}
    >
      {/* Translucent concentric circle overlays matching the image */}
      <div className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full border-[14px] border-white/15 pointer-events-none group-hover:scale-110 transition-transform" />
      <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full border-[16px] border-white/10 pointer-events-none" />

      <div className="flex items-start justify-between relative z-10 mb-3">
        <span className="text-xs font-medium text-white/90">
          {title}
        </span>
        <div className="p-2.5 rounded-full bg-white/20 text-white backdrop-blur-md shrink-0 group-hover:scale-110 transition-transform">
          <Icon size={18} />
        </div>
      </div>

      <div className="relative z-10 mt-2">
        <p className="text-3xl font-extrabold text-white tracking-tight mb-2">{value}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-semibold text-white/95">
            {change !== undefined ? `${change >= 0 ? 'Increased' : 'Decreased'} by ${Math.abs(change)}%` : colors.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}





