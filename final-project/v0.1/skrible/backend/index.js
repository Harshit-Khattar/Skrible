import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import * as process from 'process';
import notesRouter from './routes/notes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//****:****@')); // Hide credentials

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    console.log('Database name:', mongoose.connection.db.databaseName);
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Routes
app.use('/api/notes', notesRouter);

// Basic route to test the server
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Skrible API' });
});

// Error handling middleware
/* eslint-disable-next-line no-unused-vars */
app.use((err, req, res, _next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: err.message 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
