const mongoose = require('mongoose');

// Define the Product Schema
const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Unique identifier for the product
  name: { type: String, required: true },
  image: { type: String, required: true }, // URL for the image
  rating: { type: Number, required: true, min: 0, max: 5 }, // Rating should be between 0 and 5
  price: { type: Number, required: true }, // Price of the product
  type: { type: String, required: true }, // Type (e.g., coffee, snack)
  isVeg: { type: Boolean, required: true }, // Whether the product is vegetarian
}, {
  timestamps: true, // Automatically create createdAt and updatedAt fields
});

// Create the Product model
const MenuEntries = mongoose.model('MenuItems', productSchema);

module.exports = MenuEntries;