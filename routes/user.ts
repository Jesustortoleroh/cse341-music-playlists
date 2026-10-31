import express, { Request, Response, NextFunction, Router } from 'express';
import * as userController from '../controllers/user';
import { userValidationRules, validate, sanitizeInput } from '../util/validation';

const router: Router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'You must be logged in to perform this action' });
};

// GET all users
router.get('/', userController.getAllUsers);
// #swagger.tags = ['Users']
// #swagger.summary = 'Get all users'

// POST create new user
router.post('/', sanitizeInput, userValidationRules, validate, userController.createUser);
// #swagger.tags = ['Users']
// #swagger.summary = 'Create a new user'

// GET user by ID
router.get('/:id', userController.getUserById);
// #swagger.tags = ['Users']
// #swagger.summary = 'Get user by ID'

// PUT update user
router.put('/:id', isAuthenticated, sanitizeInput, userValidationRules, validate, userController.updateUser);
// #swagger.tags = ['Users']
// #swagger.summary = 'Update a user'

// DELETE user
router.delete('/:id', isAuthenticated, userController.deleteUser);
// #swagger.tags = ['Users']
// #swagger.summary = 'Delete a user'

export default router;