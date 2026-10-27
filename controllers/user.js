const db = require('../models');
const User = db.User;

// POST create new user
module.exports.createUser = (req, res) => {
  try {
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).json({ message: 'Content can not be empty!' });
    }

    const user = new User(req.body);
    user
      .save()
      .then((data) => {
        // Hide password from the response for security
        data.password = undefined;
        res.status(201).json({ success: true, message: 'User created', data: data });
      })
      .catch((err) => {
        // Handle Mongoose validation errors or duplicate emails
        if (err.code === 11000) {
          return res.status(400).json({ message: 'Email already exists' });
        }
        res
          .status(500)
          .json({ message: err.message || 'Some error occurred while creating the user.' });
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET all users
module.exports.getAllUsers = (req, res) => {
  try {
    User.find({})
      .then((data) => {
        res.status(200).json({ success: true, count: data.length, data: data });
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: err.message || 'Some error occurred while retrieving users.' });
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET user by ID
module.exports.getUserById = (req, res) => {
  try {
    const id = req.params.id;
    User.findById(id)
      .then((data) => {
        if (!data) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ success: true, data: data });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message || 'Some error occurred.' });
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

// PUT update user
module.exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'Invalid ID Supplied' });
    }
    User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
      .then((data) => {
        if (!data) return res.status(404).json({ message: 'User not found' });
        // Return 204 No Content for a successful update
        res.status(204).send();
      })
      .catch((err) => {
        res.status(500).json({ message: err.message || 'Some error occurred while updating.' });
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

// DELETE user
module.exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'Invalid ID Supplied' });
    }
    User.findByIdAndDelete(id)
      .then((data) => {
        if (!data) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ success: true, message: 'User deleted successfully' });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message || 'Some error occurred while deleting.' });
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Find or create a user from OAuth login
module.exports.findOrCreateOAuthUser = async (profile, provider) => {
  // Try to find the user by email
  let currentUser = await User.findOne({ email: profile.email });

  if (currentUser) {
    return currentUser; // User exists, return it
  }

  // If not found, create a new user
  const newUser = new User({
    name: profile.name,
    email: profile.email,
    provider: provider,
    role: 'user'
  });

  await newUser.save();
  return newUser;
};

// Find user by ID (used by Passport for deserialization)
module.exports.getUserByIdForAuth = async (id) => {
  return await User.findById(id);
};
