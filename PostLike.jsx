const mongoose = require('mongoose');
// Create a review schema
const PostSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  itemId: {type: String, required: true }
});

// Export the Review model
const PostLike = mongoose.model('PostLike', PostSchema);
module.exports = PostLike; // Export the model