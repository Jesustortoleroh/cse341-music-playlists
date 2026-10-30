const db = require('../models');
const Playlist = db.Playlist;

// GET all playlists
module.exports.getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find();
    res.status(200).json({ success: true, count: playlists.length, data: playlists });
  } catch (error) {
    // Best practice: Check if error is an instance of Error before accessing message
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ success: false, message });
  }
};

// GET playlist by ID
module.exports.getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }
    res.status(200).json({ success: true, data: playlist });
  } catch (error) {
    // Handle invalid ID format (CastError)
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid ID format.' });
    }
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ success: false, message });
  }
};

// POST create new playlist
module.exports.createPlaylist = async (req, res) => {
  try {
    const newPlaylist = new Playlist(req.body);
    const savedPlaylist = await newPlaylist.save();
    res.status(201).json({ success: true, data: savedPlaylist });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ success: false, message });
  }
};

// PUT update playlist
module.exports.updatePlaylist = async (req, res) => {
  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedPlaylist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }
    // Return 204 No Content for a successful update
    res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ success: false, message });
  }
};

// DELETE playlist
module.exports.deletePlaylist = async (req, res) => {
  try {
    const deletedPlaylist = await Playlist.findByIdAndDelete(req.params.id);
    if (!deletedPlaylist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }
    res.status(200).json({ success: true, message: 'Playlist deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ success: false, message });
  }
};
