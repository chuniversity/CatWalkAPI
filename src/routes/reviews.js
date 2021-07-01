const { Router } = require('express');
var Review = require('../models/Review')

const routes = Router();

routes.get('/', async (req, res) => {
  const { product_id } = req.query;
  const review = await Review.findOne({product_id})
  res.json(review)
});

routes.post('/', async (req, res) => {
  
});


module.exports = routes;



