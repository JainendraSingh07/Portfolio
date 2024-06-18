const User = require('../models/user');

module.exports.profile = async function(req, res) {
    try {
        if (req.cookies.user_id) {
            // Find the user by ID using async/await
            const user = await User.findById(req.cookies.user_id);
            if (user) {
                return res.render('user_profile', {
                    title: "User Profile",
                    user: user
                });
            }
        }
    } catch (err) {
        console.log('Error in finding user:', err);
        return res.redirect('/message/user/sign-in');
    }
};

module.exports.signUp = function(req, res) {
    return res.render('user_sign_up', {
        title: "WebAL | Sign Up"
    });
}

module.exports.signIn = function(req, res) {
    return res.render('user_sign_in', {
        title: "WebAL | Sign In"
    });
}

module.exports.create = async function(req, res) {
    try {
        console.log('Request Body:', req.body);

        if (req.body.password !== req.body.confirm_password) {
            return res.redirect('back');
        }

        let user = await User.findOne({ email: req.body.email });

        if (!user) {
            await User.create({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email
            });
            return res.redirect('/message/user/sign-in');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error in creating user while signing up:', err);
        return res.redirect('back');
    }
}

// sign in and create a session for the user
module.exports.createSession = async function(req, res) {
    try {
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            if (user.password !== req.body.password) {
                return res.redirect('back');
            }

            res.cookie('user_id', user.id);
            return res.redirect('/message/user/profile');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error in finding user in signing in:', err);
        return res.redirect('back');
    }
};
