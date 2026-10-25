const { body, validationResult } = require('express-validator');

// Validation rules for User creation and updates
const userValidationRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Validation rules for Playlist creation and updates
const playlistValidationRules = [
  body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('creator').notEmpty().withMessage('Creator is required'),
  body('genre').isIn(['rock', 'pop', 'jazz', 'classical', 'electronic', 'hip-hop', 'reggae', 'blues', 'folk', 'other']).withMessage('Invalid genre')
];

// Middleware to check for validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // If there are errors, return a 400 Bad Request directly (No errorHandler)
    // This prevents the 'next is not a function' crash in Express 5
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }
  
  // If validation passes, continue to the controller
  next();
};

module.exports = { userValidationRules, playlistValidationRules, validate };