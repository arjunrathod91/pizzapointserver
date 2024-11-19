const mongoose = require("mongoose");

const NewOrderSchema = new mongoose.Schema({
  username:{
    type: String,
  },
  email:{
    type: String,
  },
  password:{
    type: String,
  },
  contact:{
    type: String,
  },
  address:{
    type: String,
  },
  order:{
    type:Array,
  },
  total:{
    type:Number
  }
});

const NewOrderModel = mongoose.model("newOrder", NewOrderSchema);

module.exports = NewOrderModel;