const express = require('express');
const path = require('path');
const port = 5502;  // Change to a different port number
const db = require('./config/mongoose');
const Contact = require('./models/contact');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const expressLayouts = require('express-ejs-layouts');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('assets'));
app.use(cookieParser());

// Setting up the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts
app.use(expressLayouts);

// Set layout options
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(session({
    name: 'WebAL',
    secret: 'blah something',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/contact_list_db',
        autoRemove: 'disabled'
    })
}));

app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.setAuthenticatedUser);

var contactList = [
    {
        name: "Arpan",
        phone: "1111111111"
    },
    {
        name: "Tony Stark",
        phone: "1234567890"
    },
    {
        name: "Coding Ninjas",
        phone: "12131321321"
    }
];

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
