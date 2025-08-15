// server/index.ts
// Entry point for the Express server with robust connection management

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import quizzesRouter from './routes/quizzes.js';
import connectToDatabase from './database/connection.js';
import { HealthResponse } from './types/index.js';

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration
const corsOptions = {
  origin: [
    'https://toursona-quiz-viewer.vercel.app',
    'https://toursona-quiz-admin.vercel.app',
    'http://localhost:5173', // For local development
    'http://localhost:3000', // For local development
    'http://localhost:4000'  // For local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await connectToDatabase();
    
    const health: HealthResponse = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    };
    
    const statusCode = health.database === 'connected' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    console.error('Health check failed:', error);
    
    const health: HealthResponse = {
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: 'error'
    };
    
    res.status(503).json(health);
  }
});

app.get('/api/ip', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || 
             req.socket?.remoteAddress || null;

  res.json({
    ip: ip,
    headers: req.headers,
    vercelRegion: req.headers['x-vercel-deployment-url'],
    forwardedFor: req.headers['x-forwarded-for'],
    realIp: req.headers['x-real-ip']
  });
});

app.get('/api/test-mongo', async (req, res) => {
  try {
    console.log('Testing MongoDB connection...');
    await connectToDatabase();
    
    // Test with a simple ping
    const admin = mongoose.connection.db?.admin();
    const result = await admin?.ping();
    
    res.json({ 
      success: true, 
      message: 'MongoDB connection successful',
      ping: result,
      readyState: mongoose.connection.readyState
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('MongoDB test failed:', errMsg);
    res.status(500).json({ 
      success: false, 
      error: errMsg
    });
  }
});

// Debug endpoint
app.get('/api/debug', async (req, res) => {
  let connectionStatus = 'not attempted';
  
  try {
    await connectToDatabase();
    connectionStatus = 'success';
  } catch (error) {
    connectionStatus = `failed: ${error instanceof Error ? error.message : String(error)}`;
  }

  res.json({
    environment: process.env.NODE_ENV || 'development',
    hasMongoUri: !!process.env.MONGODB_URI,
    mongoUriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
    mongoUriPreview: process.env.MONGODB_URI ? 
      process.env.MONGODB_URI.substring(0, 30) + '...' : 'not set',
    mongooseReadyState: mongoose.connection.readyState,
    mongooseReadyStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
    connectionAttempt: connectionStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Middleware for quiz routes to ensure database connection
app.use('/api/quizzes', async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection failed for quiz route:', error);
    res.status(503).json({ 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}, quizzesRouter);

// For Vercel export
export default app;

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}