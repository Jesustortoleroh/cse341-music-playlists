import { PassportStatic } from 'passport';
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2';
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
  GoogleCallbackParameters
} from 'passport-google-oauth20';
import { Request } from 'express';
import * as userController from '../controllers/user';
import { IUser } from '../models/User';

// Match Passport's verify callback signature for this project.
// The user argument is not `null` on a successful/failed auth callback.
type VerifyCallback = (error: Error | null, user?: IUser | false) => void;

// Define the structure of the GitHub email response
interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

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
            : 'http://localhost:3000/auth/github/callback',
        passReqToCallback: false
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: GitHubProfile,
        done: VerifyCallback
      ) => {
        try {
          let email = profile.emails?.[0]?.value ?? null;

          if (!email) {
            const response = await fetch('https://api.github.com/user/emails', {
              headers: { Authorization: `token ${accessToken}` }
            });
            const emails = (await response.json()) as GitHubEmail[];
            const primaryEmail = emails.find((e) => e.primary);
            email = primaryEmail?.email ?? `${profile.username}@github.com`;
          }

          const userData = {
            email: email,
            name: profile.displayName ?? profile.username ?? 'GitHub User'
          };

          const user = await userController.findOrCreateOAuthUser(userData, 'github');
          return done(null, user as IUser);
        } catch (err: unknown) {
          return done(err instanceof Error ? err : new Error('OAuth error'));
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
            : 'http://localhost:3000/auth/google/callback',
        passReqToCallback: true
      },
      async (
        req: Request,
        accessToken: string,
        refreshToken: string,
        params: GoogleCallbackParameters,
        profile: GoogleProfile,
        done: VerifyCallback
      ) => {
        try {
          const userData = {
            email: profile.emails![0].value,
            name: profile.displayName ?? profile.name?.givenName ?? 'Google User'
          };

          const user = await userController.findOrCreateOAuthUser(userData, 'google');
          return done(null, user as IUser);
        } catch (err: unknown) {
          return done(err instanceof Error ? err : new Error('OAuth error'));
        }
      }
    )
  );

  // --- SESSION MANAGEMENT ---
  // Serialize user to store in session (saves user ID in the cookie)
  passport.serializeUser((user: any, done: (err: Error | null, id?: string) => void) => {
    const sessionUser = user as IUser & {
      _id?: string | { toString(): string };
      id?: string;
    };

    const userId = sessionUser._id ?? sessionUser.id;
    done(null, userId ? userId.toString() : undefined);
  });

  // Deserialize user from session (retrieves user from DB on each request)
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await userController.getUserByIdForAuth(id);
      done(null, user);
    } catch (err: unknown) {
      done(err instanceof Error ? err : new Error('Deserialization error'));
    }
  });
};
