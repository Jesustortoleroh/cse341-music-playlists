const { body, validationResult } = require('express-validator');

const userValidationRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const playlistValidationRules = [
  body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('creator').notEmpty().withMessage('Creator is required'),
  body('genre').isIn(['rock', 'pop', 'jazz', 'classical', 'electronic', 'hip-hop', 'reggae', 'blues', 'folk', 'other']).withMessage('Invalid genre')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); // Everything is fine
  }

  // Return the error directly (No errorHandler)
  return res.status(400).json({ 
    success: false, 
    message: 'Validation failed', 
    errors: errors.array() 
  });
};

module.exports = { userValidationRules, playlistValidationRules, validate };
