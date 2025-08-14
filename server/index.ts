// server/index.ts
// Entry point for the Express server

import dotenv from 'dotenv';
dotenv.config();

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

app.get('/api/test-mongo', async (req, res) => {
  const { MongoClient } = require('mongodb');
  
  const client = new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  });

  try {
    console.log('Attempting to connect to MongoDB...');
    await client.connect();
    console.log('Connected successfully to MongoDB');
    
    const db = client.db();
    const result = await db.admin().ping();
    
    res.json({ 
      success: true, 
      message: 'MongoDB connection successful',
      ping: result 
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('MongoDB connection failed:', errMsg);
    res.status(500).json({ 
      success: false, 
      error: errMsg
    });
  } finally {
    await client.close();
  }
});

app.use('/api/quizzes', quizzesRouter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quizdb', {
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
