require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); 
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const connectDB = require('./config/db');

const playlistRoutes = require('./routes/playlistRoutes');
const userRoutes = require('./routes/userRoutes'); 

const errorHandler = require('./middleware/errorHandler'); 

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// Trust proxy (útil para Render)
app.set('trust proxy', 1); 

// Security: Helmet
app.use(helmet({ contentSecurityPolicy: false })); 

// Standard Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Welcome Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Music Playlists API',
    documentation: '/api-docs',
  });
});

// API Routes
app.use('/api/playlists', playlistRoutes);
app.use('/api/users', userRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Global Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
