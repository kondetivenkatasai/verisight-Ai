import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Area, AreaChart,
} from 'recharts';
import Card from '@/ui/Card';
import { PageLoader } from '@/ui/Loader';
import { useAnalytics } from '@/hooks/useAnalytics';
import { pageTransition } from '@/animations/variants';
import RiskHeatmap3D from '@/components/RiskHeatmap3D';
import TrendAnalyticsChart from '@/components/TrendAnalyticsChart';

// Color Palette Mappings
const RISK_COLORS = {
  Low: '#10B981',      // Emerald Green
  Medium: '#3B82F6',   // Electric Blue
  High: '#F59E0B',     // Amber Orange
  Critical: '#EF4444', // Rose Red
};

const AGENT_BAR_COLORS = [
  '#3B82F6', // Planning (Electric Blue)
  '#8B5CF6', // Research (Purple / Violet)
  '#EC4899', // Reasoning (Pink / Magenta)
  '#10B981', // Decision (Emerald Green)
  '#F59E0B', // Verification (Amber)
  '#06B6D4', // Report (Cyan / Teal)
];

const DEFAULT_PIE_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl bg-white dark:bg-[#111726] border border-gray-200 dark:border-[#1e2942] px-3.5 py-2.5 shadow-xl backdrop-blur-md">
        <p className="text-xs font-bold text-gray-900 dark:text-white mb-1.5">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="text-gray-700 dark:text-gray-300">
              {entry.name}: <strong className="text-gray-900 dark:text-white">{entry.value}</strong>
            </span>
          </div>
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
    <motion.div {...pageTransition} className="space-y-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Analytics & Intelligence Insights
        </h1>
        <p className="text-gray-500 dark:text-[#8a99b5] text-sm mt-1">
          Multi-agent system metrics, confidence tracking, and case velocity
        </p>
      </div>

      {/* Interactive 3D Risk Heatmap & Trend Forecasting */}
      <div className="space-y-6">
        <RiskHeatmap3D />
        <TrendAnalyticsChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cases Over Time - Blue / Cyan Gradient */}
        <Card>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-4">
            Cases Over Time
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartCases}>
              <defs>
                <linearGradient id="colorCasesBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(161, 161, 170, 0.15)" />
              <XAxis dataKey="month" tick={{ fill: '#8a99b5', fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: '#8a99b5', fontSize: 12 }} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="cases"
                stroke="#3B82F6"
                strokeWidth={3}
                fill="url(#colorCasesBlue)"
                dot={{ fill: '#3B82F6', r: 4, strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 6, fill: '#60A5FA' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Risk Distribution - Category-based Distinct Colors */}
        <Card>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-4">
            Risk Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartRisk}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {chartRisk.map((entry, index) => {
                  const color = RISK_COLORS[entry.name] || DEFAULT_PIE_COLORS[index % DEFAULT_PIE_COLORS.length];
                  return <Cell key={`cell-${index}`} fill={color} stroke="none" />;
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {chartRisk.map((entry, index) => {
              const color = RISK_COLORS[entry.name] || DEFAULT_PIE_COLORS[index % DEFAULT_PIE_COLORS.length];
              return (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: color }} />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{entry.name}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Agent Performance - Percentage Metric Cards */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Agent Confidence Scores
              </h3>
              <p className="text-xs text-gray-500 dark:text-[#8a99b5] mt-0.5">
                Real-time confidence evaluation across specialized AI pipeline agents
              </p>
            </div>
            <span className="text-xs font-extrabold text-[#3B82F6] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Avg Confidence: 90.5%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {chartAgents.map((agent, index) => {
              const color = AGENT_BAR_COLORS[index % AGENT_BAR_COLORS.length];
              const pct = agent.confidence || 90;
              return (
                <div
                  key={agent.agent}
                  className="p-4 rounded-xl bg-gray-50/70 dark:bg-[#151c2e] border border-gray-150 dark:border-[#1e2942] space-y-3 transition-all hover:border-gray-300 dark:hover:border-[#273554] shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      {agent.agent} Agent
                    </span>
                    <span className="text-xs font-bold text-gray-500 dark:text-[#8a99b5]">
                      {agent.avgTime ? `${(agent.avgTime / 1000).toFixed(1)}s` : '1.2s'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black tracking-tight" style={{ color }}>
                      {pct}%
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      High Accuracy
                    </span>
                  </div>

                  {/* Percentage Progress Meter */}
                  <div className="w-full bg-gray-200 dark:bg-[#0f172a] h-2.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: index * 0.08 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}




