import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, Clock, AlertTriangle, Plus, GitBranch, FileText, BarChart3, ChevronRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/ui/Button';
import RadialGlowButton from '@/ui/RadialGlowButton';
import StatsCard from '@/components/StatsCard';
import CaseCard from '@/components/CaseCard';
import { SkeletonCard } from '@/ui/Loader';
import { useCase } from '@/hooks/useCase';
import { useAnalytics } from '@/hooks/useAnalytics';
import { staggerContainer, staggerItem, pageTransition } from '@/animations/variants';

export default function Dashboard() {
  const navigate = useNavigate();
  const { cases, loading: casesLoading, fetchCases } = useCase();
  const { stats } = useAnalytics();

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const statsCards = [
    { title: 'Total Cases', value: stats?.totalCases || cases.length || 0, icon: Briefcase, color: 'aegis' },
    { title: 'Completed', value: stats?.completedCases || cases.filter(c => c.status === 'completed').length || 0, icon: CheckCircle, color: 'emerald' },
    { title: 'In Progress', value: stats?.inProgressCases || cases.filter(c => c.status === 'in_progress' || c.status === 'open').length || 0, icon: Clock, color: 'amber' },
    { title: 'Critical / High', value: stats?.highPriorityCases || cases.filter(c => c.priority === 'high' || c.priority === 'critical').length || 0, icon: AlertTriangle, color: 'red' },
  ];

  return (
    <motion.div {...pageTransition} className="space-y-8">
      {/* Header & Quick Launch CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-white tracking-tight">
            Decision Intelligence Dashboard
          </h1>
          <p className="text-surface-600 dark:text-surface-400 text-sm mt-1 font-normal">
            Real-time overview of active investigations, agent performance, and risk metrics
          </p>
        </div>
        <RadialGlowButton icon={Plus} onClick={() => navigate('/create-case')} size="md">
          New Investigation
        </RadialGlowButton>
      </div>

      {/* Latest Metrics Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statsCards.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </motion.div>

      {/* Quick Actions Panel */}
      <div className="rounded-2xl bg-surface-900 border border-surface-300 dark:border-white/[0.08] p-6 backdrop-blur-xl shadow-subtle-card">
        <h2 className="text-xs font-bold text-surface-600 dark:text-surface-400 uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/create-case')}
            className="flex items-center justify-between p-4 rounded-xl bg-surface-100 dark:bg-surface-800/40 border border-surface-200 dark:border-white/5 hover:border-aegis-500/40 hover:bg-surface-200/60 dark:hover:bg-surface-800/80 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-aegis-500/10 text-aegis-600 dark:text-aegis-400 border border-aegis-500/20">
                <Plus size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-surface-900 dark:text-white">Create Case</p>
                <p className="text-[11px] text-surface-500">Submit new input</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-surface-400 dark:text-surface-500 group-hover:text-aegis-600 dark:group-hover:text-aegis-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            onClick={() => navigate('/workflow')}
            className="flex items-center justify-between p-4 rounded-xl bg-surface-100 dark:bg-surface-800/40 border border-surface-200 dark:border-white/5 hover:border-indigo-500/40 hover:bg-surface-200/60 dark:hover:bg-surface-800/80 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <GitBranch size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-surface-900 dark:text-white">AI Workflow</p>
                <p className="text-[11px] text-surface-500">Run agent pipeline</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-surface-400 dark:text-surface-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            onClick={() => navigate('/reports')}
            className="flex items-center justify-between p-4 rounded-xl bg-surface-100 dark:bg-surface-800/40 border border-surface-200 dark:border-white/5 hover:border-emerald-500/40 hover:bg-surface-200/60 dark:hover:bg-surface-800/80 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <FileText size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-surface-900 dark:text-white">Reports Library</p>
                <p className="text-[11px] text-surface-500">Search & export</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-surface-400 dark:text-surface-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            onClick={() => navigate('/analytics')}
            className="flex items-center justify-between p-4 rounded-xl bg-surface-100 dark:bg-surface-800/40 border border-surface-200 dark:border-white/5 hover:border-purple-500/40 hover:bg-surface-200/60 dark:hover:bg-surface-800/80 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <BarChart3 size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-surface-900 dark:text-white">Analytics</p>
                <p className="text-[11px] text-surface-500">System insights</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-surface-400 dark:text-surface-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      </div>

      {/* Recent Investigations List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-surface-900 dark:text-white tracking-tight">Recent Investigations</h2>
          <button
            onClick={() => fetchCases()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-aegis-600 dark:text-aegis-400 hover:text-aegis-500 transition-colors cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Refresh</span>
          </button>
        </div>

        {casesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : cases.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {cases.slice(0, 6).map((c) => (
              <motion.div key={c.id} variants={staggerItem}>
                <CaseCard caseData={c} onUpdate={fetchCases} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="rounded-2xl bg-surface-900 border border-surface-300 dark:border-white/[0.08] p-12 text-center shadow-subtle-card">
            <Briefcase size={40} className="mx-auto mb-4 text-surface-400 dark:text-surface-600" />
            <h3 className="text-lg font-bold text-surface-900 dark:text-surface-200 mb-2">No active investigations</h3>
            <p className="text-sm text-surface-500 mb-6 font-normal">Create your first case to initiate multi-agent AI analysis</p>
            <Button onClick={() => navigate('/create-case')} icon={Plus}>
              Create Case
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

