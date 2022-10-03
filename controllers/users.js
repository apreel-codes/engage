const User = require('../models/user');



//register a new user
module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

//create a new user
module.exports.createNewUser =  async(req, res, next) => {
    try{
        const { firstname, lastname, username, email, password } = req.body;
        const user = new User({firstname, lastname, username, email });
        user.profile.url = req.file.path;
        user.profile.filename = req.file.filename;
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
          if(err) return next(err);
          res.redirect('/posts');
    })
    } catch (e) {
        // req.flash('error', e.message);
        req.flash('error', 'Username/email already exists.');
        res.redirect('/register');
    }
}


//login
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}

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