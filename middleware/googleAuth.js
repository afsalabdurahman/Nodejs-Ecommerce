const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
let User_schema=require('../model/userModel')
// In-memory user store

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
done(null,user)
});

const GOOGLE_CLIENT_ID = '926246450984-ng37e2qctm15gf5pefk2s5cf0h9r7oc4.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback:true
  },
  function(request,accessToken, refreshToken, profile, done) {
  return done(null,profile);
  }
));
