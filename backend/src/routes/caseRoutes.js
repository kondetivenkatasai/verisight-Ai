import { Router } from 'express';
import { caseController } from '../controllers/caseController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createCaseSchema, updateCaseSchema } from '../validators/caseValidator.js';
import upload from '../middleware/upload.js';

const router = Router();

// Require JWT authentication for all Case operations
router.use(authenticate);

// CRUD Routes for Cases
router.get('/', caseController.getAll);
router.get('/:id', caseController.getById);
router.post('/', upload.array('files', 5), validate(createCaseSchema), caseController.create);
router.put('/:id', validate(updateCaseSchema), caseController.update);
router.delete('/:id', caseController.delete);

export default router;
