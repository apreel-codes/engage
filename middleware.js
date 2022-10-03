const { postSchema, commentSchema, replySchema } = require('./JoiValidator.js');
const ExpressError = require('./utils/ExpressError');
const Post = require('./models/post');
const Comment = require('./models/comment');
const Reply = require('./models/reply');


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        // console.log('You must be logged in');
        return res.redirect('/login');
    }
    next();
}

// module.exports.validatePost = (req, res, next) => {
//     const { error } = postSchema.validate(req.body); //we're destructuring to get error from the req.body, if available
//     if(error) { //so if there's an actually error
//         const msg = error.details.map(el => el.message).join(',') //so we're mapping over the array of object error.details returns so it gets turned into a string and then using comma to join them if more than one word
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }

// module.exports.validateComment = (req, res, next) => {
//     const { error } = commentSchema.validate(req.body);
//     if(error){
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400) 
//     } else {
//         next();
//     }
// }

// module.exports.validateReply = (req, res, next) => {
//     const { error } = replySchema.validate(req.body);
//     if(error){
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400) 
//     } else {
//         next();
//     }
// }

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post.user.equals(req.user._id)) {
        // req.flash('error', 'You do not have the permission to do that!');
        return res.redirect(`/posts/${id}`);
    }
    next();
}

module.exports.isCommentOwner = async(req, res, next) => {
    const { id, commentId } = req.params;
    const post = await Post.findById(id);
    const comment = await Comment.findById(commentId);
    if (!comment.user.equals(req.user._id)){
        // req.flash('error', 'You do not have the permission to do that!');
        return res.redirect(`/posts/${id}`);
    }
    next();
}

module.exports.isReplyOwner = async(req, res, next) => {
    const { id, commentId, replyId } = req.params;
    const post = await Post.findById(id);
    const comment = await Comment.findById(commentId);
    const reply = await Reply.findById(replyId);
    if (!reply.user.equals(req.user._id)){
        // req.flash('error', 'You do not have the permission to do that!');
        return res.redirect(`/posts/${id}`);
    }
    next();
}
