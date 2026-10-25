const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlist');
const { playlistValidationRules, validate } = require('../util/validation');

// GET all playlists
router.get('/', playlistController.getAllPlaylists);
// #swagger.tags = ['Playlists']
// #swagger.summary = 'Get all playlists'

// POST create new playlist
router.post('/', playlistValidationRules, validate, playlistController.createPlaylist);
// #swagger.tags = ['Playlists']
// #swagger.summary = 'Create a new playlist'

// GET playlist by ID
router.get('/:id', playlistController.getPlaylistById);
// #swagger.tags = ['Playlists']
// #swagger.summary = 'Get playlist by ID'

// PUT update playlist
router.put('/:id', playlistValidationRules, validate, playlistController.updatePlaylist);
// #swagger.tags = ['Playlists']
// #swagger.summary = 'Update a playlist'

// DELETE playlist
router.delete('/:id', playlistController.deletePlaylist);
// #swagger.tags = ['Playlists']
// #swagger.summary = 'Delete a playlist'

module.exports = router;
