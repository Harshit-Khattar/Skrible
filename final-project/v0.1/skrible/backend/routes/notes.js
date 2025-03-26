import express from 'express';
import Note from '../models/Note.js';

const router = express.Router();

// Create or update a note
router.post('/', async (req, res) => {
  try {
    console.log('Received note creation/update request');
    console.log('Request body:', req.body);
    
    const { userId, heading, body, _id } = req.body;
    
    if (!userId) {
      console.error('Missing userId');
      return res.status(400).json({ message: 'userId is required' });
    }

    if (!heading) {
      console.error('Missing heading');
      return res.status(400).json({ message: 'heading is required' });
    }

    let note;
    if (_id) {
      // Update existing note
      console.log('Updating existing note with _id:', _id);
      note = await Note.findByIdAndUpdate(
        _id,
        { heading, body: body || '' },
        { new: true, runValidators: true }
      );
    } else {
      // Create new note
      console.log('Creating new note with data:', { userId, heading, body });
      note = new Note({
        userId,
        heading,
        body: body || ''
      });
      await note.save();
    }
    
    console.log('Note saved successfully:', note);
    res.status(201).json(note);
  } catch (error) {
    console.error('Error in note creation/update:', error);
    res.status(500).json({ 
      message: 'Error saving note',
      error: error.message 
    });
  }
});

// Get all notes for a user
router.get('/:userId', async (req, res) => {
  try {
    console.log('Fetching notes for user:', req.params.userId);
    const notes = await Note.find({ userId: req.params.userId });
    console.log('Found notes:', notes);
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ 
      message: 'Error fetching notes',
      error: error.message 
    });
  }
});

export default router; 