import mongoose from 'mongoose';
import dbConfig from '../config/db.config';
import createUserModel from './User';
import createPlaylistModel from './Playlist';

const db = {
  mongoose: mongoose,
  url: dbConfig.url,
  User: createUserModel(mongoose),
  Playlist: createPlaylistModel(mongoose)
};

export default db;
