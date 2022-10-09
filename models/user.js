const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const Post = require('./post');


const UserSchema = new Schema({
    googleId: {
        type: String
        // required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        // unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    profile:{
        url: String,
        filename: String
    },
    image: {
        type: String
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});


UserSchema.plugin(passportLocalMongoose, { usernameQueryFields: ["email"] });


UserSchema.post('findOneAndDelete', async function(user){
    if(user){
        await Post.deleteMany({
            _id: {
                $in: user.posts
            }
        })
    }
})
module.exports = mongoose.model('User', UserSchema);