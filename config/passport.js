const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userController = require('../controllers/user');

module.exports = (passport) => {
  // --- GITHUB STRATEGY ---
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL:
          process.env.NODE_ENV === 'production'
            ? 'https://cse341-music-playlists.onrender.com/auth/github/callback'
            : 'http://localhost:3000/auth/github/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Best practice: Use optional chaining to safely access nested properties
          let email = profile?.emails?.[0]?.value ?? null;

          // If email is not available (private GitHub email), fetch it via API
          if (!email) {
            const response = await fetch('https://api.github.com/user/emails', {
              headers: { Authorization: `token ${accessToken}` }
            });
            const emails = await response.json();
            // Use nullish coalescing for safe fallback
            const primaryEmail = emails.find((e) => e.primary);
            email = primaryEmail?.email ?? `${profile.username}@github.com`;
          }

          const userData = {
            email: email,
            name: profile.displayName ?? profile.username
          };

          // Use the controller function
          const user = await userController.findOrCreateOAuthUser(userData, 'github');
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  // --- GOOGLE STRATEGY ---
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.NODE_ENV === 'production'
            ? 'https://cse341-music-playlists.onrender.com/auth/google/callback'
            : 'http://localhost:3000/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Google always provides emails, but we use optional chaining for safety
          const userData = {
            email: profile?.emails?.[0]?.value,
            name: profile?.displayName ?? profile?.name?.givenName
          };

          const user = await userController.findOrCreateOAuthUser(userData, 'google');
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  // --- SESSION MANAGEMENT ---
  // Serialize user to store in session (saves user ID in the cookie)
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session (retrieves user from DB on each request)
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userController.getUserByIdForAuth(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
