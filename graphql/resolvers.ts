import db from '../models';
import { IPlaylist } from '../models/Playlist';

const Playlist = db.Playlist;
const User = db.User;

export const resolvers = {
  Query: {
    playlists: async () => await Playlist.find(),
    playlist: async (_: unknown, { id }: { id: string }) => await Playlist.findById(id),
    users: async () => await User.find(),
    user: async (_: unknown, { id }: { id: string }) => await User.findById(id)
  },
  Mutation: {
    createPlaylist: async (_: unknown, { input }: { input: Partial<IPlaylist> }) => {
      const newPlaylist = new Playlist(input);
      return await newPlaylist.save();
    },
    updatePlaylist: async (
      _: unknown,
      { id, input }: { id: string; input: Partial<IPlaylist> }
    ) => {
      return await Playlist.findByIdAndUpdate(id, input, { new: true, runValidators: true });
    },
    deletePlaylist: async (_: unknown, { id }: { id: string }) => {
      const deleted = await Playlist.findByIdAndDelete(id);
      return deleted !== null;
    }
  }
};