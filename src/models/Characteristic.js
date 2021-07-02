const {Schema} = require('mongoose');
const mongoose = require('mongoose');


 const CharacteristicSchema = new Schema({
  id: Number, 
  product_id: Number, 
  name: String,
});

const Characteristic = mongoose.model('characteristic', CharacteristicSchema);

module.exports = Characteristic;

