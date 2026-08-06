import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hover = false,
  glow = false,
  padding = 'p-6',
  onClick,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hover ? { y: -2, transition: { duration: 0.15 } } : {}}
      onClick={onClick}
      className={`
        rounded-2xl bg-surface-900 border border-slate-200 dark:border-slate-800
        backdrop-blur-xl transition-all duration-300 shadow-subtle-card
        ${hover ? 'cursor-pointer hover:border-sky-500/50 hover:shadow-[0_0_25px_rgba(56,189,248,0.2)] hover:bg-slate-900/90' : ''}
        ${glow ? 'glow' : ''}
        ${padding}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}

