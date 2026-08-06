import { Router } from 'express';
import { workflowController } from '../controllers/workflowController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/run/:caseId', workflowController.runPipeline);
router.get('/status/:caseId', workflowController.getStatus);

export default router;
