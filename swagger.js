const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Music Playlists API',
    description: 'API for managing music playlists - CSE 341 Project',
    version: '1.0.0'
  },
  host: 'cse341-music-playlists.onrender.com',
  schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/playlistRoutes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
