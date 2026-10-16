const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema(
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
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Playlist', playlistSchema);
