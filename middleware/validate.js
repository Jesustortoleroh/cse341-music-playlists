const { body, validationResult } = require('express-validator');

// Rules for User creation and update based on the Mongoose Schema
const userValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please use a valid email address')
      .normalizeEmail(),
    body('password')
      .if((value, { req }) => req.method === 'POST' || value)
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Role must be either user or admin')
  ];
};

// Rules for Playlist creation and update based on the Mongoose Schema
const playlistValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Playlist name is required')
      .isLength({ min: 3, max: 50 })
      .withMessage('Name must be between 3 and 50 characters'),
    body('creator')
      .trim()
      .notEmpty()
      .withMessage('Creator is required')
      .isLength({ min: 2 })
      .withMessage('Creator name must be at least 2 characters long'),
    body('genre')
      .notEmpty()
      .withMessage('Genre is required')
      .isIn([
        'rock',
        'pop',
        'jazz',
        'classical',
        'electronic',
        'hip-hop',
        'reggae',
        'blues',
        'folk',
        'other'
      ])
      .withMessage('Invalid genre provided'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Description cannot exceed 200 characters'),
    body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
    body('songs').optional().isArray().withMessage('Songs must be an array of strings')
  ];
};

// Middleware to check for validation errors and pass them to the global error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  // Extract errors into a clean array format
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  // Create a custom error to send to our global errorHandler
  const error = new Error('Validation failed');
  error.statusCode = 400;
  error.errors = extractedErrors;

  return next(error);
};

module.exports = {
  userValidationRules,
  playlistValidationRules,
  validate
};
