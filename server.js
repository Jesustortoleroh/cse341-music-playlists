require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const connectDB = require('./config/db');

// Import routes
const playlistRoutes = require('./routes/playlistRoutes');
const userRoutes = require('./routes/userRoutes');

// Import global error handler
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Trust the proxy (needed for Render) so the rate limiter gets the real client IP
app.set('trust proxy', 1);

// Security: Helmet (Protects HTTP headers)
// Note: contentSecurityPolicy is disabled so Swagger UI can load properly
app.use(helmet({ contentSecurityPolicy: false }));

// Security: Rate Limiting (Prevents brute-force attacks)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Standard Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Limit payload size for security
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Welcome Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Music Playlists API',
    documentation: '/api-docs',
    endpoints: {
      playlists: '/api/playlists',
      users: '/api/users'
    }
  });
});

// API Routes
app.use('/api/playlists', playlistRoutes);
app.use('/api/users', userRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Global Error Handling Middleware (Must be the last middleware)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`🔥Server is running on port ${PORT}`);
  console.log(` Documentation at http://localhost:${PORT}/api-docs`);
});
