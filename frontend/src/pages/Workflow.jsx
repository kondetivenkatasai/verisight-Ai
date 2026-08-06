import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, RefreshCw, FileText } from 'lucide-react';
import Button from '@/ui/Button';
import RadialGlowButton from '@/ui/RadialGlowButton';
import Card from '@/ui/Card';
import AgentStatusCard from '@/components/AgentStatusCard';
import { PageLoader } from '@/ui/Loader';
import { caseService } from '@/services/caseService';
import { AGENT_NAMES } from '@/utils/constants';
import { pageTransition, staggerContainer, staggerItem } from '@/animations/variants';

export default function Workflow() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const caseId = searchParams.get('caseId');
  const [caseData, setCaseData] = useState(null);
  const [agents, setAgents] = useState([]);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    if (!caseId) return;
    try {
      const [caseRes, statusRes] = await Promise.all([
        caseService.getById(caseId),
        caseService.getWorkflowStatus(caseId),
      ]);
      setCaseData(caseRes.data.case);
      setAgents(statusRes.data.agents || AGENT_NAMES.map((name) => ({ agent_name: name, status: 'pending' })));
    } catch {
      setAgents(AGENT_NAMES.map((name) => ({ agent_name: name, status: 'pending' })));
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleRun = async () => {
    if (!caseId) return;
    setRunning(true);
    try {
      await caseService.runWorkflow(caseId);
      // Poll for updates sequentially
      const interval = setInterval(async () => {
        try {
          const res = await caseService.getWorkflowStatus(caseId);
          const agentData = res.data.agents || [];
          setAgents(agentData);
          const allDone = agentData.length > 0 && agentData.every((a) => a.status === 'completed' || a.status === 'failed');
          if (allDone) {
            clearInterval(interval);
            setRunning(false);
            fetchStatus();
          }
        } catch {
          clearInterval(interval);
          setRunning(false);
        }
      }, 1500);
    } catch {
      setRunning(false);
    }
  };

  if (!caseId) {
    return (
      <motion.div {...pageTransition} className="text-center py-20">
        <p className="text-surface-400">Select a case from the dashboard to view its workflow.</p>
      </motion.div>
    );
  }

  if (loading) return <PageLoader />;

  const isFinished = agents.length > 0 && agents.every((a) => a.status === 'completed');

  return (
    <motion.div {...pageTransition}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Agent Workflow</h1>
          <p className="text-surface-400 text-sm mt-1">
            {caseData?.title || 'Case Pipeline'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={RefreshCw} onClick={fetchStatus} size="sm">
            Refresh
          </Button>
          {isFinished ? (
            <RadialGlowButton icon={FileText} onClick={() => navigate('/reports')} size="sm">
              View Report
            </RadialGlowButton>
          ) : (
            <RadialGlowButton icon={Play} onClick={handleRun} loading={running} size="sm">
              {running ? 'Investigating...' : 'Start Investigation'}
            </RadialGlowButton>
          )}
        </div>
      </div>

      {/* Pipeline Visualization */}
      <Card className="mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {agents.map((agent, index) => (
            <div key={agent.agent_name} className="flex items-center">
              <div
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  agent.status === 'completed'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    : agent.status === 'running'
                    ? 'bg-aegis-500/15 text-aegis-400 border border-aegis-500/20 animate-pulse'
                    : agent.status === 'failed'
                    ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                    : 'bg-surface-800/50 text-surface-400 border border-surface-700/30'
                }`}
              >
                {agent.agent_name.replace('Agent', '')}
              </div>
              {index < agents.length - 1 && (
                <div className={`w-8 h-px mx-1 ${
                  agent.status === 'completed' ? 'bg-emerald-500/40' : 'bg-surface-700/30'
                }`} />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Agent Details */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {agents.map((agent) => (
          <motion.div key={agent.agent_name} variants={staggerItem}>
            <AgentStatusCard agent={agent} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
