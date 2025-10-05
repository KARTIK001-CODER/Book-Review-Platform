import express from 'express';
import { auth } from '../middleware/auth.js';
import * as reviewController from '../controllers/reviewController.js';

const router = express.Router();

// Protected routes (require authentication)
router.put('/:id', auth, reviewController.updateReview);
router.delete('/:id', auth, reviewController.deleteReview);
router.get('/user/:userId', reviewController.getUserReviews);

export default router;
