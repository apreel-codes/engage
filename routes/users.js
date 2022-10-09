const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
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

router.route('/profile')
    .get(isLoggedIn, catchAsync(users.showMyProfile));

router.route('/profile/:id')
    .get(isLoggedIn, catchAsync(users.showUserProfile));

router.route('/profile/:id')
    .put(isLoggedIn, upload.single('profile'), catchAsync(users.updatedProfile));

router.get('/:id/edit', isLoggedIn, catchAsync(users.renderEditProfile));
    

router.get('/logout', users.logOut);

module.exports = router;