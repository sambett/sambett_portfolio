import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Admin login endpoint
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // For demo purposes, using environment variable for admin password
    // In production, you would hash this and store in a database
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Compare password (in production, this would be hashed)
    const isValid = password === adminPassword;
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { isAdmin: true, loginTime: Date.now() },
      process.env.JWT_SECRET,
      { expiresIn: process.env.SESSION_TIMEOUT ? `${process.env.SESSION_TIMEOUT}ms` : '2h' }
    );

    // Set httpOnly cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: parseInt(process.env.SESSION_TIMEOUT) || 2 * 60 * 60 * 1000 // 2 hours
    });

    res.json({ 
      success: true, 
      message: 'Login successful',
      expiresIn: process.env.SESSION_TIMEOUT || 7200000
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin logout endpoint
router.post('/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.json({ success: true, message: 'Logout successful' });
});

// Check auth status
router.get('/status', authenticateToken, (req, res) => {
  res.json({ 
    authenticated: true,
    admin: req.admin
  });
});

export default router;