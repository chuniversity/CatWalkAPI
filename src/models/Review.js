const {Schema} = require('mongoose');
const mongoose = require('mongoose');

const ReviewSchema = new Schema({
  id: Number,
  product_id: Number, 
  rating: Number, 
  date: Number, 
  summary: String, 
  body: String, 
  recommend: Boolean, 
  reported: Boolean, 
  reviewer_name: String, 
  reviewer_email: String, 
  response: String, 
  helpfulness: Number, 
  photos: [
    {
      id: Number, 
      review_id: Number, 
      url: String, 
    }
  ]
});

const Review = mongoose.model('review', ReviewSchema)

module.exports = Review;