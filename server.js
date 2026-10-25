const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./models'); // Import database connection

const port = process.env.PORT || 3000;
const app = express();

// Security & Standard Middleware
app
  .use(helmet({ contentSecurityPolicy: false })) // Security headers
  .use(cors()) // Enable CORS for all routes
  .use(express.json({ limit: '10kb' })) // Parse JSON bodies with a size limit
  .use(express.urlencoded({ extended: true, limit: '10kb' })) // Parse URL-encoded bodies
  // Routes
  .use('/', require('./routes'));

// Database Connection and Server Start
const startServer = async () => {
  try {
    // Connect to MongoDB before starting the server
    await db.mongoose.connect(db.url);

    app.listen(port, () => {
      console.log(`DB Connected and server running on port ${port}.`);
      console.log(`Documentation at http://localhost:${port}/api-docs`);
    });
  } catch (err) {
    // Log the error and exit gracefully
    console.error('Cannot connect to the database!', err.message);
    throw err; // Let Node.js exit with a non-zero code naturally
  }
};

startServer();
