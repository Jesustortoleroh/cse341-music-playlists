import express, { Request, Response, NextFunction, Router } from 'express';
import * as playlistController from '../controllers/playlist';
import { playlistValidationRules, validate } from '../util/validation';

const router: Router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'You must be logged in to perform this action' });
};

// GET all playlists
router.get('/', playlistController.getAllPlaylists);
// #swagger.tags = ['Playlists']
// #swagger.summary = 'Get all playlists'

// POST create new playlist
router.post(
  '/',
  isAuthenticated,
  playlistValidationRules,
  validate,
  playlistController.createPlaylist
);
// #swagger.tags = ['Playlists']
// #swagger.summary = 'Create a new playlist'

// GET playlist by ID
router.get('/:id', playlistController.getPlaylistById);
// #swagger.tags = ['Playlists']
// #swagger.summary = 'Get playlist by ID'

// PUT update playlist
router.put(
  '/:id',
  isAuthenticated,
  playlistValidationRules,
  validate,
  playlistController.updatePlaylist
);
// #swagger.tags = ['Playlists']
// #swagger.summary = 'Update a playlist'

// DELETE playlist
router.delete('/:id', isAuthenticated, playlistController.deletePlaylist);
// #swagger.tags = ['Playlists']
// #swagger.summary = 'Delete a playlist'

export default router;
