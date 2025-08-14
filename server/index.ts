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

// Debug endpoint to check environment variables and connection status
app.get('/api/debug', (req, res) => {
  res.json({
    environment: process.env.NODE_ENV || 'development',
    hasMongoUri: !!process.env.MONGODB_URI,
    mongoUriLength: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
    mongoUriPreview: process.env.MONGODB_URI ? 
      process.env.MONGODB_URI.substring(0, 20) + '...' : 'not set',
    mongooseReadyState: mongoose.connection.readyState,
    mongooseReadyStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use('/api/quizzes', quizzesRouter);

// MongoDB connection
const connectToMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('MONGODB_URI environment variable is not set');
      console.error('Please set MONGODB_URI in your Vercel environment variables');
      process.exit(1);
    }
    
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Log URI without credentials
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    } as mongoose.ConnectOptions);
    
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    console.error('Please check:');
    console.error('1. MONGODB_URI is set correctly in Vercel environment variables');
    console.error('2. MongoDB Atlas IP whitelist allows Vercel IPs (or use 0.0.0.0/0)');
    console.error('3. MongoDB Atlas username/password are correct');
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Connect to MongoDB
connectToMongoDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
