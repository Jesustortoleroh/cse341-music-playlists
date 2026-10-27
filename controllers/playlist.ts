import { Request, Response } from 'express';
import db from '../models';

const Playlist = db.Playlist;

// GET all playlists
export const getAllPlaylists = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlists = await Playlist.find();
    res.status(200).json({ success: true, count: playlists.length, data: playlists });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET playlist by ID
export const getPlaylistById = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      res.status(404).json({ success: false, message: 'Playlist not found' });
      return;
    }
    res.status(200).json({ success: true, data: playlist });
  } catch (error: any) {
    if (error.name === 'CastError') {
      res.status(400).json({ success: false, message: 'Invalid ID format.' });
      return;
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST create new playlist
export const createPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const newPlaylist = new Playlist(req.body);
    const savedPlaylist = await newPlaylist.save();
    res.status(201).json({ success: true, data: savedPlaylist });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      res.status(400).json({ success: false, message: messages.join(', ') });
      return;
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT update playlist
export const updatePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedPlaylist = await Playlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedPlaylist) {
      res.status(404).json({ success: false, message: 'Playlist not found' });
      return;
    }
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE playlist
export const deletePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedPlaylist = await Playlist.findByIdAndDelete(req.params.id);
    if (!deletedPlaylist) {
      res.status(404).json({ success: false, message: 'Playlist not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Playlist deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
