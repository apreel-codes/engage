const Post = require('../models/post');
const Comment = require('../models/comment');
const { cloudinary } = require('../cloudinary');
const Reply = require('../models/reply');
const User = require('../models/user');


//show all posts
module.exports.index = async(req, res, next) => {
    const allPosts = await Post.find({}).populate('user');
    res.render('posts/index', { allPosts });
}

//new post created gets submitted here
module.exports.createNewPost = async(req, res, next) => {
    const { id } = req.user;
    const user = await User.findById(id);
    const newPost = new Post(req.body);
    newPost.user = req.user;
    newPost.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    user.posts.push(newPost);
    await newPost.save();
    await user.save();
    res.redirect('/posts')
}

// show one post
module.exports.showPost = async(req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id)
    .populate(
        { path: 'comments', 
        populate: ( { path: 'replies' } )} )
    .populate('user');
    const allComments = await Comment.find({}).populate('replies');
    res.render('posts/show', { post, allComments });
};

//edit a post
module.exports.renderEditPost = async(req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id)
    res.render('posts/edit', { post });
};

//submitting the edited post
module.exports.updatePost = async(req, res, next) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, { ...req.body.post } );
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    post.images.push(...imgs);
    await post.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await post.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}});
    }
    req.flash('success', 'Post updated');
    res.redirect(`/posts/${post._id}`);
};

//delete post
module.exports.deletePost = async(req, res, next) => {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    req.flash('success', 'Post deleted');
    res.redirect('/posts');
};