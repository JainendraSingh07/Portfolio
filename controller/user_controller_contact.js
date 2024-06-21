const Contact = require('../models/contact');

module.exports.contact = function(req, res, next) {
    Contact.find({})
        .then(contacts => {
            res.render('contact', { title: 'Contact List', contact_list: contacts });
        })
        .catch(err => {
            console.error('Error fetching contacts:', err);
            next(err); // Pass error to Express error handler
        });
};
