import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'], 
    index: true,
    trim: true,
    minlength: [1, 'Title must be at least 1 character long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  author: { 
    type: String, 
    required: [true, 'Author is required'], 
    index: true,
    trim: true,
    minlength: [1, 'Author name must be at least 1 character long'],
    maxlength: [100, 'Author name cannot exceed 100 characters']
  },
  description: { 
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  genre: { 
    type: String, 
    index: true,
    trim: true,
    maxlength: [50, 'Genre cannot exceed 50 characters']
  },
  year: { 
    type: Number,
    min: [1000, 'Year must be at least 1000'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  addedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'AddedBy field is required'] 
  },
}, { 
  timestamps: true 
});

// Index for better search performance
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

export default mongoose.model('Book', bookSchema);
