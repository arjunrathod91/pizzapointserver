const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const OrderModel = require("./models/Order")

app.use(cors());
app.use(express.json());

const dbURI =
  "mongodb+srv://ar885209:ar12ju34%40%23@cluster0.7mfsjgv.mongodb.net/PizzaPoint?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// Create User model

// GET route to fetch user data
// app.get('/order',(req,res)=>{
//   OrderModel.find()
//   .then(product => res.json(product))
//   .catch(err => res.json(err))

// })
app.get('/order', (req, res) => {
  console.log("Fetching orders from MongoDB...");

  OrderModel.find()
    .then(orders => {
      console.log("Orders found:", orders);
      if (orders.length === 0) {
        return res.status(404).json({ success: false, message: 'No orders found' });
      }
      res.status(200).json({ success: true, data: orders });
    })
    .catch(err => {
      console.error("Error fetching orders:", err);
      res.status(500).json({ success: false, error: err.message });
    });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
