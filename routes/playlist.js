const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlist');
const { playlistValidationRules, validate } = require('../util/validation');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'You must be logged in to perform this action' });
};

// GET all playlists
router.get('/', playlistController.getAllPlaylists);
// #swagger.tags = ['Playlists']
// #swagger.summary = 'Get all playlists'

// POST create new playlist (Protected)
router.post(
  '/',
  isAuthenticated,
  playlistValidationRules,
  validate,
  playlistController.createPlaylist
);
// #swagger.tags = ['Playlists']
// #swagger.summary = 'Create a new playlist'

// GET playlist by ID
router.get('/:id', playlistController.getPlaylistById);
// #swagger.tags = ['Playlists']
// #swagger.summary = 'Get playlist by ID'

// PUT update playlist (Protected)
router.put(
  '/:id',
  isAuthenticated,
  playlistValidationRules,
  validate,
  playlistController.updatePlaylist
);
// #swagger.tags = ['Playlists']
// #swagger.summary = 'Update a playlist'

// DELETE playlist (Protected)
router.delete('/:id', isAuthenticated, playlistController.deletePlaylist);
// #swagger.tags = ['Playlists']
// #swagger.summary = 'Delete a playlist'

module.exports = router;
