const { Router } = require('express');

const routes = Router();
/* GET home page. */
routes.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = routes;
