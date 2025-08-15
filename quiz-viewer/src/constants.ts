const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'https://toursona-server.vercel.app';
const SERVER_PORT = import.meta.env.VITE_SERVER_PORT || '';

export const API_BASE_URL = `${SERVER_URL}${SERVER_PORT ? `:${SERVER_PORT}` : ''}/api/quizzes/`;
