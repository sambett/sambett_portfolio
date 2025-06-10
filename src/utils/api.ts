import axios from 'axios';
import { Project, GlobalExperience, ContactForm, AdminStats, ApiResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use((config) => {
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Public API endpoints
export const projectsApi = {
  getAll: (): Promise<{ projects: Project[] }> =>
    api.get('/api/projects').then(res => res.data),
  
  getById: (id: string): Promise<{ project: Project }> =>
    api.get(`/api/projects/${id}`).then(res => res.data),
};

export const experiencesApi = {
  getAll: (): Promise<{ experiences: GlobalExperience[] }> =>
    api.get('/api/experiences').then(res => res.data),
};

export const contactApi = {
  submit: (data: ContactForm): Promise<ApiResponse<any>> =>
    api.post('/api/contact', data).then(res => res.data),
};

// Admin API endpoints
export const adminApi = {
  login: (password: string): Promise<ApiResponse<any>> =>
    api.post('/admin/login', { password }).then(res => res.data),
  
  logout: (): Promise<ApiResponse<any>> =>
    api.post('/admin/logout').then(res => res.data),
  
  checkAuth: (): Promise<{ authenticated: boolean; admin: any }> =>
    api.get('/admin/status').then(res => res.data),
  
  getProjects: (): Promise<{ projects: Project[] }> =>
    api.get('/api/admin/projects').then(res => res.data),
  
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ project: Project }> =>
    api.post('/api/admin/projects', project).then(res => res.data),
  
  updateProject: (id: string, project: Partial<Project>): Promise<{ project: Project }> =>
    api.put(`/api/admin/projects/${id}`, project).then(res => res.data),
  
  deleteProject: (id: string): Promise<{ success: boolean }> =>
    api.delete(`/api/admin/projects/${id}`).then(res => res.data),
  
  uploadFile: (file: File): Promise<{ filename: string; url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },
  
  getStats: (): Promise<{ stats: AdminStats }> =>
    api.get('/api/admin/stats').then(res => res.data),
  
  reorderProjects: (projectIds: string[]): Promise<{ success: boolean }> =>
    api.post('/api/admin/reorder', { projectIds }).then(res => res.data),
};

export { api };
export default api;