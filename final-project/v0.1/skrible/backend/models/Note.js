import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Untitled Note'
  },
  body: {
    type: String,
    default: ''
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true 
});

export default mongoose.model('Note', noteSchema); 