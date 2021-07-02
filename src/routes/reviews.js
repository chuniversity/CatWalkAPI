const { Router } = require('express');
const Review = require('../models/Review');
const MasterReview = require('../models/MasterReview');
const Characteristic = require('../models/Characteristic');
const Counter = require('../models/Counter');


const routes = Router();

routes.get('/:id', async (req, res) => {
  const product_id = req.params.id;
  const review = await MasterReview.find({product_id})
  const reviews = {
    product: product_id,
    page: 0,
    count: 5,
    results: review
  }
  res.send(reviews)
});

routes.post('/:id', async (req, res) => {
  const product_id = req.params.id;

  const {rating, summary, body, recommend, name, email, photos, characteristics} = req.body;
   
  //get review id
  const reviewId = await Counter.findOneAndUpdate({_id: "id"}, {$inc:{review_id:1}}, {new: true});

  // create photos
  let newPhotos = []
  for (let item of photos) {
    const photoNum = await Counter.findOneAndUpdate({_id: "id"}, {$inc:{photo_id:1}}, {new: true});
    let newobject = {};
    newobject['id'] = photoNum.photo_id;
    newobject['url'] = item;
    newPhotos.push(newobject)
  }

  // create charachteristics
  let theChars = [];
  for (var key in characteristics) {
    var newobject = {};
    let charId = Number(key)
    let { name }  = await Characteristic.findOne({id: charId}, {name: true, _id: false})
    newobject['characteristic_id'] = key;
    newobject['name'] = name;
    newobject['value'] = characteristics[key];
    theChars.push(newobject)
  }
  await MasterReview.create({
    id: reviewId.review_id,
    product_id: product_id,
    rating: rating,
    date: Date.now(),
    summary: summary,
    body: body,
    recommend: recommend,
    reported: false,
    reviewer_name: name,
    reviewer_email: email,
    response: "null",
    helpfulness: 0,
    photos: newPhotos,
    characteristics: theChars
  });
  res.send('success!')
});


routes.get('/:id/meta', async (req, res) => {
  const product_id = req.params.id;
  const result = await MasterReview.find({product_id});
  let metaResponse = {};
  metaResponse['product_id'] = product_id;
  // get ratings
  let ratings = {};
  for (let i = 0; i < result.length; i++) {
     if(ratings[result[i].rating]) {
       ratings[result[i].rating]++;
     } else {
       ratings[result[i].rating] = 1
     }
   }
   metaResponse['ratings'] = ratings;
   // get recommended
   let rec = {};
    for (let i = 0; i < result.length; i++) {
       if (result[i].recommend === true) {
         if (rec['true']) {
          rec['true']++;
         } else {
          rec['true'] = 1;
         }
       } else {
         if(rec['false']) {
          rec['false']++;
         } else {
          rec['false'] = 1;
         }
       } 
     }
     metaResponse['recommended'] = rec;
     // get characteristics
     let resultChar = {};
     for (let i = 0; i < result.length; i++) {
       let chars = result[i]['characteristics'];
       let charsFinal = [];
      for (let j = 0; j < chars.length; j++) {
        charsFinal.push({characteristic_id: chars[j]['characteristic_id'], name: chars[j]['name'], value: chars[j]['value'] });
        if(resultChar[charsFinal[j].name]) {
          resultChar[charsFinal[j].name]['value'] += charsFinal[j].value;
          resultChar[charsFinal[j].name]['total'] ++;
        } else {
          resultChar[charsFinal[j].name] = {
            id: charsFinal[j].characteristic_id,
            value: charsFinal[j].value,
            total: 1
          };
        }
      }
    }
    // get averages
    for (key in resultChar) {
      resultChar[key]['value'] = resultChar[key]['value'] / resultChar[key]['total'];
      delete resultChar[key]['total']
    }
    metaResponse['characteristics'] = resultChar;

  res.json(metaResponse)
});



// routes.put('/:id/helpful', async (req, res) => {
//   const review_id = req.params.id;
//   await MasterReview.updateOne({review_id}, {$inc: {helpfulness: 1}})
//   res.send('204');
// });

// routes.put('/:id/report', async (req, res) => {
//   const review_id = req.params.id;
//   await MasterReview.updateOne({review_id}, {$set: {reported: true}})
//   res.status(204);
// });

module.exports = routes;


