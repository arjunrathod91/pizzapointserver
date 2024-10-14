const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  product: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  price: {
    type: Number,
  },
  customer: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const OrderModel = mongoose.model("orders", OrderSchema);
// Explicitly set the collection name to avoid pluralization issues
module.exports = OrderModel;