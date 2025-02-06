import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Add request interceptor for auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
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

const api = {
  // Auth endpoints
  signup: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Signup failed');
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  // Quiz endpoints
  generateQuiz: async (videoUrl, preferences) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/quiz/generate`, {
        videoUrl,
        ...preferences
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to generate quiz');
    }
  },

  submitQuiz: async (quizData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/quiz/submit`, quizData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to submit quiz');
    }
  },

  // History endpoints
  getQuizHistory: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/quiz/history`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch quiz history');
    }
  },

  // Statistics endpoints
  getStatistics: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/quiz/statistics`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch statistics');
    }
  },

  // Leaderboard endpoints
  getLeaderboard: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/quiz/leaderboard`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch leaderboard');
    }
  },
};

export default api; 