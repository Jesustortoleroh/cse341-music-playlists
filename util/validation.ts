import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';

// Validation rules for User creation and updates
export const userValidationRules: ValidationChain[] = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Validation rules for Playlist creation and updates
export const playlistValidationRules: ValidationChain[] = [
  body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  body('creator').notEmpty().withMessage('Creator is required'),
  body('genre')
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
    .withMessage('Invalid genre')
];

// Middleware to check for validation errors
export const validate: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
    return;
  }

  next();
};
