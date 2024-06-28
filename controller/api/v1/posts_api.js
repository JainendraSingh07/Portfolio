const Post = require('../../../models/post');
const Comment = require('../../../models/comment');


module.exports.index = async function(req, res){

    let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
            });

    return res.json(200, {
        message: "List of posts",
        posts: posts
    })
}

module.exports.destroy = async function(req, res) {
    try {
        // Find the post by ID
        let post = await Post.findById(req.params.id);

        // Check if the post exists and if the user is authorized to delete it
        if (!post) {
            return res.status(404).json({
                message: "Post not found!"
            });
        }

        if (post.user == req.user.id) {
            // Remove the post
            await post.remove();

            // Delete associated comments
            await Comment.deleteMany({ post: req.params.id });

            return res.status(200).json({
                message: "Post and associated comments deleted successfully!"
            });
        } else {
            return res.status(401).json({
                message: "You cannot delete this post!"
            });
        }
    } catch (err) {
        console.log('********', err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
