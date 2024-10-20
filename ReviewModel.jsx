// ReviewModel.js
const mongoose = require('mongoose');
const dayjs = require('dayjs');

// Create a review schema
const ReviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Add a unique compound index to prevent duplicate reviews by the same user for the same message
ReviewSchema.index({ userId: 1, message: 1 }, { unique: true });

ReviewSchema.methods.getFormattedDate = function() {
  return dayjs(this.createdAt).format('YYYY-MM-DD HH:mm:ss');
};

// Export the Review model
const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review; // Export the model
