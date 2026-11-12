import db from '../models';
import { IPlaylist } from '../models/Playlist';

const Playlist = db.Playlist;

// Get all playlists
export const getAllPlaylists = async (): Promise<IPlaylist[]> => {
  return await Playlist.find();
};

// Get playlist by ID
export const getPlaylistById = async (id: string): Promise<IPlaylist | null> => {
  return await Playlist.findById(id);
};

// Create a new playlist
export const createPlaylist = async (playlistData: Partial<IPlaylist>): Promise<IPlaylist> => {
  const playlist = new Playlist(playlistData);
  return await playlist.save();
};

// Update a playlist
export const updatePlaylist = async (
  id: string,
  playlistData: Partial<IPlaylist>
): Promise<IPlaylist | null> => {
  return await Playlist.findByIdAndUpdate(id, playlistData, {
    new: true,
    runValidators: true
  });
};

// Delete a playlist
export const deletePlaylist = async (id: string): Promise<IPlaylist | null> => {
  return await Playlist.findByIdAndDelete(id);
};
