const { Router } = require('express');
const Review = require('../models/Review');
const MasterReview = require('../models/MasterReview');
const Characteristic = require('../models/Characteristic');
const Counter = require('../models/Counter');

const routes = Router();

routes.get('/', async (req, res) => {
  try {
    let { page = 1, count = 5, sort, product_id = 1 } = req.query;
    if (sort === 'helpful') {sort = {'helpfulness': -1};}
    if (sort === 'newest') { sort = {'date': -1}}
    if (sort === 'relevant') { sort = {'helpfulness': -1, 'date': -1}}
    const reviewData = await MasterReview.find({product_id: product_id, reported: false}, {_id: 0, product_id: 0, reviewer_email: 0, reported: 0, __v: 0}).sort(sort).skip(count * (page - 1)).limit(parseInt(count)).lean();
    reviewData.date = new Date(reviewData.date * 1000)
    const reviews = {
      product: product_id,
      page: page,
      count: count,
      results: reviewData
    }
    res.send(reviews)
  } catch (error) {
    res.status(400).send(error)
  }
});

routes.post('/:id', async (req, res) => {
  try {
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
      helpfulness: 0,
      photos: newPhotos,
      characteristics: theChars
    });
    res.sendStatus(201);
  } catch (error) {
    res.status(400).send(error)
  }
});

routes.get('/:id/meta', async (req, res) => {
  try{
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
  } catch (error) {
    res.status(400).send(error)
  }
});

routes.put('/:id/helpful', async (req, res) => {
  try {
    const review_id = req.params.id;
    console.log(review_id)
    await MasterReview.updateOne({id: review_id}, {$inc: {helpfulness: 1}})
    res.sendStatus('204');
  } catch (error) {
    res.status(400).send(error)
  }
});

routes.put('/:id/report', async (req, res) => {
  try {
    const review_id = req.params.id;
    await MasterReview.updateOne({id: review_id}, {$set: {reported: true}})
    res.sendStatus(204);
  } catch (error) {
    res.status(400).send(error)
  }
});

module.exports = routes;


