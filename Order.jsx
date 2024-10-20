const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  // Other order fields...
  delivered: {
    type: Boolean,
    default: false, // Default to false when an order is created
  },
  // More fields like email, totalAmount, items, etc.
});

module.exports = mongoose.model('Order', OrderSchema);
