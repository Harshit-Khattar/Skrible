import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import notesRouter from './routes/notes.js';
import aiRouter from './routes/ai.js';
import taskRouter from './routes/task.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI);

app.use('/api/notes', notesRouter);
app.use('/api/ai', aiRouter);
app.use('/api/tasks', taskRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Skrible' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
