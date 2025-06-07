import express from 'express';
import { validateContact, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Contact form submission
router.post('/', validateContact, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Log contact form submission
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      timestamp: new Date().toISOString()
    });

    // In a real application, you would:
    // 1. Send an email notification
    // 2. Save to database
    // 3. Send auto-reply to user
    
    // For now, just acknowledge receipt
    res.json({
      success: true,
      message: 'Thank you for your message! I\'ll get back to you soon.'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;