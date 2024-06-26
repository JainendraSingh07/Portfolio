const Post = require('../models/post');

module.exports.home = async function(req, res) {
    try {
        // Find posts and populate the user and comments' user
        let posts = await Post.find({})
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
            })
            .exec();

        return res.render('webal/home', {
            title: "Codeial | Home",
            posts: posts
        });
    } catch (err) {
        console.error('Error fetching posts:', err);
        return res.status(500).send('Internal Server Error');
    }
};
