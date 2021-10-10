const review = require('../models/reviews');
const hotel = require('../models/hotel');


module.exports.postReview = async (req, res) => {
    const { id } = req.params;
    const fhotel = await hotel.findById(req.params.id);
    const nreview = new review(req.body.review);
    nreview.author = req.user._id;
    fhotel.reviews.push(nreview);
    fhotel.save();
    nreview.save();
    req.flash('success', 'Review Posted!!')
    res.redirect(`/hotels/${fhotel._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, revid } = req.params;
    await hotel.findByIdAndUpdate(id, { $pull: { reviews: revid } });
    await review.findByIdAndDelete(revid);
    res.redirect(`/hotels/${id}`);
}