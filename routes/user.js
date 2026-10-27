const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { userValidationRules, validate } = require('../util/validation');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'You must be logged in to perform this action' });
};

// GET all users
router.get('/', userController.getAllUsers);
// #swagger.tags = ['Users']
// #swagger.summary = 'Get all users'

// POST create new user (Public - anyone can register)
router.post('/', userValidationRules, validate, userController.createUser);
// #swagger.tags = ['Users']
// #swagger.summary = 'Create a new user'

// GET user by ID
router.get('/:id', userController.getUserById);
// #swagger.tags = ['Users']
// #swagger.summary = 'Get user by ID'

// PUT update user (Protected - must be logged in)
router.put('/:id', isAuthenticated, userValidationRules, validate, userController.updateUser);
// #swagger.tags = ['Users']
// #swagger.summary = 'Update a user'

// DELETE user (Protected - must be logged in)
router.delete('/:id', isAuthenticated, userController.deleteUser);
// #swagger.tags = ['Users']
// #swagger.summary = 'Delete a user'

module.exports = router;
