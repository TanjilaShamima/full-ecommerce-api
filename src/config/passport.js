/**
 * Passport configuration for Google OAuth2 authentication
 * @file passport.js
 */


const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const appConfig = require("./constant");
const User = require("../models/userModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: appConfig.google.clientID,
      clientSecret: appConfig.google.clientSecret,
      callbackURL: appConfig.google.callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }
        const newUser = await User.create({
          fullName: profile.name.givenName + " " + profile.name.familyName,
          username: profile.displayName.replace(/\s/g, '').substring(0, 15),
          email: profile.emails[0].value,
          googleId: profile.id,
          images: profile.photos[0].value,
          verified: true,
        });
        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;