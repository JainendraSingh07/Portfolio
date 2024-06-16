const express = require('express');
const path = require('path');
const port = 8000;
const db = require('./config/mongoose');
const Contact = require('./models/contact');
const app = express();
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

const cookieParser = require('cookie-parser');

app.use('/',require('./routes/user.js'));
//setting up a template engine

app.set('view engine','ejs');
app.set('views',path.join(__dirname , 'views'));
app.use(session({
    name : 'contact',
    //to do
    secret : 'blah something',
    saveUninitialized : false,
    resave : false,
    cookie :{
        maxAge : (1000 * 60 * 100)
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(express.urlencoded());
app.use(express.static('assets'));
//app.use(express.urlencoded());
app.use(cookieParser());



var contactList = [
    {
        name : "Jainendra Singh",
        phone : "9696864385"
    },
    {
        name : "Rekha Singh",
        phone : "8299816670"
    }
    
]

app.get('/', function (req, res) {
    Contact.find({})
        .then(contacts => {
            return res.render('index', {
                title: "contact list",
                contact_list: contacts
            });
        })
        .catch(err => {
            console.log('Error in fetching contacts from db:', err);
            return res.status(500).send('Internal Server Error');
        });
});


app.get('/contact',function(req , res){
    // console.log(req);
    return res.render('contact',{title : "Contact List" , contact_list : contactList});
});

app.post('/create-contact', function(req, res){
    
    //contactList.push(req.body);
    //return res.redirect('back');
    
    Contact.create({
        name: req.body.name,
        phone: req.body.phone
    })
    .then(newContact => {
        console.log('******', newContact);
    
        // Assuming contactList is an array where you store contacts.
        contactList.push(newContact);
    
        // Now, redirect to a route that renders the contact list.
        return  res.redirect('back');
    })
    .catch(err => {
        console.log('Error in creating a contact:', err);
        // Handle the error appropriately, e.g., return an error response to the client
    });
    
    // Contact.create({
    //     name: req.body.name,
    //     phone: req.body.phone
    // }, function(err, newContact){
    //     if (err){
    //         console.log('Error in creating a contact!');
    //         return;
    //     }
    //         console.log('******', newContact);
    //         return res.redirect('back');
    
    // });
});



app.get('/delete-contact', function (req, res) {
    let id = req.query.id;

    let contactIndex = contactList.findIndex(contact => contact.phone == phone);

    if(contactIndex != -1){
        contactList.splice(contactIndex , 1);
    }

    return res.redirect('back');
});

app.get('/chat',function(req , res){
    // console.log(req);
    return res.render('user_profile',{title : "Profile" , contact_list : contactList});
});





// setting up express server

app.listen(port , function(err){
    if(err){
        console.log('error in running the server',err);
    }
    console.log('yup ! my express server is running on port :',port);
});