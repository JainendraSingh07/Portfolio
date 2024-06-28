const express = require('express');
const router = express.Router();
const homeController = require('../controller/home_controller_webal');
// const userControllerContact = require('../controller/user_controller_contact');

router.get('/message', homeController.home);
// router.get('/contact', userControllerContact.contact); // Corrected handler reference

router.use('/message/user', require('./user'));
router.use('/message/posts', require('./posts'));
router.use('/message/comments', require('./comments'));

router.use('/message/likes', require('./likes'));

router.use('/message/api', require('./api'));

module.exports = router;
