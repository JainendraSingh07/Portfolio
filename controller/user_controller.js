const User = require('../models/user');
const fs = require('fs');
const path = require('path');

// Display user profile
module.exports.profile = async function(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            console.log('User not found');
            return res.redirect('back');
        }
        return res.render('webal/user_profile', {
            title: "User Profile",
            profile_user: user,
            user: req.user
        });
    } catch (err) {
        console.log('Error in finding user:', err);
        return res.redirect('/message/user/sign-in');
    }
};

// Update user profile
module.exports.update = async function(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('back');
        }
        User.uploadAvatar(req, res, function(err) {
            if (err) {
                console.log('******Multer Error: ', err);
                req.flash('error', err.message);
                return res.redirect('back');
            }
            user.name = req.body.name;
            user.email = req.body.email;

            if (req.file) {
                if(user.avatar){
                    fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                }
                // This is saving the path of the uploaded file into the avatar field in the user
                user.avatar = User.avatarPath + '/' + req.file.filename;
            }
            user.save();
            return res.redirect('back');
        });
    } catch (err) {
        console.log('Error in updating user:', err);
        req.flash('error', err.message);
        return res.redirect('back');
    }
};

// Render sign up page
module.exports.signUp = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/message/user/profile');
    }
    return res.render('webal/user_sign_up', {
        title: "WebAL | Sign Up"
    });
};

// Render sign in page
module.exports.signIn = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/message/user/profile');
    }
    return res.render('webal/user_sign_in', {
        title: "WebAL | Sign In"
    });
};

// Create a new user
module.exports.create = async function(req, res) {
    try {
        console.log('Request Body:', req.body);

        if (req.body.password !== req.body.confirm_password) {
            req.flash('error', 'Passwords do not match');
            return res.redirect('back');
        }

        let user = await User.findOne({ email: req.body.email });

        if (!user) {
            await User.create({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            });
            req.flash('success', 'User created successfully');
            return res.redirect('/message/user/sign-in');
        } else {
            req.flash('error', 'User already exists');
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error in creating user while signing up:', err);
        req.flash('error', 'Error in creating user');
        return res.redirect('back');
    }
};

// Sign in and create a session for the user
module.exports.createSession = function(req, res) {
    req.flash('success', 'Logged in successfully');
    return res.redirect('/message');
};

// Sign out and destroy session
module.exports.destroySession = function(req, res) {
    req.logout(function(err) {
        if (err) {
            console.error('Logout Error:', err);
            req.flash('error', 'Error in logging out');
            return res.status(500).send('Failed to logout');
        }
        req.flash('success', 'You have logged out');
        return res.redirect('/message');
    });
};
