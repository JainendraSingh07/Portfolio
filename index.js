const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const path = require('path');
const port = 5503;
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const customWare = require('./config/middleware');
const sassMiddleware = require('node-sass-middleware');
const Contact = require('./models/contact');
const http = require('http');
const cors = require('cors');

const app = express();
require('./config/view-helpers')(app);
const chatServer = http.createServer(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);

if (env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    }));
}


// Middleware to parse cookies
app.use(cookieParser());

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5503',
    credentials: true
}));

// Serve static files from the 'assets' directory
app.use(express.static(path.join(__dirname, env.asset_path )));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));
// Setting up the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Use express-ejs-layouts
app.use(expressLayouts);

// Set layout options
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Session configuration
const sessionMiddleware = session({
    name: 'WebAL',
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/contact_list_db',
        autoRemove: 'disabled'
    })
});
app.use(sessionMiddleware);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// Flash messages middleware
app.use(flash());
app.use(customWare.setflash);

// Define the route to handle the root URL
app.get('/', function (req, res) {
    return res.render('index', { title: "Jainendra Singh" });
});

// Use routes
app.use('/', require('./routes/index.js'));

// Route for fetching contacts
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

// Route for creating a new contact
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

// Route for deleting a contact
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

// Starting the Express server
app.listen(port, function (err) {
    if (err) {
        console.log('Error in running the server:', err);
    }
    console.log('Server is running on port:', port);
});

// Chat server setup
chatServer.listen(5000, () => {
    console.log('Chat server is listening on port 5000');
});
