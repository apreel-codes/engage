const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/register')
    .get(users.renderRegisterForm)
    .post(upload.single('profile'), catchAsync(users.createNewUser));

router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.logIn);


router.get('/logout', users.logOut);

module.exports = router;