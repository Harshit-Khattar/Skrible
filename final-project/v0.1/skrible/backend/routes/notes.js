import express from 'express';
import Note from '../models/Note.js';

const router = express.Router({ mergeParams: true });

// Get all notes by userId
router.get('/:userId/notes', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.params.userId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error: error.message });
  }
});

// Get note by id
router.get('/:userId/notes/:noteId', async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    if (note.userId.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized to access this note' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching note', error: error.message });
  }
});

// Create new note
router.post('/:userId/notes', async (req, res) => {
  try {
    const { title, body } = req.body;
    const note = new Note({
      userId: req.params.userId,
      title,
      body: body || ''
    });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error creating note', error: error.message });
  }
});

// Update note
router.put('/:userId/notes/:noteId', async (req, res) => {
  try {
    const { title, body, isFavorite, isActive } = req.body;
    const note = await Note.findById(req.params.noteId);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    if (note.userId.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized to update this note' });
    }

    note.title = title;
    note.body = body || '';
    note.isFavorite = isFavorite !== undefined ? isFavorite : note.isFavorite;
    note.isActive = isActive !== undefined ? isActive : note.isActive;
    await note.save({ new: false });
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error updating note', error: error.message });
  }
});

// Delete note
router.delete('/:userId/notes/:noteId', async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    if (note.userId.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }

    await Note.findByIdAndDelete(req.params.noteId);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error: error.message });
  }
});

export default router;