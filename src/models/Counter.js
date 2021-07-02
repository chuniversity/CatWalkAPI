const {Schema} = require('mongoose');
const mongoose = require('mongoose');

const countersSchema = new Schema({
    _id: String,
    review_id: Number,
    photo_id: Number,
});

const Counter = mongoose.model('counter', countersSchema);
module.exports = Counter;