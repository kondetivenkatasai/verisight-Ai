import { FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatDate, getRiskColor } from '@/utils/formatters';

export default function ReportCard({ report, onClick }) {
  return (
    <div
      onClick={onClick}
      className="rounded-2xl bg-surface-900/50 border border-surface-700/30 p-5 cursor-pointer
        hover:border-aegis-500/30 transition-all duration-300 group"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 rounded-lg bg-aegis-500/10">
          <FileText size={18} className="text-aegis-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-surface-200 group-hover:text-aegis-300 transition-colors truncate">
            Case Report
          </h3>
          <p className="text-xs text-surface-500">{formatDate(report.created_at)}</p>
        </div>
      </div>

      <p className="text-xs text-surface-400 mb-4 line-clamp-2">{report.summary}</p>

      <div className="flex items-center justify-between pt-3 border-t border-surface-800/30">
        <div className="flex items-center gap-1.5">
          {report.decision === 'approved' ? (
            <CheckCircle size={14} className="text-emerald-400" />
          ) : (
            <AlertTriangle size={14} className="text-amber-400" />
          )}
          <span className="text-xs text-surface-300 capitalize">{report.decision}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-surface-500">Risk:</span>
          <span className={`text-xs font-semibold ${getRiskColor(report.risk_score)}`}>
            {report.risk_score}%
          </span>
        </div>
      </div>
    </div>
  );
}
