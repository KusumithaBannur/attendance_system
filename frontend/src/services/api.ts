import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-render-app.onrender.com/api' // Will update this after deployment
  : 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'teacher' | 'student';
}

export interface AttendanceRecord {
  studentId: string;
  status: 'Present' | 'Absent';
}

export interface AttendanceData {
  attendanceData: AttendanceRecord[];
  date?: string;
}

export interface Student {
  _id: string;
  name: string;
  email: string;
  role: string;
}

// Auth API
export const authAPI = {
  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Attendance API
export const attendanceAPI = {
  getStudents: async () => {
    const response = await api.get('/attendance/students');
    return response.data;
  },

  markAttendance: async (data: AttendanceData) => {
    const response = await api.post('/attendance/mark', data);
    return response.data;
  },

  getStudentReport: async (studentId: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/attendance/report/${studentId}?${params.toString()}`);
    return response.data;
  },

  getAttendanceByDate: async (date: string) => {
    const response = await api.get(`/attendance/date/${date}`);
    return response.data;
  },
};

export default api;