const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const posts = require('../controllers/posts');
const { isLoggedIn, isOwner } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(posts.index))
    .post(isLoggedIn, upload.array('image'), catchAsync(posts.createNewPost));

router.route('/:id')
    .get(isLoggedIn, catchAsync(posts.showPost))
    .put(isLoggedIn, isOwner, upload.array('image'), catchAsync(posts.updatePost))
    .delete(isLoggedIn, isOwner, catchAsync(posts.deletePost));

router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(posts.renderEditPost));


module.exports = router;