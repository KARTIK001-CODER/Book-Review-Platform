import express from 'express';
import { auth } from '../middleware/auth.js';
import * as bookController from '../controllers/bookController.js';
import * as reviewController from '../controllers/reviewController.js';

const router = express.Router();

// Public routes
router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookDetails);

// Protected routes (require authentication)
router.post('/', auth, bookController.createBook);
router.put('/:id', auth, bookController.updateBook);
router.delete('/:id', auth, bookController.deleteBook);

// Nested review routes for convenience
router.post('/:bookId/reviews', auth, reviewController.addReview);

export default router;
