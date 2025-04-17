import express from 'express';
import { GoogleGenAI } from '@google/genai';
import Note from '../models/Note.js';
import Task from '../models/Task.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/query', async (req, res) => {
  const { userId, query } = req.body;
  
  const notes = await Note.find({ userId });
  const tasks = await Task.find({ userId });
  const context = notes.map(note => `Note: ${note.heading}\n${note.body}`).join('\n\n') + '\n\n' + tasks.map(task => `Task: ${task.title}\nDescription: ${task.description}\nDue Date: ${new Date(task.dueDate).toLocaleDateString()}\nStatus: ${task.status}\nPriority: ${task.priority}`).join('\n\n');
  
  const prompt = `
    You are an AI assistant for a note-taking and task planning app called Skrible. 
    The user has asked: "${query}"
    
    Below is the content of all the user's notes and tasks. Please answer the question based ONLY on the information in these notes and tasks.
    If the answer cannot be found in the notes or tasks, please respond with: "I couldn't find that information in your notes or tasks."
    
    User's Notes and Tasks:
    ${context}
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  
  res.json({ response: response.text });
});

export default router; 