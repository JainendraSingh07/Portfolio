const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res){
    try {
        // Find posts and populate user and comments' user
        let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
            });

        // Find all users
        let users = await User.find({});

        // Render the home view with posts and users
        return res.render('webal/home', {
            title: "WebAL | Home",
            posts: posts,
            all_users: users
        });
    } catch (err) {
        console.log('Error:', err);
        return res.redirect('back');
    }
}
