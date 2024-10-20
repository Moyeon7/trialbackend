const mongoose = require('mongoose');
const dayjs = require('dayjs');

// Create a review schema
const BlogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  postImage: { type: String },
  // itemId: { type: String, required: true },
  comment: { type: String },
  like: { type: Number, default: 0 },
  userImg: { type: String},
});

// Add a unique compound index to prevent duplicate reviews by the same user for the same message
// BlogSchema.index({ userId: 1, message: 1 }, { unique: true });

BlogSchema.methods.getFormattedDate = function() {
  return dayjs(this.createdAt).format('YYYY-MM-DD HH:mm:ss');
};

// Export the Review model
const Review = mongoose.model('Blog', BlogSchema);
module.exports = Review; // Export the model
