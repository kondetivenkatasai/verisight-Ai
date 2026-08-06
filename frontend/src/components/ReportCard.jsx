import { FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatDate, getRiskColor } from '@/utils/formatters';

export default function ReportCard({ report, onClick }) {
  return (
    <div
      onClick={onClick}
      className="rounded-2xl bg-surface-900 border border-slate-200 dark:border-slate-800 p-5 cursor-pointer
        hover:border-purple-500/60 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] hover:bg-slate-900/90 transition-all duration-300 shadow-subtle-card group"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 shrink-0 group-hover:scale-110 transition-transform">
          <FileText size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-purple-400 transition-colors truncate">
              Decision Intelligence Report
            </h3>
            <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              95.0% Confidence
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">{formatDate(report.created_at)}</p>
        </div>
      </div>

      <p className="text-xs text-slate-700 dark:text-slate-300 mb-4 line-clamp-2 leading-relaxed font-normal">{report.summary}</p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          {report.decision === 'approved' ? (
            <CheckCircle size={14} className="text-emerald-500 dark:text-emerald-400" />
          ) : (
            <AlertTriangle size={14} className="text-amber-500 dark:text-amber-400" />
          )}
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize">{report.decision}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Risk Level:</span>
          <span className={`text-xs font-black ${getRiskColor(report.risk_score)}`}>
            {report.risk_score}%
          </span>
        </div>
      </div>
    </div>
  );
}


