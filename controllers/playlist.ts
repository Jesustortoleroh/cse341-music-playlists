import { Request, Response } from 'express';
import * as playlistService from '../services/playlist.service';

// GET all playlists
export const getAllPlaylists = async (req: Request, res: Response): Promise<void> => {
  try {
    const playlists = await playlistService.getAllPlaylists();
    res.status(200).json({ success: true, count: playlists.length, data: playlists });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Some error occurred while retrieving playlists.';
    res.status(500).json({ success: false, message });
  }
};

// GET playlist by ID
export const getPlaylistById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const playlist = await playlistService.getPlaylistById(id);
    if (!playlist) {
      res.status(404).json({ success: false, message: 'Playlist not found' });
      return;
    }
    res.status(200).json({ success: true, data: playlist });
  } catch (err: unknown) {
    // Handle CastError (invalid MongoDB ID format)
    if (err && typeof err === 'object' && 'name' in err && err.name === 'CastError') {
      res.status(400).json({ success: false, message: 'Invalid ID format.' });
      return;
    }
    const message = err instanceof Error ? err.message : 'Some error occurred.';
    res.status(500).json({ success: false, message });
  }
};

// POST create new playlist
export const createPlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const savedPlaylist = await playlistService.createPlaylist(req.body);
    res.status(201).json({ success: true, data: savedPlaylist });
  } catch (err: unknown) {
    // Handle Mongoose ValidationError
    if (err && typeof err === 'object' && 'name' in err && err.name === 'ValidationError') {
      const validationErr = err as unknown as { errors: Record<string, { message: string }> };
      const messages = Object.values(validationErr.errors ?? {}).map((val) => val.message);
      res.status(400).json({ success: false, message: messages.join(', ') });
      return;
    }
    const message =
      err instanceof Error ? err.message : 'Some error occurred while creating the playlist.';
    res.status(500).json({ success: false, message });
  }
};

// PUT update playlist
export const updatePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updatedPlaylist = await playlistService.updatePlaylist(id, req.body);
    if (!updatedPlaylist) {
      res.status(404).json({ success: false, message: 'Playlist not found' });
      return;
    }
    res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Some error occurred while updating.';
    res.status(500).json({ success: false, message });
  }
};

// DELETE playlist
export const deletePlaylist = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deletedPlaylist = await playlistService.deletePlaylist(id);
    if (!deletedPlaylist) {
      res.status(404).json({ success: false, message: 'Playlist not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Playlist deleted successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Some error occurred while deleting.';
    res.status(500).json({ success: false, message });
  }
};
