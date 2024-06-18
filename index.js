const express = require('express');
const path = require('path');
const port = 4000;  // Change to a different port number
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('assets'));
app.use(cookieParser());

// Setting up a template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    name: 'WebAL',
    secret: 'blah something',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));

app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.setAuthenticatedUser);

// Define the route to handle the root URL
app.get('/', function (req, res) {
    return res.render('index', { title: "Jainendra Singh" });
});

app.use('/', require('./routes/index.js')); // Routes should be added after middleware

app.listen(port, function (err) {
    if (err) {
        console.log('Error in running the server:', err);
    }
    console.log('Yup! My express server is running on port:', port);
});
