const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

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
        req.flash('success' , 'Post Published !');

        return res.redirect('back');
    } catch (err) {
        req.flash('error' , err);

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

        await Like.deleteMany({ likeable: post._id, onModel: 'Post' });
        await Like.deleteMany({ _id: { $in: post.comments } });

        await Post.deleteOne({ _id: req.params.id });  // Use deleteOne to delete the post

        await Comment.deleteMany({ post: req.params.id });

        if (req.xhr) {
            return res.status(200).json({
                data: {
                    post_id: req.params.id
                },
                message: "Post deleted"
            });
        }

        req.flash('success', 'Post and associated comments deleted!');
        return res.redirect('back');
    } catch (err) {
        console.error('Error deleting post:', err);
        return res.status(500).send('Internal Server Error');
    }
};
