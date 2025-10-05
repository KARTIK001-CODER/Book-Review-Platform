import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { config } from '../config.js';

export const auth = async (req, res, next) => {
  try {
    console.log('Auth middleware: Checking authentication...');
    
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('Auth middleware: No valid authorization header');
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Auth middleware: Verifying token...');
    
    const payload = jwt.verify(token, config.JWT_SECRET);
    console.log('Auth middleware: Token verified for user ID:', payload.id);
    
    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      console.log('Auth middleware: User not found');
      return res.status(401).json({ message: 'Access denied. User not found.' });
    }
    
    req.user = user;
    console.log('Auth middleware: User authenticated successfully:', user.email);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Access denied. Invalid token.' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access denied. Token expired.' });
    }
    
    return res.status(500).json({ message: 'Internal server error during authentication.' });
  }
};
