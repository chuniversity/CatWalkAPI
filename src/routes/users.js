const { Router } = require('express')

const routes = Router()
/* GET users listing. */
routes.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = routes;
