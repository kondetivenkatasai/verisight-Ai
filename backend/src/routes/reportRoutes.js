import { Router } from 'express';
import { reportController } from '../controllers/reportController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', reportController.getAll);
router.get('/:id', reportController.getById);
router.get('/case/:caseId', reportController.getByCase);

export default router;
