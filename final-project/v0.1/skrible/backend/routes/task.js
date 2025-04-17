import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

router.get('/:userId/tasks', async (req, res) => {
  const tasks = await Task.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json(tasks);
});

router.post('/:userId/tasks', async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  const newTask = new Task({
    userId: req.params.userId,
    title,
    description,
    status,
    priority,
    dueDate
  });
  const task = await newTask.save();
  res.json(task);
});

router.delete('/:userId/tasks/:taskId', async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.taskId);
  res.json(task);
});

export default router;