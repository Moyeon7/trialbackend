const mongoose = require('mongoose');

// Define schema for extras
const ExtraSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

// Define schema for cart items
const CartItemSchema = new mongoose.Schema({
  email: { // Add the email field to store the user's email
    type: String,
    required: true
  },
  itemId: {
    type: Number,  // or ObjectId, depending on your item schema
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  itemPrice: {
    type: Number,
    required: true
  },
  itemQuantity: {
    type: Number,
    required: true
  },
  extras: [ExtraSchema] // Array of extras with name, price, and quantity
});

const CartItem = mongoose.model('CartItem', CartItemSchema);

module.exports = CartItem;