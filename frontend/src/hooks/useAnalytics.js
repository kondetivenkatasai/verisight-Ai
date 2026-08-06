import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '@/services/analyticsService';

export function useAnalytics() {
  const [stats, setStats] = useState(null);
  const [casesOverTime, setCasesOverTime] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState([]);
  const [agentPerformance, setAgentPerformance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await analyticsService.getDashboardStats();
      setStats(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCasesOverTime = useCallback(async (params = {}) => {
    try {
      const res = await analyticsService.getCasesOverTime(params);
      setCasesOverTime(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch chart data');
    }
  }, []);

  const fetchRiskDistribution = useCallback(async () => {
    try {
      const res = await analyticsService.getRiskDistribution();
      setRiskDistribution(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch risk data');
    }
  }, []);

  const fetchAgentPerformance = useCallback(async () => {
    try {
      const res = await analyticsService.getAgentPerformance();
      setAgentPerformance(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch agent data');
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  return {
    stats,
    casesOverTime,
    riskDistribution,
    agentPerformance,
    loading,
    error,
    fetchDashboardStats,
    fetchCasesOverTime,
    fetchRiskDistribution,
    fetchAgentPerformance,
  };
}
