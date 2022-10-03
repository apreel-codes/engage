const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// const profileSchema = new Schema({
//     url: String,
//     filename: String
// });

const UserSchema = new Schema({
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
    }
});


UserSchema.plugin(passportLocalMongoose, { usernameQueryFields: ["email"] });

module.exports = mongoose.model('User', UserSchema);