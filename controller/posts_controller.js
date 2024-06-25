const Post = require('../models/post');

module.exports.create = async function(req, res) {
    try {
        const post = await Post.create({
            content: req.body.content,
            // Add other necessary fields here
        });
        // res.send('Post created successfully!');
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).send('Internal Server Error');
    }
};
