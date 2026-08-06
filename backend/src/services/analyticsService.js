import { caseModel } from '../models/caseModel.js';
import supabase from '../config/supabase.js';

export const analyticsService = {
  async getDashboardStats(userId) {
    const [totalCases, completedCases, inProgressCases, highPriorityCases] = await Promise.all([
      caseModel.countByUser(userId),
      caseModel.countByStatus(userId, 'completed'),
      caseModel.countByStatus(userId, 'in_progress'),
      (async () => {
        const { count } = await supabase
          .from('cases')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .in('priority', ['high', 'critical']);
        return count;
      })(),
    ]);

    return { totalCases, completedCases, inProgressCases, highPriorityCases };
  },

  async getCasesOverTime(userId) {
    const { data, error } = await supabase
      .from('cases')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error) throw error;

    // Group by month
    const monthly = {};
    for (const row of data || []) {
      const date = new Date(row.created_at);
      const key = date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
      monthly[key] = (monthly[key] || 0) + 1;
    }

    return Object.entries(monthly).map(([month, cases]) => ({ month, cases }));
  },

  async getRiskDistribution(userId) {
    const { data, error } = await supabase
      .from('reports')
      .select('risk_score, cases!inner(user_id)')
      .eq('cases.user_id', userId);
    if (error) throw error;

    const buckets = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    for (const row of data || []) {
      const score = row.risk_score || 0;
      if (score < 25) buckets.Low++;
      else if (score < 50) buckets.Medium++;
      else if (score < 75) buckets.High++;
      else buckets.Critical++;
    }

    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  },

  async getAgentPerformance(userId) {
    const { data, error } = await supabase
      .from('workflow_history')
      .select('agent_name, confidence, execution_time, cases!inner(user_id)')
      .eq('cases.user_id', userId)
      .eq('status', 'completed');
    if (error) throw error;

    const agentMap = {};
    for (const row of data || []) {
      if (!agentMap[row.agent_name]) {
        agentMap[row.agent_name] = { total: 0, confSum: 0, timeSum: 0 };
      }
      agentMap[row.agent_name].total++;
      agentMap[row.agent_name].confSum += row.confidence || 0;
      agentMap[row.agent_name].timeSum += row.execution_time || 0;
    }

    return Object.entries(agentMap).map(([agent, stats]) => ({
      agent: agent.replace('Agent', ''),
      confidence: Math.round(stats.confSum / stats.total),
      avgTime: Math.round(stats.timeSum / stats.total),
    }));
  },
};
