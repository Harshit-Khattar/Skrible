import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  heading: {
    type: String,
    default: 'Untitled Note'
  },
  body: {
    type: String,
    default: ''
  }
}, {
  timestamps: true 
});

export default mongoose.model('Note', noteSchema); 