import api from './api';

export const authService = {
  register: async (data) => (await api.post('/auth/register', data)).data,
  login: async (data) => (await api.post('/auth/login', data)).data,
  firebaseLogin: async (idToken) => (await api.post('/auth/firebase', { idToken })).data,
  getMe: async () => (await api.get('/auth/me')).data,
};
