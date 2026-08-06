import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { formatDuration, formatPercentage } from '@/utils/formatters';

const agentHoverTheme = {
  PlanningAgent: {
    borderHover: 'hover:border-cyan-500/60',
    shadowHover: 'hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]',
    bgHover: 'hover:bg-cyan-950/20',
    accentText: 'text-cyan-400',
    progressGradient: 'from-cyan-500 to-blue-500',
  },
  ResearchAgent: {
    borderHover: 'hover:border-indigo-500/60',
    shadowHover: 'hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]',
    bgHover: 'hover:bg-indigo-950/20',
    accentText: 'text-indigo-400',
    progressGradient: 'from-indigo-500 to-purple-500',
  },
  ReasoningAgent: {
    borderHover: 'hover:border-purple-500/60',
    shadowHover: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]',
    bgHover: 'hover:bg-purple-950/20',
    accentText: 'text-purple-400',
    progressGradient: 'from-purple-500 to-pink-500',
  },
  DecisionAgent: {
    borderHover: 'hover:border-emerald-500/60',
    shadowHover: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]',
    bgHover: 'hover:bg-emerald-950/20',
    accentText: 'text-emerald-400',
    progressGradient: 'from-emerald-500 to-teal-400',
  },
  VerificationAgent: {
    borderHover: 'hover:border-amber-500/60',
    shadowHover: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]',
    bgHover: 'hover:bg-amber-950/20',
    accentText: 'text-amber-400',
    progressGradient: 'from-amber-500 to-orange-500',
  },
  ReportAgent: {
    borderHover: 'hover:border-rose-500/60',
    shadowHover: 'hover:shadow-[0_0_25px_rgba(244,63,94,0.3)]',
    bgHover: 'hover:bg-rose-950/20',
    accentText: 'text-rose-400',
    progressGradient: 'from-rose-500 to-red-500',
  },
};

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-slate-400',
    bg: 'bg-slate-800/40 dark:bg-slate-900/60',
    border: 'border-slate-700/60 dark:border-slate-800',
    label: '0% Pending',
    progress: 0,
  },
  running: {
    icon: Loader2,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/40',
    label: '65% Running...',
    animate: true,
    progress: 65,
  },
  completed: {
    icon: CheckCircle,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/40',
    label: '100% Complete',
    progress: 100,
  },
  failed: {
    icon: AlertCircle,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/40',
    label: 'Failed',
    progress: 0,
  },
};

export default function AgentStatusCard({ agent = {} }) {
  const safeAgent = agent || {};
  const status = statusConfig[safeAgent.status] || statusConfig.pending;
  const hoverTheme = agentHoverTheme[safeAgent.agent_name] || agentHoverTheme.PlanningAgent;
  const StatusIcon = status.icon;

  const confidencePct = safeAgent.confidence || (safeAgent.status === 'completed' ? 95 : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl border ${status.border} p-5 ${status.bg} backdrop-blur-xl shadow-subtle-card transition-all duration-300 ${hoverTheme.borderHover} ${hoverTheme.shadowHover} ${hoverTheme.bgHover} group`}
    >
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg ${status.bg} border ${status.border} group-hover:scale-110 transition-transform`}>
            <StatusIcon
              size={18}
              className={`${status.color} ${status.animate ? 'animate-spin' : ''}`}
            />
          </div>
          <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider group-hover:text-cyan-400 transition-colors">
            {safeAgent.agent_name || 'Agent'}
          </span>
        </div>
        <span className={`text-[11px] font-extrabold tracking-wide uppercase px-2.5 py-0.5 rounded-full ${status.bg} ${status.color} border ${status.border}`}>
          {status.label}
        </span>
      </div>

      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-600 dark:text-slate-400">Confidence Score</span>
          <span className={`font-black ${hoverTheme.accentText}`}>
            {formatPercentage(confidencePct)}
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${safeAgent.status === 'completed' ? confidencePct : status.progress}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`h-full rounded-full bg-gradient-to-r ${hoverTheme.progressGradient}`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-0.5">
          <span>Execution Time</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {safeAgent.execution_time ? formatDuration(safeAgent.execution_time) : '0.00s'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}


