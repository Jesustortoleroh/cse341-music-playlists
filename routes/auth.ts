import express, { Request, Response, NextFunction, Router } from 'express';
import passport from 'passport';

const router: Router = express.Router();

// --- GITHUB ROUTES ---
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req: Request, res: Response) => res.redirect('/auth/profile')
);

// --- GOOGLE ROUTES ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req: Request, res: Response) => res.redirect('/auth/profile')
);

// --- PROTECTED PROFILE ROUTE ---
router.get('/profile', (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.json({ success: true, user: req.user });
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
});

// --- LOGOUT ROUTE ---
<<<<<<< HEAD:routes/auth.js
// Modern practice: Handle errors directly instead of using next()
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      const message = err instanceof Error ? err.message : 'Error logging out';
      return res.status(500).json({ success: false, message });
    }
=======
router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.logout((err: Error | null) => {
    if (err) return next(err);
>>>>>>> aed8cf0d6aed9f21bbe13af8368dea65def48d59:routes/auth.ts
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

export default router;
