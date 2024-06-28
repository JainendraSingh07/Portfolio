const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailer/comments_mailer');

module.exports.create = async function(req, res) {
    try {
        let post = await Post.findById(req.body.post);

        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            await post.save();

            comment = await comment.populate('user', 'username email'); // Use populate directly

            commentsMailer.newComment(comment);

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment created!"
                });
            }

            return res.redirect('/message');
        } else {
            return res.status(404).send('Post not found');
        }
    } catch (err) {
        console.error('Error creating comment:', err);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports.destroy = async function(req, res) {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).send('Comment not found');
        }

        if (comment.user.toString() !== req.user.id) {
            return res.status(403).send('Unauthorized');
        }

        const postId = comment.post;
        await Comment.deleteOne({ _id: req.params.id });
        await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });

        if (req.xhr){
            return res.status(200).json({
                data: {
                    comment_id: req.params.id
                },
                message: "Comment deleted"
            });
        }
        req.flash('success', 'Comment deleted!');

        return res.redirect('back');
    } catch (err) {
        console.error('Error deleting comment:', err);
        return res.status(500).send('Server Error');
    }
};
