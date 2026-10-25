const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { userValidationRules, validate } = require('../util/validation');

// GET all users
router.get('/', userController.getAllUsers);
// #swagger.tags = ['Users']
// #swagger.summary = 'Get all users'

// POST create new user
router.post('/', userValidationRules, validate, userController.createUser);
// #swagger.tags = ['Users']
// #swagger.summary = 'Create a new user'

// GET user by ID
router.get('/:id', userController.getUserById);
// #swagger.tags = ['Users']
// #swagger.summary = 'Get user by ID'

// PUT update user
router.put('/:id', userValidationRules, validate, userController.updateUser);
// #swagger.tags = ['Users']
// #swagger.summary = 'Update a user'

// DELETE user
router.delete('/:id', userController.deleteUser);
// #swagger.tags = ['Users']
// #swagger.summary = 'Delete a user'

module.exports = router;
