import { Router } from 'express';
import { uploadController } from '../controllers/uploadController.js';
import { authenticate } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

router.use(authenticate);

router.post('/:caseId', upload.array('files', 5), uploadController.uploadFiles);
router.get('/:caseId', uploadController.getFilesByCase);

export default router;
