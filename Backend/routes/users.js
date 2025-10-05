import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// Public routes
router.get('/:id', userController.getProfile);

export default router;
