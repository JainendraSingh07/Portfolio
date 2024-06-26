const Post = require('../models/post');

module.exports.create = async function(req, res) {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id  // Assuming req.user contains the authenticated user
        });

        if (req.xhr) {
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }

        return res.redirect('back');
    } catch (err) {
        console.error('Error creating post:', err);

        return res.redirect('back');
    }
};
