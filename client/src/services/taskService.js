import api from './api';

export const taskService = {
  getTasks: async (params) => (await api.get('/tasks', { params })).data,
  getTask: async (id) => (await api.get(`/tasks/${id}`)).data,
  getStats: async () => (await api.get('/tasks/stats')).data,
  createTask: async (formData) => (await api.post('/tasks', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
  updateTask: async (id, formData) => (await api.put(`/tasks/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
  deleteTask: async (id) => (await api.delete(`/tasks/${id}`)).data,
  completeTask: async (id) => (await api.patch(`/tasks/${id}/complete`)).data,
};
