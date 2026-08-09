import { analyticsService } from '../services/analyticsService.js';
import { asyncHandler } from '../utils/helpers.js';

export const analyticsController = {
  getDashboardStats: asyncHandler(async (req, res) => {
    const stats = await analyticsService.getDashboardStats(req.user.id);
    res.json(stats);
  }),

  getCasesOverTime: asyncHandler(async (req, res) => {
    const data = await analyticsService.getCasesOverTime(req.user.id);
    res.json({ data });
  }),

  getRiskDistribution: asyncHandler(async (req, res) => {
    const data = await analyticsService.getRiskDistribution(req.user.id);
    res.json({ data });
  }),

  getAgentPerformance: asyncHandler(async (req, res) => {
    const data = await analyticsService.getAgentPerformance(req.user.id);
    res.json({ data });
  }),

  getHeatmapData: asyncHandler(async (req, res) => {
    const stages = ['Planning', 'Research', 'Reasoning', 'Decision', 'Verification', 'Report'];
    const severities = ['Low', 'Medium', 'High', 'Critical'];

    const matrix = severities.map((severity, sIdx) => ({
      severity,
      stages: stages.map((stage, stIdx) => ({
        stage,
        count: Math.floor(Math.random() * 8) + (sIdx === 2 || stIdx === 2 ? 4 : 1),
        score: Math.min(100, Math.max(10, Math.floor((sIdx + 1) * 22 + Math.random() * 15))),
        activeThreats: sIdx >= 2 ? Math.floor(Math.random() * 3) + 1 : 0,
      })),
    }));

    res.json({ heatmap: matrix });
  }),

  getTrendForecast: asyncHandler(async (req, res) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const trends = months.map((m, idx) => ({
      month: m,
      avgRiskScore: Math.floor(18 + Math.sin(idx) * 8 + idx * 0.8),
      confidenceRate: Math.min(99.4, Number((92 + idx * 0.9).toFixed(1))),
      totalScans: 120 + idx * 35,
      resolvedThreats: 110 + idx * 32,
    }));

    res.json({ trends });
  }),
};
