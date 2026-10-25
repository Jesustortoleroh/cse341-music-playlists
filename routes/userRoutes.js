const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { validateUser } = require('../middleware/validate');

// GET all users
router.get('/', (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Get all users'
  // #swagger.description = 'Returns a list of all users in the database.'
  /* #swagger.responses[200] = { 
        description: 'OK',
        schema: [{ $ref: '#/definitions/User' }] 
  } */
  /* #swagger.responses[500] = { description: 'Internal Server Error' } */
  getAllUsers(req, res, next);
});

// POST create new user
router.post('/', validateUser, (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Create a new user'
  // #swagger.description = 'Adds a new user to the database.'
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'User object to be created',
        required: true,
        schema: { $ref: '#/definitions/UserInput' }
  } */
  /* #swagger.responses[201] = { 
        description: 'Created',
        schema: { $ref: '#/definitions/User' } 
  } */
  /* #swagger.responses[400] = { description: 'Bad Request - Validation Error' } */
  /* #swagger.responses[409] = { description: 'Conflict - Email already exists' } */
  createUser(req, res, next);
});

// GET user by ID
router.get('/:id', (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Get user by ID'
  /* #swagger.parameters['id'] = { 
        in: 'path', 
        description: 'The MongoDB ObjectId of the user', 
        required: true, 
        type: 'string' 
  } */
  /* #swagger.responses[200] = { 
        description: 'OK',
        schema: { $ref: '#/definitions/User' } 
  } */
  /* #swagger.responses[404] = { description: 'Not Found' } */
  getUserById(req, res, next);
});

// PUT update user
router.put('/:id', validateUser, (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Update a user'
  /* #swagger.parameters['id'] = { 
        in: 'path', 
        description: 'The MongoDB ObjectId of the user', 
        required: true, 
        type: 'string' 
  } */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Fields to update',
        required: true,
        schema: { $ref: '#/definitions/UserInput' }
  } */
  /* #swagger.responses[200] = { 
        description: 'OK',
        schema: { $ref: '#/definitions/User' } 
  } */
  /* #swagger.responses[404] = { description: 'Not Found' } */
  updateUser(req, res, next);
});

// DELETE user
router.delete('/:id', (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Delete a user'
  /* #swagger.parameters['id'] = { 
        in: 'path', 
        description: 'The MongoDB ObjectId of the user', 
        required: true, 
        type: 'string' 
  } */
  /* #swagger.responses[200] = { description: 'OK - Deleted successfully' } */
  /* #swagger.responses[404] = { description: 'Not Found' } */
  deleteUser(req, res, next);
});

module.exports = router;
