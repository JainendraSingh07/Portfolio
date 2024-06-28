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
        const post = await Post.findById(req.params.id);
        
        // if (!post) {
        //     return res.status(404).send('Post not found');
        // }
        
        // if (post.user.toString() !== req.user.id) {
        //     return res.status(403).send('Unauthorized');
        // }
        
        await Post.deleteOne({ _id: req.params.id });
        await Comment.deleteMany({ post: req.params.id });

        // req.flash('success' , 'Post and associated comments deleted');
        return res.json(200,{
            message: "post and associated comments deleted successfully !"
        
        });
    } catch (err) {
        console.log('*******', err);
        return res.json(500, {
            message: "Internal server error"
        });
    }
};
