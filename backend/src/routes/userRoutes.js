import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.put('/profile', userController.updateProfile);
router.put('/password', userController.changePassword);

export default router;
