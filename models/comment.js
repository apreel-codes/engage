const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Reply = require('./reply');
const User = require('./user');

const commentSchema = new Schema({
    body: String,
    replies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Reply'
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

commentSchema.post('findOneAndDelete', async function(comment){
    //if comment was found and deleted
    if(comment){
       await Reply.deleteMany({   //then remove all the replies present inside the comment i just deleted
          _id: {
             $in: comment.replies
          }
       })
    }
 })

module.exports =  mongoose.model('Comment', commentSchema);