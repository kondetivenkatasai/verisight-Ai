import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, RefreshCw, FileText, AlertCircle } from 'lucide-react';
import Button from '@/ui/Button';
import RadialGlowButton from '@/ui/RadialGlowButton';
import Card from '@/ui/Card';
import Badge from '@/ui/Badge';
import AgentStatusCard from '@/components/AgentStatusCard';
import CustomAgentBuilder from '@/components/CustomAgentBuilder';
import AIAudioPlayer from '@/components/AIAudioPlayer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { PageLoader } from '@/ui/Loader';
import { caseService } from '@/services/caseService';
import { AGENT_NAMES } from '@/utils/constants';
import { pageTransition, staggerContainer, staggerItem } from '@/animations/variants';

export default function Workflow() {
  return (
    <ErrorBoundary>
      <WorkflowContent />
    </ErrorBoundary>
  );
}

function WorkflowContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryCaseId = searchParams.get('caseId');

  const [activeCaseId, setActiveCaseId] = useState(queryCaseId);
  const [caseData, setCaseData] = useState(null);
  const [agents, setAgents] = useState([]);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const defaultAgents = AGENT_NAMES.map((name) => ({
    agent_name: name,
    status: 'pending',
    confidence: 0,
    execution_time: 0,
  }));

  const pollIntervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setRunning(false);
  }, []);

  // Synchronize query parameter changes
  useEffect(() => {
    if (queryCaseId) {
      setActiveCaseId(queryCaseId);
    }
  }, [queryCaseId]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  // Main data fetcher
  const loadWorkflowData = async (targetId) => {
    setLoading(true);
    setFetchError(null);
    let resolvedId = targetId || queryCaseId || activeCaseId;

    if (!resolvedId) {
      try {
        const casesRes = await caseService.getAll({ limit: 1 });
        const firstCase = casesRes.data?.cases?.[0];
        if (firstCase?.id) {
          resolvedId = firstCase.id;
          setActiveCaseId(firstCase.id);
        }
      } catch (err) {
        console.warn('Failed to fetch fallback case:', err);
      }
    }

    if (!resolvedId) {
      setAgents(defaultAgents);
      setLoading(false);
      return;
    }

    try {
      const [caseRes, statusRes] = await Promise.all([
        caseService.getById(resolvedId),
        caseService.getWorkflowStatus(resolvedId),
      ]);
      setCaseData(caseRes.data?.case || null);
      const rawAgents = statusRes.data?.agents;
      setAgents(Array.isArray(rawAgents) && rawAgents.length > 0 ? rawAgents : defaultAgents);
    } catch (err) {
      console.error('Failed to load workflow data:', err);
      setFetchError('Unable to load investigation status. Please click Refresh to retry.');
      setAgents(defaultAgents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflowData(activeCaseId || queryCaseId);
  }, [activeCaseId, queryCaseId]);

  const handleRun = async () => {
    const targetId = activeCaseId || queryCaseId;
    if (!targetId || running) return;

    stopPolling();
    setRunning(true);
    try {
      await caseService.runWorkflow(targetId);

      // Max 30s safety timeout
      timeoutRef.current = setTimeout(() => {
        stopPolling();
        loadWorkflowData(targetId);
      }, 30000);

      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await caseService.getWorkflowStatus(targetId);
          const agentData = res.data?.agents;
          if (Array.isArray(agentData) && agentData.length > 0) {
            setAgents(agentData);
          }
          const allDone = Array.isArray(agentData) && agentData.length > 0 && agentData.every((a) => a?.status === 'completed' || a?.status === 'failed');
          if (allDone) {
            stopPolling();
            loadWorkflowData(targetId);
          }
        } catch {
          stopPolling();
        }
      }, 500);
    } catch (err) {
      console.error('Failed to run workflow:', err);
      stopPolling();
    }
  };

  if (loading) return <PageLoader />;

  const currentId = activeCaseId || queryCaseId;

  if (!currentId) {
    return (
      <motion.div {...pageTransition} className="text-center py-20 space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">No Investigation Selected</h2>
        <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">Select an existing investigation from the Dashboard or create a new case to start the AI pipeline.</p>
        <Button onClick={() => navigate('/create-case')} size="md">
          Create New Case
        </Button>
      </motion.div>
    );
  }

  const safeAgents = Array.isArray(agents) && agents.length > 0 ? agents : defaultAgents;
  const isFinished = safeAgents.every((a) => a?.status === 'completed');
  const completedCount = safeAgents.filter((a) => a?.status === 'completed').length;
  const progressPct = ((completedCount / safeAgents.length) * 100).toFixed(1);

  return (
    <motion.div {...pageTransition} className="space-y-8">
      {fetchError && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2">
          <AlertCircle size={16} />
          {fetchError}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Agent Workflow</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 font-medium">
            {caseData?.title || 'Case Pipeline'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" icon={RefreshCw} onClick={() => loadWorkflowData(currentId)} size="sm">
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

      {/* AIAudioPlayer Spoken Case Summary */}
      <AIAudioPlayer
        textToRead={`Verisight AI Workflow Report for ${caseData?.title || 'Active Investigation Case'}. Pipeline progress is currently at ${progressPct} percent with 6 specialized agents evaluating risk and evidence.`}
        title="AI Voice Summary of Case Pipeline"
      />
      <Card className="mb-8 hover:border-sky-500/40 hover:shadow-[0_0_25px_rgba(56,189,248,0.15)] transition-all">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pipeline Status</h2>
          <Badge variant="aegis" size="sm">
            Progress: {progressPct}%
          </Badge>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {safeAgents.map((agent, index) => (
            <div key={agent?.agent_name || index} className="flex items-center">
              <div
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap border transition-all duration-200 ${
                  agent?.status === 'completed'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : agent?.status === 'running'
                    ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/40 animate-pulse hover:border-sky-500'
                    : agent?.status === 'failed'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50'
                }`}
              >
                {(agent?.agent_name || 'Agent').replace('Agent', '')}
              </div>
              {index < safeAgents.length - 1 && (
                <div className={`w-8 h-0.5 mx-1.5 rounded-full transition-colors ${
                  agent?.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'
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
        {safeAgents.map((agent, idx) => (
          <motion.div key={agent?.agent_name || `agent-${idx}`} variants={staggerItem}>
            <AgentStatusCard agent={agent} />
          </motion.div>
        ))}
      </motion.div>

      {/* Custom AI Agent Builder */}
      <CustomAgentBuilder />
    </motion.div>
  );
}
