import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, Clock, AlertTriangle, Plus, GitBranch, FileText, BarChart3, ChevronRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
    <motion.div {...pageTransition} className="space-y-6">
      {/* Header & Quick Launch CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Decision Intelligence Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-normal">
            Real-time overview of active investigations, agent performance, and risk metrics
          </p>
        </div>
        <button
          onClick={() => navigate('/create-case')}
          className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#da8cff] to-[#9a55ff] hover:from-[#c87be5] hover:to-[#8843ed] text-white font-semibold text-xs sm:text-sm shadow-md shadow-purple-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>New Investigation</span>
        </button>
      </div>

      {/* 4 Gradient Stat Cards matching Image */}
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
      <div className="rounded-2xl bg-white border border-gray-150 p-6 shadow-sm">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <button
            onClick={() => navigate('/create-case')}
            className="flex items-center justify-between p-4 rounded-xl bg-purple-50/30 border border-gray-100 hover:border-purple-200 hover:bg-purple-50/70 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 text-[#9a55ff]">
                <Plus size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Create Case</p>
                <p className="text-[11px] text-gray-400">Submit new input</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-gray-400 group-hover:text-[#9a55ff] group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            onClick={() => navigate('/workflow')}
            className="flex items-center justify-between p-4 rounded-xl bg-purple-50/30 border border-gray-100 hover:border-indigo-200 hover:bg-purple-50/70 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
                <GitBranch size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">AI Workflow</p>
                <p className="text-[11px] text-gray-400">Run agent pipeline</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            onClick={() => navigate('/reports')}
            className="flex items-center justify-between p-4 rounded-xl bg-purple-50/30 border border-gray-100 hover:border-emerald-200 hover:bg-purple-50/70 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-100 text-teal-600">
                <FileText size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Reports Library</p>
                <p className="text-[11px] text-gray-400">Search & export</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-gray-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            onClick={() => navigate('/analytics')}
            className="flex items-center justify-between p-4 rounded-xl bg-purple-50/30 border border-gray-100 hover:border-purple-200 hover:bg-purple-50/70 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600">
                <BarChart3 size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Analytics</p>
                <p className="text-[11px] text-gray-400">System insights</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-gray-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      </div>

      {/* Recent Investigations List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Recent Investigations</h2>
            <p className="text-xs text-gray-400">Active AI-assisted decision workspace cases</p>
          </div>
          <button
            onClick={() => fetchCases()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9a55ff] hover:text-[#8843ed] transition-colors cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-gray-150 shadow-sm"
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
          <div className="rounded-2xl bg-white border border-gray-150 p-12 text-center shadow-sm">
            <Briefcase size={40} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-base font-bold text-gray-800 mb-1">No active investigations</h3>
            <p className="text-xs text-gray-400 mb-6 font-normal">Create your first case to initiate multi-agent AI analysis</p>
            <button
              onClick={() => navigate('/create-case')}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#da8cff] to-[#9a55ff] text-white font-semibold text-xs shadow-md shadow-purple-500/20 hover:from-[#c87be5] hover:to-[#8843ed] transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>Create Case</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}





