const {Schema} = require('mongoose');
const mongoose = require('mongoose');

const CharactersticsReviews = new Schema ({
  id: Number, 
  characteristic_id: Number, 
  review_id: Number, 
  value: Number
});

const Characterstics = new Schema ({
  id: Number, 
  product_id: Number, 
  name: Number,
  characteristics_reviews: [
    CharactersticsReviews
  ]
});

const MasterReviewSchema = new Schema({
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
  ],
  characteristics: [
   {
    id: Number, 
    characteristic_id: Number, 
    review_id: Number, 
    value: Number,
    name: String,
   }
  ] 
});

const MasterReview = mongoose.model('masterreview', MasterReviewSchema);

module.exports = MasterReview;