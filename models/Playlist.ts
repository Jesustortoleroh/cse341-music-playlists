import { Model, Schema, Mongoose } from 'mongoose';

export interface IPlaylist {
  name: string;
  description?: string;
  creator: string;
  genre: string;
  songs: string[];
  isPublic: boolean;
  coverImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const playlistSchema = new Schema<IPlaylist>(
  {
    name: {
      type: String,
      required: [true, 'Playlist name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: 'No description provided'
    },
    creator: {
      type: String,
      required: [true, 'Creator is required'],
      trim: true,
      minlength: [2, 'Creator name must be at least 2 characters long']
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      enum: {
        values: [
          'rock',
          'pop',
          'jazz',
          'classical',
          'electronic',
          'hip-hop',
          'reggae',
          'blues',
          'folk',
          'other'
        ],
        message: '{VALUE} is not a valid genre'
      }
    },
    songs: {
      type: [String],
      default: []
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    coverImage: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { timestamps: true }
);

// Factory pattern with typed mongoose instance
const createPlaylistModel = (mongooseInstance: Mongoose): Model<IPlaylist> => {
  return mongooseInstance.model<IPlaylist>('playlists', playlistSchema);
};

export default createPlaylistModel;
