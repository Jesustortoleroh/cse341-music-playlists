require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('passport');
const db = require('./models');

const port = process.env.PORT || 3000;
const app = express();

// Security & Standard Middleware
app
  .use(helmet({ contentSecurityPolicy: false }))
  .use(cors())
  .use(express.json({ limit: '10kb' }))
  .use(express.urlencoded({ extended: true, limit: '10kb' }))
  // Session configuration (Required for Passport)
  .use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production', // true in Render, false in local
      httpOnly: true,
      sameSite: 'lax', // Prevent CSRF attacks
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  }))
  .use(passport.initialize())
  .use(passport.session());

// Initialize Passport strategies
require('./config/passport')(passport);

// Routes
app.use('/', require('./routes'));

// Database Connection and Server Start
const startServer = async () => {
  try {
    await db.mongoose.connect(db.url);
    app.listen(port, () => {
      console.log(`DB Connected and server running on port ${port}.`);
      console.log(`Documentation at http://localhost:${port}/api-docs`);
    });
  } catch (err) {
    console.error('Cannot connect to the database!', err.message);
    throw err;
  }
};

startServer();
