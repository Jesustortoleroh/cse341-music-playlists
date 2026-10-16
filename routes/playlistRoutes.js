const express = require('express');
const router = express.Router();
const { getAllPlaylists, getPlaylistById, createPlaylist, updatePlaylist, deletePlaylist } = require('../controllers/playlistController');

// Routes for playlists
router.get('/', getAllPlaylists);          
router.get('/:id', getPlaylistById);       
router.post('/', createPlaylist);          
router.put('/:id', updatePlaylist);        
router.delete('/:id', deletePlaylist);    

module.exports = router;