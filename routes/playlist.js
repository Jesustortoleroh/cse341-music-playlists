const express = require('express');
const router = express.Router();
const {
  getAllPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist
} = require('../controllers/playlist');

// Import express-validator rules
const { playlistValidationRules, validate } = require('../util/validation');

// GET all playlists
router.get('/', getAllPlaylists);
// #swagger.tags = ['Playlists']
// #swagger.summary = 'Get all playlists'

// POST create new playlist
router.post('/', playlistValidationRules, validate, createPlaylist);
// #swagger.tags = ['Playlists']
// #swagger.summary = 'Create a new playlist'
/* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Playlist object to be created',
      required: true,
      schema: { $ref: '#/definitions/PlaylistInput' }
} */
/* #swagger.responses[201] = { description: 'Created' } */
/* #swagger.responses[400] = { description: 'Bad Request - Validation Error' } */

// GET playlist by ID
router.get('/:id', getPlaylistById);
// #swagger.tags = ['Playlists']
// #swagger.summary = 'Get playlist by ID'

// PUT update playlist
router.put('/:id', playlistValidationRules, validate, updatePlaylist);
// #swagger.tags = ['Playlists']
// #swagger.summary = 'Update a playlist'

// DELETE playlist
router.delete('/:id', deletePlaylist);
// #swagger.tags = ['Playlists']
// #swagger.summary = 'Delete a playlist'

module.exports = router;