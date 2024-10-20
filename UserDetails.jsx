const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Added for login
   // Optional field for additional image data
}, { collection: 'UserInfo' });

module.exports = mongoose.model("UserInfo", userSchema);