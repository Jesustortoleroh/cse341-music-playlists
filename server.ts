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

// --- STANDARD MIDDLEWARE ---
app
  .use(helmet({ contentSecurityPolicy: false }))
  .use(cors())
  .use(express.json({ limit: '10kb' }))
  .use(express.urlencoded({ extended: true, limit: '10kb' }))
  .use(
    session({
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI as string,
        ttl: 14 * 24 * 60 * 60
      }),
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24
      }
    })
  )
  .use(passport.initialize())
  .use(passport.session());

// Initialize Passport strategies
initializePassport(passport);

// --- MOUNT ROUTES (OUTSIDE startServer) ---
app.use('/', routes);

// --- EXPORT APP FOR TESTING ---
export { app };

// --- APOLLO SERVER & HTTP SERVER SETUP ---
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

// --- DATABASE CONNECTION & SERVER START ---
const startServer = async (): Promise<void> => {
  try {
    if (!db.url) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await db.mongoose.connect(db.url);
    console.log('MongoDB connected');

    // Start Apollo Server
    await apolloServer.start();

    // Mount Apollo middleware
    app.use(
      '/graphql',
      expressMiddleware(apolloServer, {
        context: async ({ req, res }) => ({ req, res })
      })
    );

    // Listen on httpServer
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

// --- START SERVER ONLY IF RUN DIRECTLY ---
if (require.main === module) {
  startServer();
}
