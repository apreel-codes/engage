const express = require('express');
const router = express.Router({mergeParams: true}); //'mergeParams: true' because the review is being passed to a certain id of a campground, this will merge all the params needed inside any reviews route. with this we'll have access to the campground id in a review route
const catchAsync = require('../utils/catchAsync');
const replies  = require('../controllers/replies');
const { isLoggedIn, isReplyOwner } = require('../middleware');

router.post('/', catchAsync(replies.createReply));

router.route('/:replyId')
    .put(isReplyOwner, catchAsync(replies.updateReply))
    .delete(isReplyOwner, catchAsync(replies.deleteReply));

router.get('/:replyId/edit', isReplyOwner, catchAsync(replies.renderEditReply));

module.exports = router;