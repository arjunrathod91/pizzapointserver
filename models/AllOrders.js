const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
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
  },
  paymentType:{
    type:String
  },
  date:{
    type:Object
  }
});

const OrderModel = mongoose.model("allOrders", OrderSchema);

module.exports = OrderModel;