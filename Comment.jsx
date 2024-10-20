const mongoose = require('mongoose');
// Create a review schema
const CommentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  itemId: {type: String, required: true }
});

// Export the Review model
const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment; // Export the model