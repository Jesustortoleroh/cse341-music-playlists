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

// Middleware to sanitize input against NoSQL injection
export const sanitizeInput: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const sanitize = (obj: any): any => {
    if (obj instanceof Object) {
      for (const key in obj) {
        if (key.startsWith('$') || key.includes('.')) {
          delete obj[key];
        } else {
          sanitize(obj[key]);
        }
      }
    }
    return obj;
  };

  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  next();
};

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
