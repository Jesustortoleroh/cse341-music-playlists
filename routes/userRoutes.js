const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { validateUser } = require('../middleware/validate');

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', validateUser, createUser);   
router.put('/:id', validateUser, updateUser); 
router.delete('/:id', deleteUser);

module.exports = router;