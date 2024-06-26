const Post = require('../models/post');
const Comment = require('../models/comment');

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

module.exports.destroy = async function(req, res) {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).send('Post not found');
        }
        
        if (post.user.toString() !== req.user.id) {
            return res.status(403).send('Unauthorized');
        }
        
        await Post.deleteOne({ _id: req.params.id });
        await Comment.deleteMany({ post: req.params.id });
        
        return res.redirect('back');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error');
    }
};
