const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost';
const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || '4000';

export const API_BASE_URL = `${SERVER_URL}:${SERVER_PORT}/api/quizzes/`;
