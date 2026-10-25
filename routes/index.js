const express = require('express');
const router = express.Router();

// Welcome route for the root URL
router.get('/', (req, res) => {
  res.json({
    message: '🎵 Welcome to the Music Playlists API - CSE 341',
    documentation: '/api-docs',
    endpoints: {
      playlists: '/api/playlists',
      users: '/api/users'
    }
  });
});

// API Routes
router.use('/api/users', require('./user'));
router.use('/api/playlists', require('./playlist'));

// Swagger Documentation
router.use('/', require('./swagger'));

module.exports = router;
