import { caseService } from '../services/caseService.js';
import { uploadService } from '../services/uploadService.js';
import { asyncHandler } from '../utils/helpers.js';

export const caseController = {
  getAll: asyncHandler(async (req, res) => {
    const cases = await caseService.getAllCases(req.user.id, req.query);
    res.json({ cases });
  }),

  getById: asyncHandler(async (req, res) => {
    const caseData = await caseService.getCaseById(req.params.id, req.user.id);
    res.json({ case: caseData });
  }),

  create: asyncHandler(async (req, res) => {
    const { title, description, priority } = req.body;
    const newCase = await caseService.createCase(req.user.id, { title, description, priority });

    // If files were uploaded, save records
    if (req.files && req.files.length > 0) {
      await uploadService.saveMultipleFiles(newCase.id, req.files);
    }

    res.status(201).json({ case: newCase });
  }),

  update: asyncHandler(async (req, res) => {
    const updated = await caseService.updateCase(req.params.id, req.user.id, req.body);
    res.json({ case: updated });
  }),

  delete: asyncHandler(async (req, res) => {
    await caseService.deleteCase(req.params.id, req.user.id);
    res.json({ message: 'Case deleted successfully' });
  }),
};
