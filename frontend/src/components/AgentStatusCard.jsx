import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { formatDuration, formatPercentage } from '@/utils/formatters';

const statusConfig = {
  pending: { icon: Clock, color: 'text-surface-400', bg: 'bg-surface-700/30', label: 'Pending' },
  running: { icon: Loader2, color: 'text-aegis-400', bg: 'bg-aegis-500/10', label: 'Running', animate: true },
  completed: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Completed' },
  failed: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Failed' },
};

export default function AgentStatusCard({ agent }) {
  const config = statusConfig[agent.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-xl border border-surface-700/30 p-4 ${config.bg} transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StatusIcon
            size={16}
            className={`${config.color} ${config.animate ? 'animate-spin' : ''}`}
          />
          <span className="text-sm font-medium text-surface-200">{agent.agent_name}</span>
        </div>
        <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
      </div>

      {agent.status === 'completed' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-surface-400">Confidence</span>
            <span className="text-surface-200 font-medium">
              {formatPercentage(agent.confidence)}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-surface-800/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${agent.confidence}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-aegis-500 to-aegis-400"
            />
          </div>
          {agent.execution_time && (
            <p className="text-xs text-surface-500 mt-1">
              {formatDuration(agent.execution_time)}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
