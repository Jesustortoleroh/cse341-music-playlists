import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Music Playlists API',
    description: 'API for managing music playlists and users - CSE 341 Project',
    version: '1.0.0'
  },
  host: 'cse341-music-playlists.onrender.com',
  schemes: ['https'],
  basePath: '/',
  securityDefinitions: {
    session: {
      type: 'apiKey',
      in: 'cookie',
      name: 'connect.sid',
      description:
        'Session-based authentication. Login with GitHub or Google to get a secure session cookie.'
    }
  },
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
      _id: '66abc123def4567890abcdef',
      name: 'My Awesome Playlist',
      description: 'A collection of my favorite songs',
      creator: 'Jesus Tortolero',
      genre: 'jazz',
      songs: ['Take Five - Dave Brubeck'],
      isPublic: true,
      coverImage: 'https://picsum.photos/400/400?random=10',
      createdAt: '2026-10-17T00:00:00.000Z',
      updatedAt: '2026-10-17T00:00:00.000Z'
    },
    UserInput: {
      name: 'Jesus Tortolero',
      email: 'jesus@example.com',
      password: 'securePassword123',
      role: 'user'
    },
    User: {
      _id: '66abc123def4567890abcdef',
      name: 'Jesus Tortolero',
      email: 'jesus@example.com',
      role: 'user',
      provider: 'github',
      createdAt: '2026-10-17T00:00:00.000Z',
      updatedAt: '2026-10-17T00:00:00.000Z'
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/playlist.ts', './routes/user.ts'];

// Handle the Promise to satisfy TypeScript
(async () => {
  await swaggerAutogen(outputFile, endpointsFiles, doc);
  console.log('Swagger documentation generated successfully.');
})();
