import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import db from './models';
import initializePassport from './config/passport';
import routes from './routes';

const port: number = parseInt(process.env.PORT || '3000', 10);
const app: Application = express();

// Security & Standard Middleware
app
  .use(helmet({ contentSecurityPolicy: false }))
  .use(cors())
  .use(express.json({ limit: '10kb' }))
  .use(express.urlencoded({ extended: true, limit: '10kb' }))
  // Session configuration (Required for Passport)
  .use(
    session({
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI as string,
        ttl: 14 * 24 * 60 * 60 // Time to live: 14 days
      }),
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 // 1 day
      }
    })
  )
  .use(passport.initialize())
  .use(passport.session());

// Initialize Passport strategies
initializePassport(passport);

// Routes
app.use('/', routes);

// Database Connection and Server Start
const startServer = async (): Promise<void> => {
  try {
    if (!db.url) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await db.mongoose.connect(db.url);
    app.listen(port, () => {
      console.log(`DB Connected and server running on port ${port}.`);
      console.log(`Documentation at http://localhost:${port}/api-docs`);
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Cannot connect to the database!', err.message);
    } else {
      console.error('Cannot connect to the database!', err);
    }
    throw err;
  }
};

// START THE SERVER
startServer();
