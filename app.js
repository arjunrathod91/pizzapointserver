const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const MenuModel = require("./models/Menu");
const UserModel = require("./models/User");
const OrderModel = require("./models/AllOrders");
// const verifyToken = require("./middleware/verifyToken");
const NewOrderModel = require("./models/NewOrder");
const ReviewModel = require("./models/Reviews");
const allItems = require("./data/menu");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Admin join
  socket.on("join_admin", () => {
    socket.join("admin");
    console.log("Admin joined");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

app.use(cors());
app.use(express.json());

const dbURI = process.env.MONGO_URI;

mongoose
  .connect(dbURI)
  // { useNewUrlParser: true, useUnifiedTopology: true }
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

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

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

app.post("/allItems", (req, res) => {
  try {
    const itemDetails = req.body;
    console.log("Received Item details:", itemDetails);
    MenuModel.create(itemDetails);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Error", error: error.message });
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

// app.post("/userDetail", (req, res) => {
//   try {
//     const profileDetails = req.body;
//     console.log("Received profile details:", profileDetails);
//     UserModel.create(profileDetails);
//   } catch (error) {
//     console.error("Error", error);
//     res.status(500).json({ message: "Error", error: error.message });
//   }
// });

app.post("/userDetail", async (req, res) => {
  try {
    const { username, email, password, contact, address } = req.body;
    if (!username || !email || !password || !contact || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      contact,
      address
    });
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
    // console.log("New user created:", newUser);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
});

app.get("/userDetail", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message
    });
  }
});

// app.get("/userDetail", verifyToken, async (req, res) => {
//   const user = await UserModel.findById(req.userId).select("-password");
//   res.json(user);
// });

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
    const { email, order } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // 1. push new order safely
    user.order.push(order);
    // 2. clear cart
    user.cart = {
      items: [],
      total: 0
    };
    await user.save();
    res.status(200).json({
      message: "Order placed successfully",
      user
    });
  }catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
});

// app.put("/userDetail", async (req, res) => {
//   try {
//     const { email, password, cart, order } = req.body;
//     const user = await UserModel.findOne({ email, password });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     user.cart = cart;
//     user.order = order;
//     await user.save();
//     res.status(200).json(user);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ message: "Error", error: error.message });
//   }
// });

//login

// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await UserModel.findOne({ email });
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "User not found"
//       });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid password"
//       });
//     }
//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET,   // ⚠️ change this later to env variable
//       { expiresIn: "1d" }
//     );
//     res.json({
//       success: true,
//       token: token,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     console.error("Server error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// });

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Wrong password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.get("/allOrders", async (req, res) => {
  try {
    const order = await OrderModel.find();
    res.json(order);
    // console.log(order);
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

// app.post("/newOrder", (req, res) => {
//   try {
//     const userOrder = req.body;
//     console.log("tan tana tan tara:", userOrder);
//     NewOrderModel.create(userOrder);
//   } catch (error) {
//     console.error("Error", error);
//     res.status(500).json({ message: "Error", error: error.message });
//   }
// });

app.post("/newOrder", async (req, res) => {
  try {
    const userOrder = req.body;

    // ✅ Store (your old system)
    const savedOrder = await NewOrderModel.create(userOrder);

    // ✅ Real-time update
    io.to("admin").emit("new_order", savedOrder);
    console.log("New order received and emitted to admin:", savedOrder);
    res.status(200).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
});

app.get("/newOrder", async (req, res) => {
  try {
    const order = await NewOrderModel.find();
    res.json(order);
    // console.log(order);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
});

app.delete("/newOrder/:id", async (req, res) => {
  try {
    const { id } = req.params; // ✅ from params now

    const result = await NewOrderModel.findByIdAndDelete(id);
    console.log("Deleted order:", result);

    if (!result) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully", result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
});

app.get("/reviews", async (req, res) => {
  try {
    const review = await ReviewModel.find();
    res.json(review);
    // console.log(review);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
});

// app.post("/reviews", (req, res) => {
//   try {
//     const newReview = req.body;
//     console.log("tan tana tan tara:", newReview);
//     ReviewModel.create(newReview);
//   } catch (error) {
//     console.error("Error", error);
//     res.status(500).json({ message: "Error", error: error.message });
//   }
// });
app.post("/reviews", async (req, res) => {
  try {
    const newReview = req.body;
    console.log("Review pushed successfully:", newReview);
    const savedReview = await ReviewModel.create(newReview);
    res.status(201).json({
      message: "Review saved successfully",
      data: savedReview
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Error", error: error.message });
  }
});


const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});