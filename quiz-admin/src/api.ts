import axios from 'axios';
import { IQuiz, IQuizAnswer } from './types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const quizApi = {
  // Get all quizzes
  getQuizzes: async (): Promise<IQuiz[]> => {
    const response = await api.get('/quizzes');
    return response.data;
  },

  // Get a specific quiz by ID
  getQuiz: async (id: string): Promise<IQuiz> => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  // Get answers for a specific quiz
  getQuizAnswers: async (quizId: string): Promise<IQuizAnswer[]> => {
    const response = await api.get(`/quizzes/${quizId}/answers`);
    return response.data;
  },

  // Create a new quiz
  createQuiz: async (quizData: CreateQuizRequest): Promise<IQuiz> => {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  },

  // Update a quiz
  updateQuiz: async (id: string, quizData: CreateQuizRequest): Promise<IQuiz> => {
    const response = await api.put(`/quizzes/${id}`, quizData);
    return response.data;
  },

  // Delete a quiz
  deleteQuiz: async (id: string): Promise<void> => {
    await api.delete(`/quizzes/${id}`);
  },
};

export default api;
