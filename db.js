const mongoose = require("mongoose");
const mongoURI =
  "mongodb://localhost:27017/inotes?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const conToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("connected");
  });
};
module.exports = conToMongo;
