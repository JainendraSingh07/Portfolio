const express = require('express');
const path = require('path');
const port = 5503;
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT =  require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy.js');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const customWare = require('./config/middleware.js');
const Contact = require('./models/contact');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('assets'));
app.use(cookieParser());

// Setting up the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname + '/uploads')));

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
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customWare.setflash);

// Define the route to handle the root URL
app.get('/', function (req, res) {
    return res.render('index', { title: "Jainendra Singh" });
});

app.use('/', require('./routes/index.js')); // Routes should be added after middleware

app.get('/contact', async function(req, res){
    try {
        const contacts = await Contact.find({});
        return res.render('contact', {
            title: "Contact List",
            contact_list: contacts
        });
    } catch (err) {
        console.log("Error in fetching contacts from db:", err);
        return res.status(500).send("Internal Server Error");
    }
});


app.post('/create-contact', async function(req, res){
    try {
        const newContact = await Contact.create({
            name: req.body.name,
            phone: req.body.phone
        });
        console.log('New Contact:', newContact);
        return res.redirect('back');
    } catch (err) {
        console.log('Error in creating a contact:', err);
        return res.status(500).send("Internal Server Error");
    }
});

app.listen(port, function (err) {
    if (err) {
        console.log('Error in running the server:', err);
    }
    console.log('Yup! My express server is running on port:', port);
});

app.get('/delete-contact/:id', async function(req, res){
    try {
        let contactId = req.params.id;
        await Contact.findByIdAndDelete(contactId);
        return res.redirect('back');
    } catch (err) {
        console.log('Error in deleting contact:', err);
        return res.status(500).send("Internal Server Error");
    }
});
