const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Music Playlists API',
    description: 'API for managing music playlists - CSE 341 Project',
    version: '1.0.0'
  },
  host: 'cse341-music-playlists.onrender.com',
  schemes: ['https'],
  definitions: {
    PlaylistInput: {
      name: 'My Awesome Playlist',
      description: 'A collection of my favorite songs',
      creator: 'Jesus Tortolero',
      genre: 'jazz',
      songs: ['Take Five - Dave Brubeck'],
      isPublic: true,
      coverImage: 'https://picsum.photos/400/400?random=10'
    },
    Playlist: {
      _id: '66abc123def456...',
      name: 'My Awesome Playlist',
      description: 'A collection of my favorite songs',
      creator: 'Jesus Tortolero',
      genre: 'jazz',
      songs: ['Take Five - Dave Brubeck'],
      isPublic: true,
      coverImage: 'https://picsum.photos/400/400?random=10',
      createdAt: '2026-10-17T00:00:00.000Z',
      updatedAt: '2026-10-17T00:00:00.000Z'
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/playlistRoutes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
