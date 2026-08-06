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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={`
        rounded-2xl bg-surface-900/50 border border-surface-700/30
        backdrop-blur-sm transition-all duration-300
        ${hover ? 'cursor-pointer hover:border-aegis-500/30' : ''}
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
