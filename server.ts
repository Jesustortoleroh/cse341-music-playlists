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

// Database Connection and Server Start
const startServer = async (): Promise<void> => {
  try {
    if (!db.url) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await db.mongoose.connect(db.url);
    console.log('MongoDB connected');

    // Create HTTP server (required for Apollo's graceful shutdown plugin)
    const httpServer = http.createServer(app);

    // Configure Apollo Server with Sandbox enabled
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true, // Required for Sandbox
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        // Use LocalDefault to show the Sandbox without needing Apollo Studio
        ApolloServerPluginLandingPageLocalDefault({ embed: true })
      ]
    });

    // Wait for Apollo to start
    await apolloServer.start();

    // Mount Apollo middleware at /graphql (after Passport session setup)
    app.use(
      '/graphql',
      expressMiddleware(apolloServer, {
        context: async ({ req, res }) => ({ req, res })
      })
    );

    // Mount REST routes (Swagger) - Keep for documentation purposes
    app.use('/', routes);

    // Listen on httpServer (not app directly)
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

// START THE SERVER
startServer();