const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('../controller/user_controller');
const usersController_contact = require('../controller/user_controller_contact');


router.get('/profile', passport.checkAuthentication, usersController.profile);
router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);
router.post('/create', usersController.create);
router.post('/create-contact', usersController_contact.contact);

// Use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    { failureRedirect: '/message/user/sign-in' }
), usersController.createSession);

module.exports = router;
