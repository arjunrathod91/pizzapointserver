const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const MenuModel = require("./models/Menu"); // Ensure the path is correct
const UserModel = require("./models/User");
const allItems = require("./data/menu");
require("dotenv").config(); // Uncomment if using environment variables

app.use(cors());
app.use(express.json());

// MongoDB connection URI
const dbURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    // Removed insertion and connection close from here
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Route to get all orders
app.get("/allItems", async (req, res) => {
  try {
    const orders = await MenuModel.find();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
});

//post signup details

app.post("/userDetail", (req, res) => {
  try {
    const profileDetails = req.body;
    console.log("Received profile details:", profileDetails);
    UserModel.create(profileDetails);
    // UserModel.inserprotMany(profileDetails)
  } catch (error) {
    console.error("Error", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Error", error: error.message });
  }
});

//login

// app.post("/login", (req, res) => {
//   try {
//     const profileDetails = req.body;
//     // console.log("Received profile details:", profileDetails);
//     // UserModel.create(profileDetails);
//     // UserModel.inserprotMany(profileDetails)
//   } catch (error) {
//     console.error("Error", error); // Log the error for debugging
//     res
//       .status(500)
//       .json({ message: "Error", error: error.message });
//   }
// });


app.get("/userDetail", async (req, res) => {
  try {
    const user = await UserModel.find();
    res.json(user);
    console.log(user);
  } catch (error) {
    console.error("Error:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Error", error: error.message });
  }
});

//post all orders

// app.post("/allOrders", async (req, res) => {
//   try {
//   } catch (error) {}
// });

//get all orders
// app.get("/allOrders", async (req, res) => {
//   try {
//     const orders = await MenuModel.find();
//     res.json(orders);
//   } catch (error) {
//     console.error("Error fetching orders:", error); // Log the error for debugging
//     res
//       .status(500)
//       .json({ message: "Error fetching orders", error: error.message });
//   }
// });

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
