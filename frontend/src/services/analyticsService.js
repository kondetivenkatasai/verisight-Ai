import api from './api';

export const analyticsService = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getCasesOverTime: (params) => api.get('/analytics/cases-over-time', { params }),
  getRiskDistribution: () => api.get('/analytics/risk-distribution'),
  getAgentPerformance: () => api.get('/analytics/agent-performance'),
};
