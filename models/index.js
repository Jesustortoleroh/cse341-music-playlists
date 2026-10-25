const mongoose = require('mongoose');
const dbConfig = require('../config/db.config');

const db = {
  mongoose: mongoose,
  url: dbConfig.url
};

module.exports = db;