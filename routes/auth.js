const express = require('express');
const router = express.Router();
const passport = require('passport');

// --- GITHUB ROUTES ---
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => res.redirect('/auth/profile')
);

// --- GOOGLE ROUTES ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/auth/profile')
);

// --- PROTECTED PROFILE ROUTE ---
router.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ success: true, user: req.user });
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
});

// --- LOGOUT ROUTE ---
// Modern practice: Handle errors directly instead of using next()
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      const message = err instanceof Error ? err.message : 'Error logging out';
      return res.status(500).json({ success: false, message });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

module.exports = router;
