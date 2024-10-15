const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
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
  cart:{
    type:Array,
  }
});

const UserModel = mongoose.model("userDetail", UserSchema);

module.exports = UserModel;