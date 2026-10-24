const Playlist = require('../models/Playlist');

// Get all playlists
const getAllPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find();
    res.status(200).json(playlists);
  } catch (error) {
    next(error); // Delegate error to global handler
  }
};

// Get playlist by ID
const getPlaylistById = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      const err = new Error('Playlist not found');
      err.statusCode = 404; // Create 404 error to pass to handler
      return next(err);
    }
    res.status(200).json(playlist);
  } catch (error) {
    next(error); // Delegate error to global handler
  }
};

// POST create new playlist
const createPlaylist = async (req, res, next) => {
  try {
    const newPlaylist = new Playlist(req.body);
    const savedPlaylist = await newPlaylist.save();
    res.status(201).json(savedPlaylist);
  } catch (error) {
    next(error); // Delegate error to global handler
  }
};

// PUT update playlist
const updatePlaylist = async (req, res, next) => {
  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedPlaylist) {
      const err = new Error('Playlist not found');
      err.statusCode = 404;
      return next(err);
    }
    res.status(200).json(updatedPlaylist);
  } catch (error) {
    next(error); // Delegate error to global handler
  }
};

// DELETE playlist
const deletePlaylist = async (req, res, next) => {
  try {
    const deletedPlaylist = await Playlist.findByIdAndDelete(req.params.id);
    if (!deletedPlaylist) {
      const err = new Error('Playlist not found');
      err.statusCode = 404;
      return next(err);
    }
    res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    next(error); // Delegate error to global handler
  }
};

module.exports = {
  getAllPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist
};
