const { hotelSchema, reviewSchema } = require('../schema');
const ExpErr = require('../utilities/ExpErr');
const flash = require('connect-flash');
const review = require('../models/reviews');
const hotel = require('../models/hotel');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You are not Signed in.')
        return res.redirect('/login');
    }
    next();
}



module.exports.validateHotel = (req, res, next) => {

    const { error } = hotelSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpErr(msg, 400);
    }
    else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpErr(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isOwner = async (req, res, next) => {
    const Hotel = await hotel.findById(req.params.id);
    if (!Hotel.owner.equals(req.user._id)) {
        req.flash('error', 'Permission Denied!');
        res.redirect(`/hotels/${Hotel._id}`);
    }
    else next();
}

module.exports.isAuther = async (req, res, next) => {
    const { id, revid } = req.params;
    const Review = await review.findById(revid);
    if (!Review.author.equals(req.user._id)) {
        req.flash('error', 'Permission denied');
        res.redirect(`/hotels/${id}`);
    }
    else next();
}


module.exports.UpdateRating = async (req, res, next) => {
    const { id } = req.params;
    const fhotel = await hotel.findById(id).populate('reviews');
    var count = 0;
    var sum = 0;
    for (let review of fhotel.reviews) {
        sum += parseInt(review.rating);
        count += 1;
    }
    sum += parseInt(req.body.review.rating);
    count += 1;
    fhotel.OArating = parseInt(sum / count);
    fhotel.save();
    next();
}