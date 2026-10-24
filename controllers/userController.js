const User = require('../models/User');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error); //  Delegate error to global handler
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404; // Create 404 error to pass to handler
      return next(err);
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error); // Removed local CastError handling, let global handler do it
  }
};

const createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    newUser.password = undefined; 
    res.status(201).json({ success: true, message: 'User created', data: newUser });
  } catch (error) {
    next(error); // Removed local ValidationError and 11000 handling
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { 
      new: true, 
      runValidators: true 
    }).select('-password');
    
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }
    res.status(200).json({ success: true, message: 'User updated', data: user });
  } catch (error) {
    next(error); //  Delegate to global handler
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error); // Delegate to global handler
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };