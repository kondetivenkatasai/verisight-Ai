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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        style={{ top: position.y, left: position.x }}
        className="fixed z-50 min-w-[180px] bg-surface-900 border border-surface-700/60 rounded-xl shadow-2xl p-1.5 backdrop-blur-xl text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => { onOpen(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-surface-200 hover:bg-aegis-600/20 hover:text-white rounded-lg transition-colors"
        >
          <ExternalLink size={14} className="text-aegis-400" />
          <span>Open Investigation</span>
        </button>

        <button
          onClick={() => { onRename(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-surface-200 hover:bg-surface-800 hover:text-white rounded-lg transition-colors"
        >
          <Edit3 size={14} className="text-indigo-400" />
          <span>Rename</span>
        </button>

        <button
          onClick={() => { onDuplicate(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-surface-200 hover:bg-surface-800 hover:text-white rounded-lg transition-colors"
        >
          <Copy size={14} className="text-purple-400" />
          <span>Duplicate</span>
        </button>

        <div className="my-1 border-t border-surface-800/50" />

        <button
          onClick={() => { onExportPDF(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-surface-200 hover:bg-surface-800 hover:text-white rounded-lg transition-colors"
        >
          <FileText size={14} className="text-emerald-400" />
          <span>Export PDF</span>
        </button>

        <button
          onClick={() => { onExportJSON(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-surface-200 hover:bg-surface-800 hover:text-white rounded-lg transition-colors"
        >
          <Download size={14} className="text-amber-400" />
          <span>Export JSON</span>
        </button>

        <div className="my-1 border-t border-surface-800/50" />

        <button
          onClick={() => { onDelete(); onClose(); }}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <Trash2 size={14} />
          <span>Delete Case</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
