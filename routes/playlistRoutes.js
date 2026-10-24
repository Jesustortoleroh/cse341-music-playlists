const express = require('express');
const router = express.Router();
const {
  getAllPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist
} = require('../controllers/playlistController');

// Import validation rules and middleware
const { playlistValidationRules, validate } = require('../middleware/validate');

// GET all playlists
router.get('/', (req, res, next) => {
  // #swagger.tags = ['Playlists']
  // #swagger.summary = 'Get all playlists'
  // #swagger.description = 'Returns a list of all playlists in the database.'
  /* #swagger.responses[200] = { 
        description: 'OK',
        schema: [{ $ref: '#/definitions/Playlist' }] 
  } */
  /* #swagger.responses[500] = { description: 'Internal Server Error' } */
  getAllPlaylists(req, res, next);
});

// POST create new playlist
// Changed: Added playlistValidationRules() and validate
router.post('/', playlistValidationRules(), validate, (req, res, next) => {
  // #swagger.tags = ['Playlists']
  // #swagger.summary = 'Create a new playlist'
  // #swagger.description = 'Adds a new playlist to the database.'
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Playlist object to be created',
        required: true,
        schema: { $ref: '#/definitions/PlaylistInput' }
  } */
  /* #swagger.responses[201] = { 
        description: 'Created',
        schema: { $ref: '#/definitions/Playlist' } 
  } */
  /* #swagger.responses[400] = { description: 'Bad Request - Validation Error' } */
  createPlaylist(req, res, next);
});

// GET playlist by ID
router.get('/:id', (req, res, next) => {
  // #swagger.tags = ['Playlists']
  // #swagger.summary = 'Get playlist by ID'
  /* #swagger.parameters['id'] = { 
        in: 'path', 
        description: 'The MongoDB ObjectId of the playlist', 
        required: true, 
        type: 'string' 
  } */
  /* #swagger.responses[200] = { 
        description: 'OK',
        schema: { $ref: '#/definitions/Playlist' } 
  } */
  /* #swagger.responses[404] = { description: 'Not Found' } */
  getPlaylistById(req, res, next);
});

// PUT update playlist
// Changed: Added playlistValidationRules() and validate
router.put('/:id', playlistValidationRules(), validate, (req, res, next) => {
  // #swagger.tags = ['Playlists']
  // #swagger.summary = 'Update a playlist'
  /* #swagger.parameters['id'] = { 
        in: 'path', 
        description: 'The MongoDB ObjectId of the playlist', 
        required: true, 
        type: 'string' 
  } */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Fields to update',
        required: true,
        schema: { $ref: '#/definitions/PlaylistInput' }
  } */
  /* #swagger.responses[200] = { 
        description: 'OK',
        schema: { $ref: '#/definitions/Playlist' } 
  } */
  /* #swagger.responses[404] = { description: 'Not Found' } */
  updatePlaylist(req, res, next);
});

// DELETE playlist
router.delete('/:id', (req, res, next) => {
  // #swagger.tags = ['Playlists']
  // #swagger.summary = 'Delete a playlist'
  /* #swagger.parameters['id'] = { 
        in: 'path', 
        description: 'The MongoDB ObjectId of the playlist', 
        required: true, 
        type: 'string' 
  } */
  /* #swagger.responses[200] = { description: 'OK - Deleted successfully' } */
  /* #swagger.responses[404] = { description: 'Not Found' } */
  deletePlaylist(req, res, next);
});

module.exports = router;