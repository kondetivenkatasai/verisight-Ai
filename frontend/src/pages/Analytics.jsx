import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart,
} from 'recharts';
import Card from '@/ui/Card';
import { PageLoader } from '@/ui/Loader';
import { useAnalytics } from '@/hooks/useAnalytics';
import { pageTransition } from '@/animations/variants';

const COLORS = ['#6366f1', '#a78bfa', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-surface-900 border border-surface-700/50 px-3 py-2 shadow-xl">
        <p className="text-xs text-surface-400 mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const {
    casesOverTime,
    riskDistribution,
    agentPerformance,
    loading,
    fetchCasesOverTime,
    fetchRiskDistribution,
    fetchAgentPerformance,
  } = useAnalytics();

  useEffect(() => {
    fetchCasesOverTime();
    fetchRiskDistribution();
    fetchAgentPerformance();
  }, [fetchCasesOverTime, fetchRiskDistribution, fetchAgentPerformance]);

  if (loading) return <PageLoader />;

  // Fallback demo data
  const chartCases = casesOverTime.length > 0 ? casesOverTime : [
    { month: 'Jan', cases: 12 }, { month: 'Feb', cases: 19 },
    { month: 'Mar', cases: 28 }, { month: 'Apr', cases: 24 },
    { month: 'May', cases: 35 }, { month: 'Jun', cases: 42 },
  ];

  const chartRisk = riskDistribution.length > 0 ? riskDistribution : [
    { name: 'Low', value: 35 }, { name: 'Medium', value: 30 },
    { name: 'High', value: 25 }, { name: 'Critical', value: 10 },
  ];

  const chartAgents = agentPerformance.length > 0 ? agentPerformance : [
    { agent: 'Planning', avgTime: 1200, confidence: 92 },
    { agent: 'Research', avgTime: 3500, confidence: 88 },
    { agent: 'Reasoning', avgTime: 2800, confidence: 85 },
    { agent: 'Decision', avgTime: 1800, confidence: 90 },
    { agent: 'Verification', avgTime: 1500, confidence: 95 },
    { agent: 'Report', avgTime: 2000, confidence: 93 },
  ];

  return (
    <motion.div {...pageTransition}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-surface-400 text-sm mt-1">Performance metrics and insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cases Over Time */}
        <Card>
          <h3 className="text-sm font-semibold text-surface-200 mb-4">Cases Over Time</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartCases}>
              <defs>
                <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cases" stroke="#6366f1" strokeWidth={2} fill="url(#colorCases)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <h3 className="text-sm font-semibold text-surface-200 mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartRisk}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {chartRisk.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {chartRisk.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-xs text-surface-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Agent Performance */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-surface-200 mb-4">Agent Confidence Scores</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartAgents}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="agent" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="confidence" fill="#6366f1" radius={[6, 6, 0, 0]} name="Confidence %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </motion.div>
  );
}
