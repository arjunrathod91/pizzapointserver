const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  username:{
    type: String,
  },
  review:{
    type: String,
 }
});

const ReviewModel = mongoose.model("reviews", ReviewSchema);

module.exports = ReviewModel;