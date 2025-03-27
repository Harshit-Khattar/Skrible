import express from 'express';
import Note from '../models/Note.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { userId, heading, body, _id } = req.body;
  
  let note;
  if (_id) {
    note = await Note.findByIdAndUpdate(
      _id,
      { heading, body: body || '' },
      { new: true }
    );
  } else {
    note = new Note({
      userId,
      heading,
      body: body || ''
    });
    await note.save();
  }
  
  res.status(201).json(note);
});

router.get('/:userId', async (req, res) => {
  const notes = await Note.find({ userId: req.params.userId });
  res.json(notes);
});

export default router; 