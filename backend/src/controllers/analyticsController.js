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
};
