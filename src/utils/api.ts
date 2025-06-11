import axios from 'axios';
import { Project, GlobalExperience, ContactForm, AdminStats, ApiResponse } from '../types';

// Simple API configuration
const api = axios.create({
  baseURL: '',  // Uses Vite proxy
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors by redirecting to login
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// =============================================================================
// PUBLIC API ENDPOINTS
// =============================================================================

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

// =============================================================================
// ADMIN API ENDPOINTS
// =============================================================================

export const adminApi = {
  // Authentication
  login: (password: string): Promise<{ success: boolean; message: string; token: string }> =>
    api.post('/admin/login', { password }).then(res => res.data),
  
  logout: (): Promise<{ success: boolean; message: string }> =>
    api.post('/admin/logout').then(res => res.data),
  
  checkAuth: (): Promise<{ authenticated: boolean; admin: { username: string } }> =>
    api.get('/admin/status').then(res => res.data),
  
  // Projects management
  getProjects: (): Promise<{ projects: Project[] }> =>
    api.get('/api/admin/projects').then(res => res.data),
  
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; project: Project }> =>
    api.post('/api/admin/projects', project).then(res => res.data),
  
  updateProject: (id: string, project: Partial<Project>): Promise<{ success: boolean; project: Project }> =>
    api.put(`/api/admin/projects/${id}`, project).then(res => res.data),
  
  deleteProject: (id: string): Promise<{ success: boolean }> =>
    api.delete(`/api/admin/projects/${id}`).then(res => res.data),
  
  getStats: (): Promise<{ stats: AdminStats }> =>
    api.get('/api/admin/stats').then(res => res.data),
  
  reorderProjects: (projectIds: string[]): Promise<{ success: boolean }> =>
    api.post('/api/admin/reorder', { projectIds }).then(res => res.data),
};

export { api };
export default api;