import { reportService } from '../services/reportService.js';
import { asyncHandler } from '../utils/helpers.js';

export const reportController = {
  getAll: asyncHandler(async (req, res) => {
    const reports = await reportService.getAllReports(req.user.id, req.query);
    res.json({ reports });
  }),

  getById: asyncHandler(async (req, res) => {
    const report = await reportService.getReportById(req.params.id);
    res.json({ report });
  }),

  getByCase: asyncHandler(async (req, res) => {
    const reports = await reportService.getReportsByCase(req.params.caseId);
    res.json({ reports });
  }),

  delete: asyncHandler(async (req, res) => {
    await reportService.deleteReport(req.params.id);
    res.json({ message: 'Report deleted successfully' });
  }),
};
