const mongoose = require('mongoose');

// Define schema for extras (same as in CartItem)
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

// Define schema for order items (similar to CartItem)
const OrderItemSchema = new mongoose.Schema({
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
  extras: [ExtraSchema] // Array of extras
});

// Define schema for order history
const OrderHistorySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  items: [OrderItemSchema], // Array of items in the order
  totalAmount: {
    type: Number,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now // Automatically set the order date
  },
  delivered: {
    type: Boolean,
    default: false // Default is false, indicating the order is not delivered yet
  },
});

const OrderHistory = mongoose.model('OrderHistory', OrderHistorySchema);

module.exports = OrderHistory;