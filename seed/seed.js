// seedMenu.js

const mongoose = require("mongoose");
const MenuModel = require("../models/Menu"); // Adjust the path if necessary
const allItems = require("../data/menu"); // Path to your menu data

// Load environment variables
require('dotenv').config();

// MongoDB connection URI from environment variables
const dbURI = process.env.MONGO_URI;

// Function to seed the database
const seedDB = async () => {
  try {
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB for seeding.");

    // Check for existing items to prevent duplicates
    const existingItems = await MenuModel.find({ name: { $in: allItems.map(item => item.name) } });
    const existingNames = existingItems.map(item => item.name);

    // Filter out items that already exist
    const itemsToInsert = allItems.filter(item => !existingNames.includes(item.name));

    if (itemsToInsert.length > 0) {
      await MenuModel.insertMany(itemsToInsert);
      console.log(`${itemsToInsert.length} menu items inserted successfully.`);
    } else {
      console.log("All menu items already exist. Skipping insertion.");
    }

    mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (err) {
    console.error("Error during seeding:", err);
    mongoose.connection.close();
  }
};

// Execute the seed function
seedDB();
