const db = require('../models');
const User = db.User;

// POST create new user
module.exports.createUser = async (req, res) => {
  try {
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).json({ message: 'Content can not be empty!' });
    }

    const user = new User(req.body);
    const data = await user.save();

    // Hide password from the response for security
    const userResponse = data.toObject();
    delete userResponse.password;

    res.status(201).json({ success: true, message: 'User created', data: userResponse });
  } catch (err) {
    // Handle duplicate emails (MongoDB error code 11000)
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const message =
      err instanceof Error ? err.message : 'Some error occurred while creating the user.';
    res.status(500).json({ message });
  }
};

// GET all users
module.exports.getAllUsers = async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json({ success: true, count: data.length, data: data });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Some error occurred while retrieving users.';
    res.status(500).json({ message });
  }
};

// GET user by ID
module.exports.getUserById = async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ success: true, data: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Some error occurred.';
    res.status(500).json({ message });
  }
};

// PUT update user
module.exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'Invalid ID Supplied' });
    }

    const data = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!data) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Return 204 No Content for a successful update
    res.status(204).send();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Some error occurred while updating.';
    res.status(500).json({ message });
  }
};

// DELETE user
module.exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'Invalid ID Supplied' });
    }

    const data = await User.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Some error occurred while deleting.';
    res.status(500).json({ message });
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
