// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Handle custom validation errors coming from express-validator
  if (err.statusCode === 400 && err.errors) {
    return res.status(400).json({
      success: false,
      message: err.message,
      errors: err.errors
    });
  }

  // Handle invalid MongoDB ObjectId (CastError)
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format.' });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  // Handle MongoDB duplicate key error (e.g., duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `Duplicate value for ${field}. Please use another value.`
    });
  }

  // Handle custom errors with specific status codes (like 404)
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // Handle internal server errors (500)
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
