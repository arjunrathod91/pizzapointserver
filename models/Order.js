const mongoose = require('mongoose')
const OrderSchema = new mongoose.Schema({
    username: String,
  email: String,
  contact: String,
  address: String,
  password: String,
})

const OrderModel = mongoose.model("orders",OrderSchema)
module.exports = OrderModel;