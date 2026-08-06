import api from './api';

export const reportService = {
  getAll: (params) => api.get('/reports', { params }),
  getById: (id) => api.get(`/reports/${id}`),
  getByCase: (caseId) => api.get(`/reports/case/${caseId}`),
};
