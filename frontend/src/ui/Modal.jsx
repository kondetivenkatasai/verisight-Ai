import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-6xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`relative ${sizes[size] || sizes.md} w-full max-h-[90vh] flex flex-col bg-white dark:bg-[#111318] border border-surface-300 dark:border-white/10 rounded-2xl shadow-elevated-card overflow-hidden z-10`}
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#111318]/95 backdrop-blur-md px-6 py-4 border-b border-surface-200 dark:border-white/10 flex items-center justify-between shrink-0">
              <h2 className="text-base font-bold text-surface-900 dark:text-white tracking-tight">{title}</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-surface-200 dark:hover:bg-surface-800 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Close Modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar scroll-smooth flex-1 space-y-4">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

