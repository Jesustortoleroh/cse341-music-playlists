const { body, validationResult } = require('express-validator');

// Validation rules for Users
const userValidationRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Please use a valid email address').normalizeEmail(),
  // Note: We check password length here, but you can also use joi-password-complexity if you prefer
  body('password').if((value, { req }) => req.method === 'POST' || value).notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Role must be either user or admin')
];

// Validation rules for Playlists
const playlistValidationRules = [
  body('name').trim().notEmpty().withMessage('Playlist name is required').isLength({ min: 3, max: 50 }).withMessage('Name must be between 3 and 50 characters'),
  body('creator').trim().notEmpty().withMessage('Creator is required').isLength({ min: 2 }).withMessage('Creator name must be at least 2 characters long'),
  body('genre').notEmpty().withMessage('Genre is required').isIn(['rock', 'pop', 'jazz', 'classical', 'electronic', 'hip-hop', 'reggae', 'blues', 'folk', 'other']).withMessage('Invalid genre provided'),
  body('description').optional().trim().isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
  body('songs').optional().isArray().withMessage('Songs must be an array of strings')
];

// Middleware to check for errors and return 400 directly
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  // If no errors, continue to the controller
  if (errors.isEmpty()) {
    return next();
  }

  // If there are errors, format them and return a 400 Bad Request
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors: extractedErrors
  });
};

module.exports = { userValidationRules, playlistValidationRules, validate };