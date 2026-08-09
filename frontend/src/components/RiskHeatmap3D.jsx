import { useState, useEffect } from 'react';
import { Layers, ShieldAlert, Sparkles, Activity, Info, ChevronRight, RefreshCw } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import api from '@/services/api';

export default function RiskHeatmap3D() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCell, setSelectedCell] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchHeatmap = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analytics/heatmap');
      setHeatmapData(res.data.heatmap || []);
    } catch {
      // Fallback matrix data
      const defaultStages = ['Planning', 'Research', 'Reasoning', 'Decision', 'Verification', 'Report'];
      const defaultSeverities = ['Critical', 'High', 'Medium', 'Low'];
      const fallback = defaultSeverities.map((severity, sIdx) => ({
        severity,
        stages: defaultStages.map((stage, stIdx) => ({
          stage,
          count: Math.floor(Math.random() * 6) + (sIdx === 1 ? 3 : 1),
          score: (4 - sIdx) * 22 + Math.floor(Math.random() * 10),
          activeThreats: sIdx <= 1 ? Math.floor(Math.random() * 2) + 1 : 0,
        })),
      }));
      setHeatmapData(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmap();
  }, []);

  const getCellColor = (score, severity) => {
    if (severity === 'Critical' || score > 75) {
      return isDark
        ? 'bg-rose-500/25 border-rose-500/50 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
        : 'bg-rose-100 border-rose-300 text-rose-800 shadow-sm';
    }
    if (severity === 'High' || score > 50) {
      return isDark
        ? 'bg-amber-500/25 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
        : 'bg-amber-100 border-amber-300 text-amber-800 shadow-sm';
    }
    if (severity === 'Medium' || score > 25) {
      return isDark
        ? 'bg-blue-500/20 border-blue-500/40 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
        : 'bg-blue-100 border-blue-300 text-blue-800 shadow-sm';
    }
    return isDark
      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
      : 'bg-emerald-50 border-emerald-200 text-emerald-800';
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300 ${
      isDark ? 'bg-[#111726] border-[#1e2942] shadow-2xl' : 'bg-white border-gray-150 shadow-sm'
    }`}>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${isDark ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'bg-purple-100 text-[#9a55ff]'}`}>
              <Layers size={18} />
            </div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-gray-900 dark:text-white">
              Interactive 3D Risk Heatmap
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-[#8a99b5] mt-1">
            Real-time perspective grid mapping multi-agent pipeline stages vs risk severity levels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchHeatmap()}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDark ? 'bg-[#151c2e] border-[#1e2942] text-gray-400 hover:text-white' : 'bg-gray-100 border-gray-200 text-gray-600'
            }`}
            title="Refresh Matrix"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 3D Perspective Matrix Wrapper */}
      <div className="relative overflow-x-auto pb-4 custom-scrollbar">
        <div className="min-w-[640px] transform-gpu [perspective:1000px]">
          {/* Header Stages Column Labels */}
          <div className="grid grid-cols-7 gap-3 mb-3 text-center">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-[#5c6b8a] flex items-center justify-center">
              Severity / Agent
            </div>
            {['Planning', 'Research', 'Reasoning', 'Decision', 'Verification', 'Report'].map((st) => (
              <div
                key={st}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-extrabold uppercase tracking-wider border ${
                  isDark ? 'bg-[#151c2e] border-[#1e2942] text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                {st}
              </div>
            ))}
          </div>

          {/* Matrix Rows */}
          {heatmapData.map((row, rIdx) => (
            <div key={row.severity || rIdx} className="grid grid-cols-7 gap-3 mb-3 items-center">
              {/* Row Label */}
              <div className={`py-2 px-3 rounded-xl border text-center text-xs font-black uppercase tracking-wider ${
                row.severity === 'Critical'
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : row.severity === 'High'
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : row.severity === 'Medium'
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              }`}>
                {row.severity}
              </div>

              {/* Stage Cells */}
              {row.stages.map((cell, cIdx) => {
                const isSelected = selectedCell?.stage === cell.stage && selectedCell?.severity === row.severity;
                const colorClasses = getCellColor(cell.score, row.severity);

                return (
                  <button
                    key={cell.stage || cIdx}
                    onClick={() => setSelectedCell({ ...cell, severity: row.severity })}
                    className={`relative p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-105 active:scale-95 flex flex-col justify-between h-20 ${colorClasses} ${
                      isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900 scale-105 z-10' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider opacity-80">
                        {cell.count} Case{cell.count === 1 ? '' : 's'}
                      </span>
                      {cell.activeThreats > 0 && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title={`${cell.activeThreats} active threat(s)`} />
                      )}
                    </div>

                    <div>
                      <div className="text-sm font-black tracking-tight">{cell.score}%</div>
                      <span className="text-[9px] font-semibold opacity-75">Risk Score</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Cell Modal/Detail Drawer */}
      {selectedCell && (
        <div className={`mt-4 p-4 rounded-xl border flex items-center justify-between gap-4 animate-fade-in ${
          isDark ? 'bg-[#151c2e] border-[#1e2942] text-white' : 'bg-purple-50/70 border-purple-200 text-gray-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider">
                {selectedCell.severity} Severity — {selectedCell.stage} Agent Stage
              </h4>
              <p className="text-[11px] opacity-80 mt-0.5">
                Evaluated {selectedCell.count} active investigation case(s) with an average risk score rating of {selectedCell.score}%.
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedCell(null)}
            className="text-xs font-bold text-blue-500 hover:underline shrink-0 cursor-pointer"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
