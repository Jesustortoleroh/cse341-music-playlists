const mongoose = require('mongoose');
const dbConfig = require('../config/db.config');

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

// Pass mongoose to the models (Factory Pattern)
// This executes the exported function and returns the actual model
db.User = require('./User')(mongoose);
db.Playlist = require('./Playlist')(mongoose);

module.exports = db;
