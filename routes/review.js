const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utilities/catchAsync')
const ExpErr = require('../utilities/ExpErr');
const review = require('../models/reviews');
const hotel = require('../models/hotel');
const ctrlReview = require('../controllers/reviews');
const { validateReview, isAuther, isLoggedIn, UpdateRating } = require('../utilities/middleware');




router.post('/', isLoggedIn, validateReview, UpdateRating, catchAsync(ctrlReview.postReview))

router.delete('/:revid', isLoggedIn, isAuther, catchAsync(ctrlReview.deleteReview))

module.exports = router;