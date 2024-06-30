const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailer/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');

module.exports.create = async function(req, res) {
    try {
        let post = await Post.findById(req.body.post);

        if (!post) {
            return res.status(404).send('Post not found');
        }

        let comment = await Comment.create({
            content: req.body.content,
            post: req.body.post,
            user: req.user._id
        });

        post.comments.push(comment);
        await post.save();

        // Populate user info
        comment = await comment.populate('user', 'username email');

        // Create job for sending emails (ensure queue is correctly set up)
        let job = queue.create('emails', comment).save(function(err) {
            if (err) {
                console.log('Error in sending to the queue', err);
                return;
            }
            console.log('job enqueued', job.id);
        });

        if (req.xhr) {
            return res.status(200).json({
                data: {
                    comment: comment
                },
                message: "Comment created!"
            });
        }

        req.flash('success', 'Comment added!');
        return res.redirect('back');
    } catch (err) {
        console.error('Error creating comment:', err);
        req.flash('error', 'Error creating comment!');
        return res.status(500).send('Internal Server Error');
    }
};


module.exports.destroy = async function(req, res) {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).send('Comment not found');
        }

        // Debugging logs to ensure correct user check
        // console.log('Current User ID:', req.user._id);
        // console.log('Comment User ID:', comment.user);

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).send('Unauthorized');
        }

        const postId = comment.post;
        await Comment.deleteOne({ _id: req.params.id });
        await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });

        await Like.deleteMany({ likeable: comment._id, onModel: 'Comment' });

        if (req.xhr) {
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
        req.flash('error', 'Error deleting comment!');
        return res.status(500).send('Internal Server Error');
    }
};
