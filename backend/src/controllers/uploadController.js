import { uploadService } from '../services/uploadService.js';
import { asyncHandler } from '../utils/helpers.js';

export const uploadController = {
  uploadFiles: asyncHandler(async (req, res) => {
    const { caseId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const saved = await uploadService.saveMultipleFiles(caseId, req.files);
    res.status(201).json({ files: saved });
  }),

  getFilesByCase: asyncHandler(async (req, res) => {
    const files = await uploadService.getFilesByCase(req.params.caseId);
    res.json({ files });
  }),
};
