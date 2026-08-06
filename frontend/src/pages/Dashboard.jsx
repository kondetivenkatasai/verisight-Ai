import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  RefreshCw,
  MoreHorizontal,
  ChevronDown,
  Heart,
  Brain,
  Stethoscope
} from 'lucide-react';
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
    { title: 'Total Patients', value: stats?.totalCases ? Number(stats.totalCases).toLocaleString() : (cases.length ? cases.length.toLocaleString() : '3,256'), icon: Briefcase, color: 'aegis' },
    { title: 'Available Staff', value: stats?.completedCases ? Number(stats.completedCases).toLocaleString() : '394', icon: CheckCircle, color: 'emerald' },
    { title: 'Avg Treat. Costs', value: stats?.inProgressCases ? `$${Number(stats.inProgressCases * 1250).toLocaleString()}` : '$2,536', icon: Clock, color: 'amber' },
    { title: 'Available Cars', value: stats?.highPriorityCases ? Number(stats.highPriorityCases).toLocaleString() : '38', icon: AlertTriangle, color: 'red' },
  ];

  return (
    <motion.div {...pageTransition} className="space-y-6">
      {/* 4 Metrics Cards Header Row */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {statsCards.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </motion.div>

      {/* Middle Section: Outpatients vs Inpatients Trend + Patients by Gender */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Outpatients vs Inpatients Bar Chart Card */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-gray-800">Outpatients vs. Inpatients Trend</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium cursor-pointer">
              <span>Show by months</span>
              <ChevronDown size={14} />
            </div>
          </div>

          {/* Bar Chart Visualization & 28% Donut Mini Badge */}
          <div className="flex flex-col sm:flex-row items-center gap-6 my-2">
            {/* Bars */}
            <div className="flex-1 w-full flex items-end justify-between gap-3 h-44 pt-4 pb-2 border-b border-gray-100">
              {[
                { month: 'Oct 2019', green: 30, purple: 60 },
                { month: 'Nov 2019', green: 45, purple: 70 },
                { month: 'Dec 2019', green: 25, purple: 85 },
                { month: 'Jan 2020', green: 35, purple: 55 },
                { month: 'Feb 2020', green: 40, purple: 60 },
                { month: 'Mar 2020', green: 30, purple: 75 },
              ].map((bar, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                  <div className="flex items-end gap-1.5 h-36">
                    <div
                      className="w-2.5 bg-emerald-400 rounded-t-full transition-all duration-500 hover:opacity-80"
                      style={{ height: `${bar.green}%` }}
                    />
                    <div
                      className="w-2.5 bg-purple-600 rounded-t-full transition-all duration-500 hover:opacity-80"
                      style={{ height: `${bar.purple}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{bar.month}</span>
                </div>
              ))}
            </div>

            {/* Donut Mini Badge */}
            <div className="flex flex-col items-center justify-center p-3 shrink-0">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-emerald-400"
                    strokeDasharray="72, 100"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-purple-600"
                    strokeDasharray="28, 100"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute bg-gray-900 text-white text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
                  28%
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3 text-xs">
                <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                  <span className="w-2 h-2 rounded-full bg-purple-600" /> Inpatients
                </span>
                <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Outpatients
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Patients by Gender Ring Chart */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800">Patients by Gender</h2>
            <button className="text-gray-300 hover:text-gray-500">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center my-4">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" stroke="#f3f4f6" strokeWidth="3" fill="none" />
                <path
                  className="text-orange-400"
                  strokeDasharray="40, 100"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-purple-600"
                  strokeDasharray="55, 100"
                  strokeDashoffset="-42"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xs font-bold text-gray-400">Total</span>
                <p className="text-lg font-extrabold text-gray-900">100%</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs pt-2">
            <span className="flex items-center gap-1.5 text-gray-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-orange-400" /> Female
            </span>
            <span className="flex items-center gap-1.5 text-gray-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-purple-600" /> Male
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Time Admitted + Patients by Division + Solid Purple Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Time Admitted Line Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800">Time Admitted</h2>
            <div className="flex items-center gap-1 text-xs text-gray-400 font-medium cursor-pointer">
              <span>Today</span>
              <ChevronDown size={14} />
            </div>
          </div>

          <div className="relative h-36 w-full my-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
              <path
                d="M 0 70 Q 30 90 60 50 T 120 40 T 180 30 T 240 40 T 300 60"
                fill="none"
                stroke="#ff7a45"
                strokeWidth="2.5"
              />
              {/* Tooltip Point */}
              <circle cx="120" cy="40" r="4" fill="#ff7a45" stroke="#ffffff" strokeWidth="2" />
            </svg>
            <div className="absolute left-[38%] top-[10%] bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
              113
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-50">
            <span>07 am</span>
            <span className="text-orange-500 font-bold">08 am</span>
            <span>09 am</span>
            <span>10 am</span>
            <span>11 am</span>
            <span>12 pm</span>
          </div>
        </div>

        {/* Patients By Division */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-800">Patients By Division</h2>
            <button className="text-gray-300 hover:text-gray-500">
              <MoreHorizontal size={16} />
            </button>
          </div>

          <div className="space-y-4 my-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-gray-600 font-medium">
                <Heart size={15} className="text-purple-600" />
                <span>Cardiology</span>
              </div>
              <span className="text-xs font-bold text-gray-800">247</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-gray-600 font-medium">
                <Brain size={15} className="text-cyan-500" />
                <span>Neurology</span>
              </div>
              <span className="text-xs font-bold text-gray-800">164</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-gray-600 font-medium">
                <Stethoscope size={15} className="text-rose-500" />
                <span>Surgery</span>
              </div>
              <span className="text-xs font-bold text-gray-800">86</span>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-gray-400 font-semibold uppercase tracking-wider text-right">
            PT
          </div>
        </div>

        {/* Solid Purple Metric Card */}
        <div className="lg:col-span-4 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-2xl p-6 text-white shadow-xl shadow-purple-600/20 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">3,240</h3>
            <p className="text-xs text-purple-100/90 font-medium mt-1">Patients this month</p>
          </div>

          {/* Wave line SVG */}
          <div className="relative h-20 w-full my-2 z-10">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
              <path
                d="M 0 50 Q 50 80 100 60 T 200 40 T 260 30 T 300 60"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                opacity="0.8"
              />
              <circle cx="260" cy="30" r="4" fill="#ffffff" />
            </svg>
            <div className="absolute right-[10%] top-[-5%] bg-white text-purple-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm">
              232
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-purple-200/80 font-medium pt-1">
            <span>14</span>
            <span>15</span>
            <span>16</span>
            <span>17</span>
            <span className="text-white font-bold">18</span>
            <span>19</span>
          </div>
        </div>
      </div>

      {/* Recent Investigations List */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Recent Investigations</h2>
            <p className="text-xs text-gray-400">Active AI-assisted decision workspace cases</p>
          </div>
          <button
            onClick={() => fetchCases()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm"
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
          <div className="rounded-2xl bg-white border border-gray-100 p-12 text-center shadow-sm">
            <Briefcase size={40} className="mx-auto mb-3 text-gray-300" />
            <h3 className="text-base font-bold text-gray-800 mb-1">No active investigations</h3>
            <p className="text-xs text-gray-400 mb-5">Create your first case to initiate AI-powered analysis</p>
            <button
              onClick={() => navigate('/create-case')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 text-white font-semibold text-xs shadow-md shadow-purple-600/20 hover:bg-purple-700 transition-all"
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


