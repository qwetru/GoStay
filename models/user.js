const mongoose = require('mongoose');
const PLM = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

userSchema.plugin(PLM);

module.exports = mongoose.model('user', userSchema);