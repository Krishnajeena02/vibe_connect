import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log("Profile from Google:", profile);

        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
        
          user = await User.create({
            googleId: profile.id,
            name:profile.displayName,
            username: profile.displayName,
            email: profile.emails[0].value,
          profileImage: profile.photos?.[0]?.value || "/uploads/default.jpg" // ✅ fallback here
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
