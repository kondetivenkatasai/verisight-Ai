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
        rounded-2xl bg-white dark:bg-[#111726] border border-gray-150 dark:border-[#1e2942]
        text-gray-900 dark:text-white transition-all duration-300 shadow-sm dark:shadow-xl
        ${hover ? 'cursor-pointer hover:border-purple-200 dark:hover:border-blue-500/50 hover:shadow-md' : ''}
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

