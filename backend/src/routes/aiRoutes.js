import { Router } from 'express';
import { aiController } from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Copilot Chat Route
router.post('/copilot', authenticate, aiController.copilotChat);

// Custom Agents Routes
router.get('/custom-agents', authenticate, aiController.getCustomAgents);
router.post('/custom-agents', authenticate, aiController.createCustomAgent);
router.patch('/custom-agents/:id/toggle', authenticate, aiController.toggleCustomAgent);
router.delete('/custom-agents/:id', authenticate, aiController.deleteCustomAgent);

export default router;
