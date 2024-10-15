const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const MenuModel = require("./models/Menu");
const UserModel = require("./models/User");
const allItems = require("./data/menu");
const { Password } = require("@mui/icons-material");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const dbURI = process.env.MONGO_URI;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.get("/allItems", async (req, res) => {
  try {
    const orders = await MenuModel.find();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
});

app.post("/userDetail", (req, res) => {
  try {
    const profileDetails = req.body;
    console.log("Received profile details:", profileDetails);
    UserModel.create(profileDetails);
  } catch (error) {
    console.error("Error", error);
    res
      .status(500)
      .json({ message: "Error", error: error.message });
  }
});

app.get("/userDetail", async (req, res) => {
  try {
    const user = await UserModel.find();
    res.json(user);
    console.log(user);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Error", error: error.message });
  }
});

// app.put("/userDetail", async (req, res) => {
//   try {
//     const { email, password, cart } = req.body;
//     const user = await UserModel.findOne({ email, password });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     user.cart = cart;
//     await user.save();
//     res.status(200).json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json(error);
//   }
// });

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
