const User = require('../models/user');


module.exports.profile = async function(req, res) {
    try {
        return res.render('user_profile', {
            title: "User Profile",
            user: req.user
        });
    } catch (err) {
        console.log('Error in finding user:', err);
        return res.redirect('/message/user/sign-in');
    }
};

module.exports.signUp = function(req, res) {
    if(req.isAuthenticated()){
       return res.redirect('/message/user/profile');
    }
    return res.render('user_sign_up', {
        title: "WebAL | Sign Up"
    });
}

module.exports.signIn = function(req, res) {
    if(req.isAuthenticated()){
       return  res.redirect('/message/user/profile');
     }

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

// Sign in and create a session for the user
module.exports.createSession = function(req, res) {
    return res.redirect('/message/user/profile');
}
