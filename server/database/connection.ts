// database/connection.ts
// Robust MongoDB connection management for Vercel serverless

import mongoose from 'mongoose';

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global cache for the database connection
let cached: CachedConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase(): Promise<typeof mongoose> {
  // If we have a cached connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If we don't have a promise, create one
  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      bufferCommands: false,
      // Modern MongoDB connection options
      retryWrites: true,
    };

    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('Please add your MongoDB URI to environment variables');
    }

    // Create the connection promise
    cached.promise = mongoose.connect(mongoUri, opts);
  }

  try {
    // Await the promise and cache the connection
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    // If connection fails, reset the promise so we can try again
    cached.promise = null;
    throw e;
  }
}

export default connectToDatabase;