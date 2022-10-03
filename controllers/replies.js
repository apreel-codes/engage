const Post = require('../models/post');
const Comment = require('../models/comment');
const Reply = require('../models/reply');


//create a reply per each comment and gets submitted to this route
module.exports.createReply = async(req, res, next) => {
    const { id, commentId } = req.params;
    const post = await Post.findById(id).populate('comments');
    const comment = await Comment.findById(commentId).populate('replies');
    const reply = new Reply(req.body.reply);
    reply.user = req.user;
    comment.replies.push(reply);
    await reply.save();
    await comment.save();
    await post.save();
    res.redirect(`/posts/${post._id}`);
}

//edit a reply
module.exports.renderEditReply = async(req, res, next) => {
    const { id, commentId, replyId } = req.params;
    const post = await Post.findById(id).populate('comments');
    const comment = await Comment.findById(commentId).populate('replies');
    const reply = await Reply.findById(replyId);
    res.render('replies/edit', { post, comment, reply});
}


//submit edited reply
module.exports.updateReply = async(req, res, next) => {
    const { id, commentId, replyId } = req.params;
    const post = await Post.findById(id);
    const comment = await Comment.findById(commentId);
    const reply = await Reply.findByIdAndUpdate(replyId, req.body.reply);
    res.redirect(`/posts/${post._id}`);
}

//delete reply
module.exports.deleteReply = async(req, res, next) => {
    const { id, commentId, replyId } = req.params;
    await Comment.findByIdAndUpdate(commentId, { $pull: { replies: replyId } });
    await Reply.findByIdAndDelete(replyId);
    req.flash('success', 'Reply deleted');
    res.redirect(`/posts/${id}`);
}