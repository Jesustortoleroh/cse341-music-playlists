import { PassportStatic } from 'passport';
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2';
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import * as userController from '../controllers/user';

export default (passport: PassportStatic) => {
  // --- GITHUB STRATEGY ---
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        callbackURL:
          process.env.NODE_ENV === 'production'
            ? 'https://cse341-music-playlists.onrender.com/auth/github/callback'
            : 'http://localhost:3000/auth/github/callback'
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: GitHubProfile,
        done: (error: any, user?: any) => void
      ) => {
        try {
          let email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

          if (!email) {
            const response = await fetch('https://api.github.com/user/emails', {
              headers: { Authorization: `token ${accessToken}` }
            });
            const emails: any = await response.json();
            const primaryEmail = emails.find((e: any) => e.primary);
            email = primaryEmail ? primaryEmail.email : `${profile.username}@github.com`;
          }

          const userData = {
            email: email as string,
            name: profile.displayName || profile.username || 'GitHub User'
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
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL:
          process.env.NODE_ENV === 'production'
            ? 'https://cse341-music-playlists.onrender.com/auth/google/callback'
            : 'http://localhost:3000/auth/google/callback'
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: GoogleProfile,
        done: (error: any, user?: any) => void
      ) => {
        try {
          const userData = {
            email: profile.emails![0].value,
            name: profile.displayName || profile.name?.givenName || 'Google User'
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
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session (retrieves user from DB on each request)
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await userController.getUserByIdForAuth(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
