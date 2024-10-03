const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const OrderModel = require("./models/Order");
require('dotenv').config();

app.use(cors());
app.use(express.json());

const dbURI =process.env.MONGO_URI;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

  app.get('/dashboard', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Dashboard</title>
      </head>
      <body>
          <h1>Welcome to the Dashboard</h1>
          <p>This is the dashboard page.</p>
      </body>
      </html>
    `);
  });  

// Create User model


app.get('/orders',(req,res)=>{
  OrderModel.find()
  .then(product => res.json(product))
  .catch(err => res.json(err))

})
// app.get('/order', (req, res) => {
//   console.log("Fetching orders from MongoDB...");

//   OrderModel.find()
//     .then(orders => {
//       console.log("Orders found:", orders);
//       if (orders.length === 0) {
//         return res.status(404).json({ success: false, message: 'No orders found' });
//       }
//       res.status(200).json({ success: true, data: orders });
//     })
//     .catch(err => {
//       console.error("Error fetching orders:", err);
//       res.status(500).json({ success: false, error: err.message });
//     });
// });

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
