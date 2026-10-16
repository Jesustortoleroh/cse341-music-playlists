const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Music Playlists API',
    description: 'API for managing music playlists - CSE 341 Project',
    version: '1.0.0'
  },
  host: 'localhost:3000',
  schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/playlistRoutes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);