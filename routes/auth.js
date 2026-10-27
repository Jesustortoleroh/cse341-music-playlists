const express = require('express');
const router = express.Router();
const passport = require('passport');

// --- GITHUB ROUTES ---
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => res.redirect('/auth/profile')
);

// --- GOOGLE ROUTES ---
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
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
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

module.exports = router;