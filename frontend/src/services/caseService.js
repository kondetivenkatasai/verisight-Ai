import api from './api';

export const caseService = {
  getAll: (params) => api.get('/cases', { params }),
  getById: (id) => api.get(`/cases/${id}`),
  create: (data) => {
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      return api.post('/cases', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.post('/cases', data);
  },
  update: (id, data) => api.put(`/cases/${id}`, data),
  delete: (id) => api.delete(`/cases/${id}`),
  runWorkflow: (id) => api.post(`/workflow/run/${id}`),
  getWorkflowStatus: (id) => api.get(`/workflow/status/${id}`),
};
