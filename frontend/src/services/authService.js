import api from './api';

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  googleLogin: (payload) => api.post('/auth/google', payload),
  getMe: () => api.get('/auth/me'),
};
