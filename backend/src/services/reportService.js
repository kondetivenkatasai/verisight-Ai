import { reportModel } from '../models/reportModel.js';

export const reportService = {
  async getAllReports(userId, params = {}) {
    return await reportModel.findAll(userId, params);
  },

  async getReportById(id) {
    return await reportModel.findById(id);
  },

  async getReportsByCase(caseId) {
    return await reportModel.findByCase(caseId);
  },

  async createReport(reportData) {
    return await reportModel.create(reportData);
  },

  async deleteReport(id) {
    return await reportModel.delete(id);
  },
};
