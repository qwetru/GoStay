const mongoose = require('mongoose');
const reviews = require('./reviews');
const { findByIdAndDelete } = require('./reviews');
const schema = mongoose.Schema;
// const reviews = require('reviews');

const imageSchema = new schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const opt = { toJSON: { virtuals: true } };

const hotelSchema = new schema({
    title: String,
    description: String,
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    location: String,
    images: [imageSchema],
    reviews: [{
        type: schema.Types.ObjectId,
        ref: 'reviews'
    }],
    OArating: Number,
    owner: {
        type: schema.Types.ObjectId,
        ref: 'user'
    }

}, opt);

hotelSchema.virtual('properties.popUpText').get(function () {
    return `<link rel="stylesheet" href="/stylesheets/starRating.css">
    <div><h2><a href='/hotels/${this._id}'>${this.title}</a></h2>
    <p class="starability-result" data-rating="${this.OArating}"> Rated:  ${this.OArating} 
                                stars
                        </p></div>
                        `;
})

hotelSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await reviews.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('hotel', hotelSchema);