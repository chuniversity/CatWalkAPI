const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const config = require('./config.js');



//cloud db option
// const mongoUrl = `mongodb+srv://${config.user}:${config.pass}@review.yglx2.mongodb.net/${dbName}?retryWrites=true&w=majority`
const mongoUrl = `mongodb://localhost:27017/${config.dbName}`;

const startMongo = async () => {
  const opt = {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  }
  const db = mongoose.connection;
  db.on("connected", () => {
    console.log("Connected to db");
  });
  await mongoose.connect(mongoUrl, opt);

}





module.exports = startMongo;