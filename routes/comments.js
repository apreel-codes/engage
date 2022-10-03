const express = require('express');
const router = express.Router({mergeParams: true}); //'mergeParams: true' because the review is being passed to a certain id of a campground, this will merge all the params needed inside any reviews route. with this we'll have access to the campground id in a review route
const catchAsync = require('../utils/catchAsync');
const comments = require('../controllers/comments');
const { isLoggedIn, isCommentOwner } = require('../middleware');

router.post('/', catchAsync(comments.createComment));

router.route('/:commentId')
    .put(isCommentOwner, catchAsync(comments.updateComment))
    .delete(isCommentOwner, catchAsync(comments.deleteComment));

router.get('/:commentId/edit', isCommentOwner, catchAsync(comments.renderEditComment));

module.exports = router;