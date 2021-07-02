const { Router } = require('express');
const Review = require('../models/Review');
const MasterReview = require('../models/MasterReview');
const Characteristic = require('../models/Characteristic');

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
  res.send(review)
});

routes.post('/:id', async (req, res) => {
  const product_id = req.params.id;

  const {rating, summary, body, recommend, name, email, photos, characteristics} = req.body;
  // const keys = Object.keys(characteristics);
  // console.log(keys)

  // create photos
  let newPhotos = []
  for (let item of photos) {
    let newobject = {};
    newobject['id'] = 99;
    newobject['url'] = item;
    newPhotos.push(newobject)
  }

  // create charachteristics
  let theChars = [];
  for (var key in characteristics) {
    var newobject = {};
    // newobject['id'] = 99;
    newobject['characteristic_id'] = key;
    // newobject['review_id'] = 99;
    newobject['value'] = characteristics[key];
    theChars.push(newobject)
  }


  await MasterReview.create({
    product_id: product_id,
    rating: rating,
    date: Date.now(),
    summary: summary,
    body: body,
    recommend: recommend, 
    reviewer_name: name,
    reviewer_email: email,
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
    //  let test1 = await Characteristic.findOne({id: 2}, {name: true, _id: false}) 
    //  console.log('test1', test1)

     let resultChar = {};
     for (let i = 0; i < result.length; i++) {
       let chars = result[i]['characteristics'];
       let charsFinal = [];
      for (let j = 0; j < chars.length; j++) {
          charsFinal.push({characteristic_id: chars[j]['characteristic_id'], value: chars[j]['value'] })
        let id = chars[j].characteristic_id
        let { name } = await Characteristic.findOne({id}, {name: true, _id: false})
        charsFinal[j].name = name;
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


module.exports = routes;



