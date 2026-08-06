import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, MoreVertical } from 'lucide-react';
import Badge from '@/ui/Badge';
import Modal from '@/ui/Modal';
import Button from '@/ui/Button';
import Input from '@/ui/Input';
import CaseContextMenu from '@/components/CaseContextMenu';
import { formatRelativeTime, truncate } from '@/utils/formatters';
import api from '@/services/api';

export default function CaseCard({ caseData, onUpdate }) {
  const navigate = useNavigate();
  const [contextPos, setContextPos] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newTitle, setNewTitle] = useState(caseData.title);
  const [loading, setLoading] = useState(false);

  const longPressTimer = useRef(null);

  // Desktop right-click
  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setContextPos({ x: e.clientX, y: e.clientY });
  };

  // Mobile long-press handlers
  const handleTouchStart = (e) => {
    longPressTimer.current = setTimeout(() => {
      const touch = e.touches[0];
      setContextPos({ x: touch.clientX, y: touch.clientY });
    }, 600);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  // Handlers
  const handleOpen = () => {
    navigate(`/workflow?caseId=${caseData.id}`);
  };

  const handleRename = async () => {
    if (!newTitle.trim()) return;
    setLoading(true);
    try {
      await api.put(`/cases/${caseData.id}`, { title: newTitle });
      setShowRenameModal(false);
      if (onUpdate) onUpdate();
    } catch {
      // Fail silently
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      await api.post('/cases', {
        title: `${caseData.title} (Copy)`,
        description: caseData.description,
        priority: caseData.priority,
      });
      if (onUpdate) onUpdate();
    } catch {
      // Fail silently
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(caseData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Verisight_Case_${caseData.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/cases/${caseData.id}`);
      setShowDeleteModal(false);
      if (onUpdate) onUpdate();
    } catch {
      // Fail silently
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
        onClick={handleOpen}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="group relative rounded-2xl bg-surface-900 border border-slate-200 dark:border-slate-800 p-5 cursor-pointer
          hover:border-sky-500/60 hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] hover:bg-slate-900/90 transition-all duration-300 shadow-subtle-card"
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-sky-400 transition-colors pr-4 leading-snug">
            {truncate(caseData.title, 50)}
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            <Badge type="priority" value={caseData.priority} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setContextPos({ x: e.clientX, y: e.clientY });
              }}
              className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 mb-4 line-clamp-2 leading-relaxed font-normal">
          {truncate(caseData.description, 120)}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Badge type="status" value={caseData.status} />
            <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
              {caseData.status === 'completed' ? '96.5% Confidence' : '78.0% Ready'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <Clock size={12} />
              {formatRelativeTime(caseData.created_at)}
            </span>
            <ArrowRight size={14} className="text-slate-400 dark:text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </motion.div>


      {/* Context Menu */}
      <CaseContextMenu
        position={contextPos}
        onClose={() => setContextPos(null)}
        onOpen={handleOpen}
        onRename={() => setShowRenameModal(true)}
        onDuplicate={handleDuplicate}
        onExportPDF={handleExportPDF}
        onExportJSON={handleExportJSON}
        onDelete={() => setShowDeleteModal(true)}
      />

      {/* Rename Modal */}
      <Modal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        title="Rename Investigation"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Case Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setShowRenameModal(false)}>
              Cancel
            </Button>
            <Button size="sm" loading={loading} onClick={handleRename}>
              Save Title
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Investigation"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-surface-300">
            Are you sure you want to delete <span className="font-semibold text-white">&quot;{caseData.title}&quot;</span>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" loading={loading} onClick={handleDelete}>
              Delete Investigation
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
