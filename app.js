const express = require('express');
const path = require('path');

const router = require('./src/routes');
const startMongo = require("./mongoConnect");

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(router)

const startServer = async () => {
  await startMongo()
  app.listen(3000, () => {
    console.log(`listening on port 3000`)
  });
}

startServer()



module.exports = app;







