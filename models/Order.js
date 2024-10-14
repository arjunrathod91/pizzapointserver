const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
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

const MenuModel = mongoose.model("allItems", MenuSchema);

module.exports = MenuModel;