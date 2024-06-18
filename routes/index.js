const express = require('express');

const router = express.Router();

const homeController = require('../controller/home_controller_webal');

console.log('router loader');

router.get('/message', homeController.home);
router.use('/message/user', require('./user'));
module.exports = router;