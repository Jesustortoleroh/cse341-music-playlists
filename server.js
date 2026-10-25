const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

// Import database connection (models/index.js)
const db = require('./models');

const port = process.env.PORT || 3000;
const app = express();

// Security & Standard Middleware
app
  .use(helmet({ contentSecurityPolicy: false }))
  .use(cors())
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  // Routes
  .use('/', require('./routes'));

// Database Connection and Server Start
const startServer = async () => {
  try {
    await db.mongoose.connect(db.url);

    app.listen(port, () => {
      console.log(`DB Connected and server running on port ${port}.`);
      console.log(`Documentation at http://localhost:${port}/api-docs`);
    });
  } catch (err) {
    console.log('Cannot connect to the database!', err);
    process.exit();
  }
};

startServer();
