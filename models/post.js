const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment');
const User = require('./user');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200/h_200');
})

// const opts = { toJSON: { virtuals: true } };

const postSchema = new Schema({
    content: String,
    images: [ImageSchema],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        },
    ],
    user: { 
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

postSchema.post('findOneAndDelete', async function(post){
    //if post was found and deleted
    if(post){
       await Comment.deleteMany({   //then remove all the comments present inside the post i just deleted
          _id: {
             $in: post.comments
          }
       })
    }
 })

module.exports = mongoose.model('Post', postSchema);