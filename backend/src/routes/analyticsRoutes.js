import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/cases-over-time', analyticsController.getCasesOverTime);
router.get('/risk-distribution', analyticsController.getRiskDistribution);
router.get('/agent-performance', analyticsController.getAgentPerformance);
router.get('/heatmap', analyticsController.getHeatmapData);
router.get('/trends', analyticsController.getTrendForecast);

export default router;
