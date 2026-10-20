const validatePlaylist = (req, res, next) => {
  const { name, creator, genre } = req.body;

  // For PUT requests, allow partial updates
  if (req.method === 'PUT') {
    if (name && name.length < 3) {
      return res.status(400).json({ success: false, message: 'Name must be at least 3 characters.' });
    }
    return next();
  }

  // For POST requests, all fields are required
  if (!name || !creator || !genre) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: name, creator, and genre are required.'
    });
  }

  if (name.length < 3) {
    return res.status(400).json({ success: false, message: 'Name must be at least 3 characters.' });
  }

  next();
};

const validateUser = (req, res, next) => {
  const { name, email, password } = req.body;

  if (req.method === 'POST') {
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed: name, email, and password are required.'
      });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }
  }
  
  next();
};

module.exports = { validatePlaylist, validateUser };