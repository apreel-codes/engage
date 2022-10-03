const Post = require('../models/post');
const Comment = require('../models/comment');



//create a comment and gets submitted to this route
module.exports.createComment = async(req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    const comment = new Comment(req.body.comment);
    comment.user = req.user;
    post.comments.push(comment);
    await comment.save();
    await post.save();
    res.redirect(`/posts/${post._id}`);
}

//edit a comment
module.exports.renderEditComment = async(req, res, next) => {
    const { id, commentId } = req.params;
    const post = await Post.findById(id).populate('comments');
    const comment = await Comment.findById(commentId);
    res.render('comments/edit', { post, comment });
}

//submit edited comment
module.exports.updateComment = async(req, res, next) => {
    const { id, commentId } = req.params;
    const post = await Post.findById(id);
    const comment = await Comment.findByIdAndUpdate(commentId, req.body.comment);
    res.redirect(`/posts/${post._id}`);
}

//delete comment
module.exports.deleteComment = async(req, res, next) => {
    const { id, commentId } = req.params;
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', 'Comment deleted');
    res.redirect(`/posts/${id}`);
}
