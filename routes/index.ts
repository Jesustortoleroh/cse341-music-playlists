import express, { Request, Response, Router } from 'express';
import userRoutes from './user';
import playlistRoutes from './playlist';
import authRoutes from './auth';
import swaggerRoutes from './swagger';

const router: Router = express.Router();

// Welcome route for the root URL
router.get('/', (req: Request, res: Response) => {
  res.json({
    message: '🎵 Welcome to the Music Playlists API - CSE 341',
    documentation: '/api-docs',
    endpoints: {
      playlists: '/api/playlists',
      users: '/api/users'
    }
  });
});

// API Routes
router.use('/api/users', userRoutes);
router.use('/api/playlists', playlistRoutes);

// Auth Routes
router.use('/auth', authRoutes);

// Swagger Documentation
router.use('/', swaggerRoutes);

export default router;
