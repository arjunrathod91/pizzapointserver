// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const OrderModel = require("./models/Order"); // Ensure the path is correct
require('dotenv').config(); // Uncomment if using environment variables

app.use(cors());
app.use(express.json());

// MongoDB connection URI
const dbURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    // Removed insertion and connection close from here
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Route to get all orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await OrderModel.find();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
