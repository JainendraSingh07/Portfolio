require('dotenv').config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const crypto = require('crypto');
const User = require('../models/user');




// tell passport to use a new strategy for google login
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5503/message/user/auth/google/callback"
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
