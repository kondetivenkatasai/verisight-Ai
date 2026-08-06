import { caseModel } from '../models/caseModel.js';
import { createAppError } from '../utils/helpers.js';

export const caseService = {
  async getAllCases(userId, params = {}) {
    return await caseModel.findAll(userId, params);
  },

  async getCaseById(id, userId) {
    const caseData = await caseModel.findById(id);
    if (!caseData) {
      throw createAppError('Case not found', 404);
    }
    if (caseData.user_id !== userId) {
      throw createAppError('Not authorized', 403);
    }
    return caseData;
  },

  async createCase(userId, data) {
    return await caseModel.create({
      ...data,
      user_id: userId,
      status: 'open',
    });
  },

  async updateCase(id, userId, updates) {
    await this.getCaseById(id, userId); // Verify ownership
    return await caseModel.update(id, updates);
  },

  async deleteCase(id, userId) {
    await this.getCaseById(id, userId); // Verify ownership
    return await caseModel.delete(id);
  },
};
