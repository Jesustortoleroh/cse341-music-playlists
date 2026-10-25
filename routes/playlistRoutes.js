const express = require('express');
const router = express.Router();
const {
  getAllPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist
} = require('../controllers/playlistController');
const { validatePlaylist } = require('../middleware/validate');

// GET all playlists
router.get('/', (req, res, next) => {
  // #swagger.tags = ['Playlists']
  // #swagger.summary = 'Get all playlists'
  getAllPlaylists(req, res, next);
});

// POST create new playlist
router.post('/', validatePlaylist, (req, res, next) => {
  // #swagger.tags = ['Playlists']
  // #swagger.summary = 'Create a new playlist'
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Playlist object to be created',
        required: true,
        schema: { $ref: '#/definitions/PlaylistInput' }
  } */
  createPlaylist(req, res, next);
});

// GET playlist by ID
router.get('/:id', (req, res, next) => {
  // #swagger.tags = ['Playlists']
  // #swagger.summary = 'Get playlist by ID'
  getPlaylistById(req, res, next);
});

// PUT update playlist
router.put('/:id', validatePlaylist, (req, res, next) => {
  // #swagger.tags = ['Playlists']
  // #swagger.summary = 'Update a playlist'
  updatePlaylist(req, res, next);
});

// DELETE playlist
router.delete('/:id', (req, res, next) => {
  // #swagger.tags = ['Playlists']
  // #swagger.summary = 'Delete a playlist'
  deletePlaylist(req, res, next);
});

module.exports = router;