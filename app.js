const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const MenuModel = require("./models/Menu");
const UserModel = require("./models/User");
const OrderModel = require("./models/AllOrders");
const NewOrderModel = require("./models/NewOrder");
const allItems = require("./data/menu");
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

//putting item details

app.put("/allItems/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedItem = await MenuModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: "Failed to update item" });
  }
});

app.delete("/allItems", async (req, res) => {
  try {
    const { id } = req.body; // assuming you're sending the ID in the body of the request
    if (!id) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const result = await MenuModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully", result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
});

app.post("/userDetail", (req, res) => {
  try {
    const profileDetails = req.body;
    console.log("Received profile details:", profileDetails);
    UserModel.create(profileDetails);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
});

app.get("/userDetail", async (req, res) => {
  try {
    const user = await UserModel.find();
    res.json(user);
    console.log(user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
});

//currently working how user dont need to login again and again

// app.get("/userDetail", async (req, res) => {
//   try {
//     const { email,password} = req.body;
//     const user = await UserModel.findOne({ email, password });
//     res.json(user);
//     console.log(user);
//   } catch (error) {
//     console.error("Error:", error);
//     res
//       .status(500)
//       .json({ message: "Error", error: error.message });
//   }
// });

//for order

app.put("/userDetail", async (req, res) => {
  try {
    const { email, password, cart, order } = req.body;
    const user = await UserModel.findOne({ email, password });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.cart = cart;
    user.order = order;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
});

//login

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email, password });
    if (user) {
      // res.json({ success: true });
      res.json(user);
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/allOrders", async (req, res) => {
  try {
    const order = await OrderModel.find();
    res.json(order);
    console.log(order);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
});

app.post("/allOrders", async (req, res) => {
  try {
    const { _id, ...orderData } = req.body; // Remove _id if it's passed in the request

    console.log("orders are going there:", orderData);

    // Insert order into database
    const result = await OrderModel.create(orderData);

    res
      .status(201)
      .json({ message: "Order created successfully", data: result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
});

app.post("/newOrder", (req, res) => {
  try {
    const userOrder = req.body;
    console.log("tan tana tan tara:", userOrder);
    NewOrderModel.create(userOrder);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
});

app.get("/newOrder", async (req, res) => {
  try {
    const order = await NewOrderModel.find();
    res.json(order);
    console.log(order);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
});

app.delete("/newOrder", async (req, res) => {
  try {
    const { id } = req.body; // assuming you're sending the ID in the body of the request
    if (!id) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const result = await NewOrderModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully", result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
