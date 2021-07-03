const { Router } = require('express');

const routes = Router();
/* GET home page. */
routes.get('/', function(req, res, next) {
  res.render('index', { title: 'Review API' });
});

module.exports = routes;
