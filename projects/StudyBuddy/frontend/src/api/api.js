import axios from 'axios';

const API_URL = 'http://localhost:2345';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const register = (user) =>
  api.post('/auth/register', user);

export const getTutors = () => api.get('/tutors');

export const createSession = (session) => api.post('/sessions', session);
export const getSessions = () => api.get('/sessions');
export const updateSessionStatus = (id, status) => api.patch(`/sessions/${id}/status`, { status });
export const getPendingCount = () => api.get('/sessions/pending/count');


export const getSchools = () => api.get('/schools');

export const getSubjects = () => api.get('/subjects');

export const getPendingTutors = () => api.get('/admin/pending-tutors');
export const approveTutor = (id) => api.post(`/admin/approve/${id}`);
export const declineTutor = (id) => api.post(`/admin/decline/${id}`);

export default api;
