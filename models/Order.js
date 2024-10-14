const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  name:{
    type: String,
  },
  ingridient:{
    type: String,
  },
  rating:{
    type: Number,
  },
  price:{
    type: String,
  },
  img:{
    type: String,
  },
  category:{
    type: String,
  },
  type:{
    type: String,
  },
  tag:{
    type: String,
  }
});

const OrderModel = mongoose.model("orders", OrderSchema);

module.exports = OrderModel;