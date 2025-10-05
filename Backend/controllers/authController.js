import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { config } from '../config.js';

const JWT_EXPIRES = '7d';

export const signup = async (req, res, next) => {
  try {
    console.log('Signup attempt for email:', req.body.email);
    
    const { name, email, password } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      console.log('Signup failed: Missing required fields');
      return res.status(400).json({ 
        message: 'All fields are required',
        required: ['name', 'email', 'password']
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Signup failed: Email already exists');
      return res.status(400).json({ 
        message: 'Email already in use' 
      });
    }

    // Create new user (password will be hashed by pre-save middleware)
    const user = await User.create({ name, email, password });
    console.log('User created successfully:', user.email);

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id }, 
      config.JWT_SECRET, 
      { expiresIn: JWT_EXPIRES }
    );

    res.status(201).json({ 
      message: 'User created successfully',
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      }
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    console.log('Login attempt for email:', req.body.email);
    
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      console.log('Login failed: Missing credentials');
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Compare password using the model method
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id }, 
      config.JWT_SECRET, 
      { expiresIn: JWT_EXPIRES }
    );

    console.log('Login successful for user:', user.email);
    res.json({ 
      message: 'Login successful',
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    next(error);
  }
};
