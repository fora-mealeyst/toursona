// server/index.ts
// Entry point for the Express server

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import quizzesRouter from './routes/quizzes.js';
import { HealthResponse } from './types/index.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  const health: HealthResponse = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  
  const statusCode = health.database === 'connected' ? 200 : 503;
  res.status(statusCode).json(health);
});

app.get('/api/ip', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || 
             req.socket?.remoteAddress || null;

  res.json({
    ip: ip,
    headers: req.headers,
    // Vercel-specific headers
    vercelRegion: req.headers['x-vercel-deployment-url'],
    forwardedFor: req.headers['x-forwarded-for'],
    realIp: req.headers['x-real-ip']
  });
});

app.use('/api/quizzes', quizzesRouter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://shawn:bNQhJ1wuUc5ldZ89@toursona.nacuyqw.mongodb.net/?retryWrites=true&w=majority&appName=toursona', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions);

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
