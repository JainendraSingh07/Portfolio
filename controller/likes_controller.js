const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require('../models/comment');

module.exports.toggleLike = async function(req, res) {
    try {
        let likeable;
        let deleted = false;

        // Determine whether to fetch a Post or Comment based on req.query.type
        if (req.query.type === 'Post') {
            likeable = await Post.findById(req.query.id).populate('likes');
        } else {
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        if (!likeable) {
            return res.status(404).json({
                message: "Likeable object not found"
            });
        }

        // Check if a like already exists for the user
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });

        // If a like already exists, delete it; otherwise, create a new like
        if (existingLike) {
            likeable.likes.pull(existingLike._id);
            await likeable.save();

            await existingLike.deleteOne(); // Use deleteOne instead of remove
            deleted = true;
        } else {
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id);
            await likeable.save();
        }

        return res.status(200).json({
            message: "Request successful!",
            data: {
                deleted: deleted
            }
        });

    } catch (err) {
        console.error("Error toggling like:", err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};
