const mongoose = require('mongoose');
const schema = mongoose.Schema;

const revSchema = new mongoose.Schema({
    body: String,
    rating: Number,
    author: {
        type: schema.Types.ObjectId,
        ref: 'user'
    }
});

module.exports = mongoose.model('reviews', revSchema);