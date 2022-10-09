const User = require('../models/user');
const Post = require('../models/post');



//register a new user
module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

//create a new user
module.exports.createNewUser =  async(req, res, next) => {
    try{
        const { firstname, lastname, username, email, password } = req.body;
        const user = new User({ firstname, lastname, username, email });
        user.profile.url = req.file.path;
        user.profile.filename = req.file.filename;
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
          if(err) return next(err);
          res.redirect('/posts');
    })
    } catch (e) {
        if(e.message === "Cannot read properties of undefined (reading 'path')"){
            req.flash('error', 'Kindly attach a profile picture');
        } else {
            req.flash('error', 'Existing username/email address');
        }
        res.redirect('/register');
    }
}



//show user profile
module.exports.showMyProfile = async(req, res) => {
    const { id } =  req.user;
    const user = await User.findById(id)
    .populate(
        {
            path: 'posts',
            populate: ( { path: 'images'} )
        }
    );
    res.render('users/profile', { user })
}

//show other user profile 
module.exports.showUserProfile = async(req, res) => {
    const { id } =  req.params;
    const user = await User.findById(id)
    .populate(
        {
            path: 'posts',
            populate: ( { path: 'images'} )
        }
    );
    res.render('users/userprofile', { user })
}

//edit profile
module.exports.renderEditProfile = async(req, res, next) => {
    const { id } =  req.user;
    const user = await User.findById(id);
    // console.log(user);
    res.render('users/edit', { user } );
}

//submit edited profile
module.exports.updatedProfile = async(req, res, next) => {
    const { id } =  req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body.user } );
    await user.save();
    req.flash('success', 'Profile updated');
    res.redirect('/profile');
}


//login
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}

    // res.send("Authenticate with google")

module.exports.logIn = (req, res) => {
    const returnTo = req.session.returnTo;
    const redirectUrl = returnTo || '/posts';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}


module.exports.logOut = (req, res, next) => {
    req.logout(function(err) {
        if(err) {
            return next(err);
        }
        res.redirect('/posts');
    })
}