const mongoose = require("mongoose");
const MenuModel = require("./models/Menu");
const allItems = require("./data/menu");

require('dotenv').config();

const dbURI = process.env.MONGO_URI;

const seedDB = async () => {
  try {
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB for seeding.");

    const existingItems = await MenuModel.find({ name: { $in: allItems.map(item => item.name) } });
    const existingNames = existingItems.map(item => item.name);

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
seedDB();
