import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Edit3, Copy, FileText, Download, Trash2 } from 'lucide-react';

export default function CaseContextMenu({ position, onClose, onOpen, onRename, onDuplicate, onExportPDF, onExportJSON, onDelete }) {
  useEffect(() => {
    const handleClickOutside = () => onClose();
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  if (!position) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -4 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
        style={{ top: position.y, left: position.x }}
        className="fixed z-50 min-w-[190px] bg-brand-surface border border-surface-200 dark:border-white/10 rounded-2xl shadow-elevated-card p-1.5 backdrop-blur-xl text-xs font-medium"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => { onOpen(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-surface-700 dark:text-surface-200 hover:bg-aegis-500/10 hover:text-aegis-600 dark:hover:text-aegis-400 rounded-xl transition-colors cursor-pointer"
        >
          <ExternalLink size={14} className="text-aegis-600 dark:text-aegis-400" />
          <span>Open Investigation</span>
        </button>

        <button
          onClick={() => { onRename(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800/80 hover:text-surface-900 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          <Edit3 size={14} className="text-indigo-600 dark:text-indigo-400" />
          <span>Rename</span>
        </button>

        <button
          onClick={() => { onDuplicate(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800/80 hover:text-surface-900 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          <Copy size={14} className="text-purple-600 dark:text-purple-400" />
          <span>Duplicate</span>
        </button>

        <div className="my-1 border-t border-surface-200 dark:border-white/5" />

        <button
          onClick={() => { onExportPDF(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800/80 hover:text-surface-900 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          <FileText size={14} className="text-emerald-600 dark:text-emerald-400" />
          <span>Export PDF</span>
        </button>

        <button
          onClick={() => { onExportJSON(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800/80 hover:text-surface-900 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          <Download size={14} className="text-amber-600 dark:text-amber-400" />
          <span>Export JSON</span>
        </button>

        <div className="my-1 border-t border-surface-200 dark:border-white/5" />

        <button
          onClick={() => { onDelete(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
        >
          <Trash2 size={14} />
          <span>Delete Case</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

