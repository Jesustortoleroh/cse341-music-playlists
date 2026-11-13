import dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import db from './models';
import initializePassport from './config/passport';
import routes from './routes';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';

const port: number = parseInt(process.env.PORT || '3000', 10);
const app: Application = express();

// Trust the reverse proxy (Render) to ensure secure cookies are set correctly
app.set('trust proxy', 1);

// Standard middleware
app
  .use(helmet({ contentSecurityPolicy: false }))
  .use(
    cors({
      origin: 'https://cse341-music-playlists-client.onrender.com', // Frontend URL
      credentials: true // Allow cookies to be sent cross-origin
    })
  )
  .use(express.json({ limit: '10kb' }))
  .use(express.urlencoded({ extended: true, limit: '10kb' }))
  .use(
    session({
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI as string,
        ttl: 14 * 24 * 60 * 60 // Session time to live
      }),
      cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        httpOnly: true, // Prevent client-side JavaScript from reading the cookie
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Allow cross-site cookies in production
        maxAge: 1000 * 60 * 60 * 24 // Cookie expiration time
      }
    })
  )
  .use(passport.initialize())
  .use(passport.session());

// Initialize Passport authentication strategies
initializePassport(passport);

// Mount API routes
app.use('/', routes);

// Export app for testing purposes
export { app };

// Create HTTP server and Apollo Server instance
const httpServer = http.createServer(app);
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    ApolloServerPluginLandingPageLocalDefault({ embed: true })
  ]
});

// Database connection and server startup
const startServer = async (): Promise<void> => {
  try {
    if (!db.url) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await db.mongoose.connect(db.url);
    console.log('MongoDB connected');

    // Start Apollo Server before mounting middleware
    await apolloServer.start();

    // Mount Apollo middleware for GraphQL
    app.use(
      '/graphql',
      expressMiddleware(apolloServer, {
        context: async ({ req, res }) => ({ req, res })
      })
    );

    // Start listening on the HTTP server
    httpServer.listen(port, () => {
      console.log(`DB Connected and server running on port ${port}.`);
      console.log(`API Documentation at http://localhost:${port}/api-docs`);
      console.log(`GraphQL endpoint at http://localhost:${port}/graphql`);
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

// Start the server only if this module is run directly
if (require.main === module) {
  startServer();
}