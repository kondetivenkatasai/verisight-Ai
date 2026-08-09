import { useState } from 'react';
import { FileText, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { formatDate, getRiskColor } from '@/utils/formatters';
import Modal from '@/ui/Modal';
import Button from '@/ui/Button';

export default function ReportCard({ report, onClick, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const caseTitle =
    report.cases?.title ||
    report.case_title ||
    report.title ||
    (report.summary?.match(/EXECUTIVE SUMMARY FOR CASE:\s*"(.*?)"/i)?.[1]) ||
    'Decision Intelligence Report';

  // Clean summary text for preview
  const displaySummary = (report.summary || '')
    .replace(/^EXECUTIVE SUMMARY FOR CASE:\s*".*?"\s*/i, '')
    .trim() || report.summary;

  const handleDelete = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      if (onDelete) await onDelete(report.id);
      setShowDeleteModal(false);
    } catch {
      // Fail silently
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={onClick}
        className="rounded-2xl bg-white dark:bg-[#111726] border border-gray-150 dark:border-[#1e2942] p-5 cursor-pointer
          hover:border-purple-500/60 dark:hover:border-blue-500/60 hover:shadow-lg transition-all duration-300 shadow-sm group relative"
      >
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 dark:bg-blue-500/10 border border-purple-500/20 dark:border-blue-500/20 text-[#9a55ff] dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
            <FileText size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white group-hover:text-[#9a55ff] dark:group-hover:text-blue-400 transition-colors truncate" title={caseTitle}>
                {caseTitle}
              </h3>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  95.0% Confidence
                </span>
                {onDelete && (
                  <button
                    title="Delete Report"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteModal(true);
                    }}
                    className="p-1.5 rounded-lg transition-colors cursor-pointer text-rose-500/80 hover:text-rose-600 hover:bg-rose-500/10 opacity-70 hover:opacity-100"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-[#8a99b5] font-semibold mt-0.5">{formatDate(report.created_at)}</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed font-normal">{displaySummary}</p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-[#1c273e]">
          <div className="flex items-center gap-1.5">
            {report.decision === 'approved' ? (
              <CheckCircle size={14} className="text-emerald-500 dark:text-emerald-400" />
            ) : (
              <AlertTriangle size={14} className="text-amber-500 dark:text-amber-400" />
            )}
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200 capitalize">{report.decision}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500 dark:text-[#8a99b5] font-semibold">Risk Level:</span>
            <span className={`text-xs font-black ${getRiskColor(report.risk_score)}`}>
              {report.risk_score}%
            </span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Decision Report"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Are you sure you want to permanently delete this report for <span className="font-semibold text-gray-900 dark:text-white">&quot;{caseTitle}&quot;</span>? This will remove it from the database.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" loading={loading} onClick={handleDelete}>
              Delete Report
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}



