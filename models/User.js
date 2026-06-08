const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  contact: String,
  address: String,

  cart: {
    items: { type: Array, default: [] },
    total: { type: Number, default: 0 }
  },

  order: {
    type: [
      {
        orderItems: [
          {
            itemId: String,
            name: String,
            price: Number,
            quantity: Number,
            ingridient:String,
            rating:Number,
            img:String,
            category:String,
            type:String,
            tag:String,
            display:String,
            }
        ],
        total: Number,
        paymentType: String,
        orderType: String,
        date:String,
        time:String,
        orderStatus:String
      }
    ],
    default: []
  }
}, { timestamps: true });

const UserModel = mongoose.model("userDetail", UserSchema);

module.exports = UserModel;