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
        className="fixed z-50 min-w-[200px] bg-white dark:bg-[#111726] border border-gray-200 dark:border-[#1e2942] rounded-2xl shadow-2xl p-1.5 backdrop-blur-xl text-xs font-semibold text-gray-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => { onOpen(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-gray-800 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-blue-600/20 hover:text-[#9a55ff] dark:hover:text-blue-400 rounded-xl transition-colors cursor-pointer"
        >
          <ExternalLink size={14} className="text-[#9a55ff] dark:text-blue-400" />
          <span>Open Investigation</span>
        </button>

        <button
          onClick={() => { onRename(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-gray-800 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-blue-600/20 hover:text-gray-900 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          <Edit3 size={14} className="text-indigo-600 dark:text-indigo-400" />
          <span>Rename</span>
        </button>

        <button
          onClick={() => { onDuplicate(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-gray-800 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-blue-600/20 hover:text-gray-900 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          <Copy size={14} className="text-purple-600 dark:text-purple-400" />
          <span>Duplicate</span>
        </button>

        <div className="my-1 border-t border-gray-150 dark:border-[#1e2942]" />

        <button
          onClick={() => { onExportPDF(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-gray-800 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-blue-600/20 hover:text-gray-900 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          <FileText size={14} className="text-emerald-600 dark:text-emerald-400" />
          <span>Export PDF</span>
        </button>

        <button
          onClick={() => { onExportJSON(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-gray-800 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-blue-600/20 hover:text-gray-900 dark:hover:text-white rounded-xl transition-colors cursor-pointer"
        >
          <Download size={14} className="text-amber-600 dark:text-amber-400" />
          <span>Export JSON</span>
        </button>

        <div className="my-1 border-t border-gray-150 dark:border-[#1e2942]" />

        <button
          onClick={() => { onDelete(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer font-bold"
        >
          <Trash2 size={14} />
          <span>Delete Case</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

