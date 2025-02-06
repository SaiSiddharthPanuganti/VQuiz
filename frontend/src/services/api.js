import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Export API functions directly
export const generateQuiz = async (formData) => {
  try {
    const response = await api.post('/quiz/generate', formData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to generate quiz');
  }
};

export const submitQuiz = async (quizId, answers) => {
  try {
    const response = await api.post('/quiz/submit', { quizId, answers });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to submit quiz');
  }
};

export const getHistory = async () => {
  try {
    const response = await api.get('/quiz/history');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch quiz history');
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

export const signup = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Signup failed');
  }
};

export default {
  generateQuiz,
  submitQuiz,
  getHistory,
  login,
  signup
}; 