const express = require('express');
const router = express.Router();

// API Routes
router.use('/api/users', require('./user'));
router.use('/api/playlists', require('./playlist'));

// Swagger Documentation
router.use('/', require('./swagger'));

module.exports = router;
