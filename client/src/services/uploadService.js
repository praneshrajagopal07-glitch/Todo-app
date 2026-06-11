import api from './api';

export const uploadService = {
  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return (await api.post('/upload/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
  },
  uploadTaskImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return (await api.post('/upload/task', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
  },
};
