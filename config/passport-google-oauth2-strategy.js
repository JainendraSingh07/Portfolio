require('dotenv').config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');




// tell passport to use a new strategy for google login
passport.use(new GoogleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_call_back_url
},
async function (accessToken, refreshToken, profile, done) {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        console.log(accessToken, refreshToken);
        if (user) {
            // if found, set this user as req.user
            return done(null, user);
        } else {
            // if not found, create the user and set it as req.user
            user = await User.create({
                username: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            });

            return done(null, user);
        }
    } catch (err) {
        console.log('error in google strategy-passport', err);
        return done(err);
    }
}
));

module.exports = passport;
