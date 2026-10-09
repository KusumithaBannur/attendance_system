import axios from 'axios';

// Set REACT_APP_API_URL when deploying, e.g. https://your-backend.onrender.com/api
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
  id: number;
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
  studentId: number;
  status: 'Present' | 'Absent';
}

export interface AttendanceData {
  attendanceData: AttendanceRecord[];
  date?: string;
}

export interface SavedAttendance {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  status: 'Present' | 'Absent';
  date: string;
}

export interface Student {
  id: number;
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

  getStudentReport: async (studentId: number, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/attendance/report/${studentId}?${params.toString()}`);
    return response.data;
  },

  getAttendanceByDate: async (date: string) => {
    const response = await api.get('/attendance/by-date', { params: { date } });
    return response.data;
  },
};

export default api;