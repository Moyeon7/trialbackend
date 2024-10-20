const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const paymentRoutes = require('./paymentRoute.jsx');
const Payment = require('./Payment.jsx');
const Donation = require('./Donation.jsx');
const Review = require('./ReviewModel.jsx');
const Blog = require('./BlogModel.jsx');
const PostLike = require('./PostLike.jsx');
const multer = require('multer');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/payments', paymentRoutes);
app.use('/uploads', express.static('uploads'));

const mongoUrl = "mongodb+srv://sakshi:pikachu02@cluster0.068g2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";

mongoose.connect(mongoUrl)
  .then(() => {
    console.log("db connected");
  })
  .catch((e) => {
    console.log(e);
  });

require('./UserDetails.jsx'); // Ensure this file correctly exports your User model
const User = mongoose.model("UserInfo");
// const User = require('./user.jsx'); 

// If Review model is used, import it
// const Review = require('./ReviewModel');

app.get("/", (req, res) => {
  res.send({ status: "started" });
});

// Register route
// Register route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    return res.status(409).send({ error: "User already exists!!" });
  }


  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    await User.create({ name, email, password: encryptedPassword });
    res.status(201).send({ status: "ok", data: "User Created" });
  } catch (error) {
    res.status(500).send({ status: "error", data: error.message });
  }
});

// Login route
// Login route
// Login route
app.post('/login-user', async (req, res) => {
  console.log('Login request received:', req.body);
  const { email, password } = req.body;
  const oldUser = await User.findOne({ email: email });

  if (!oldUser) {
    return res.status(404).send({ error: "User doesn't exist!!" });
  }
 
  if (await bcrypt.compare(password, oldUser.password)) {
    const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);
    return res.status(200).send({ status: "ok", data: token });
  } else {
    return res.status(401).send({ error: "Invalid credentials" });
  }
});

// update profile shervin
//UPDATE ACCOUNT 
app.post('/update-profile', async (req, res) => {
  const { email, name, username, mobile, profileImage } = req.body; // Include profileImage

  try {
      const updatedUser = await up.findOneAndUpdate(
          { email: email }, // Find user by email
          { name, username, mobile, profileImage }, // Update all fields
          { new: true } // Return the updated document
      );

      if (!updatedUser) {
          return res.status(404).send({ status: 'error', message: 'User not found.' });
      }

      res.send({ status: 'ok', data: updatedUser });
  } catch (error) {
      res.status(500).send({ status: 'error', message: error.message });
  }
});

// Endpoint to get user details by email
app.get('/user-details', async (req, res) => {
  const { email } = req.query; // Get the email from query parameters

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ status: 'error', message: 'Email is required' });
  }

  try {
    // Fetch the user details from the 'User_profile' collection by email
    const user = await up.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Exclude sensitive data (like password) from the response
    const { password, ...userDetails } = user._doc; // Exclude password if present
    return res.json({ status: 'ok', data: userDetails });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Add Review Route
app.post('/reviews', async (req, res) => {
  const { rating, message, userId } = req.body; // Assume userId is coming from the frontend or decoded from a JWT

  // Input validation
  if (!rating || !message || !userId) {
    return res.status(400).send({ error: 'Rating, message, and userId are required' });
  }
 
  try {
    // Create a new review with the provided data
    const newReview = new Review({
      rating,
      message,
      userId,
    });

    // Save the review to the database
    await newReview.save();
    res.status(201).send({ message: 'Review added successfully!' });
    
  } catch (error) {
    console.error(error);

    res.status(500).send({ error: 'Failed to add review' });
  }
});

// Backend route to check if the user has already submitted a review
app.post('/reviews/check', async (req, res) => {
  const { userId } = req.body;
  
  try {
    const existingReview = await Review.findOne({ userId });

    if (existingReview) {
      return res.status(400).json({ error: 'User has already submitted a review.' });
    }

    res.status(200).json({ message: 'No existing review' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Backend route to fetch all reviews
app.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find(); // Fetch all reviews
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const CartItem = require('./Cart.jsx');

app.post('/cart/add', async (req, res) => {
  // Destructure the request body to extract itemId, itemName, itemPrice, itemQuantity, userId, email, and extras
  const { email, itemId, itemName, itemPrice, itemQuantity, extras } = req.body; 
  console.log(req.body); // Log request body to ensure it's being received

  // Check if required fields are provided
  if ( email === undefined || // Check if email is provided
      itemId === undefined || 
      itemName === undefined || 
      itemPrice === undefined || 
      itemQuantity === undefined) {
    return res.status(400).send({ error: 'Item ID, name, price, quantity, user ID, and email are required' });
  }

  // Validate the format of extras if provided
  if (extras && !Array.isArray(extras)) {
    return res.status(400).send({ error: 'Extras should be an array' });
  }

  try {
    // Create a new CartItem with the provided details
    await CartItem.create({
      email, // Include email in the create method
      itemId,
      itemName,
      itemPrice,
      itemQuantity,
      extras: extras || []  // Include extras in the create method
    });

    res.status(201).send({ status: 'ok', data: 'Item added to cart successfully' });
  } catch (error) {
    res.status(500).send({ status: 'error', data: error.message }); // Include error message for any internal server error
  }
});


app.get('/cart/:email', async (req, res) => {
  const email = req.params.email; // Get userId from the request parameters

  try {
    // Find all cart items associated with the provided userId
    const cartItems = await CartItem.find({ email: email }); // Query for items with the specified userId

    // Check if any cart items are found
    if (cartItems.length === 0) {
      return res.status(404).send({ status: 'error', data: 'No items found in cart for this user.' });
    }

    // Format the response to include only the required fields
    const formattedItems = cartItems.map(item => ({
      itemId: item.itemId,
      itemName: item.itemName,
      itemPrice: item.itemPrice,
      itemQuantity: item.itemQuantity,
      extras: item.extras || []
      // Include quantity if needed
    }));

    res.status(200).send({ status: 'ok', data: formattedItems }); // Send the items as response
  } catch (error) {
    res.status(500).send({ status: 'error', data: error.message }); // Handle any internal server error
  }
});



app.delete('/cart/remove/:email/:itemId', async (req, res) => {
  const { email, itemId } = req.params; // Get email and itemId from the request parameters

  // Convert itemId to a number
  const numericItemId = parseInt(itemId, 10);

  // Check if itemId is a valid number
  if (isNaN(numericItemId)) {
    return res.status(400).send({ status: 'error', data: 'Invalid item ID.' });
  }

  console.log(`Attempting to remove item with ID: ${numericItemId} for user: ${email}`); // Log itemId and email

  try {
    // Find and delete the cart item
    const result = await CartItem.findOneAndDelete({ email: email, itemId: numericItemId });

    // Check if the item was found and deleted
    if (!result) {
      return res.status(404).send({ status: 'error', data: 'Item not found in cart.' });
    }

    res.status(200).send({ status: 'ok', data: 'Item removed from cart successfully.' }); // Send success response
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).send({ status: 'error', data: error.message }); // Handle any internal server error
  }
});

const OrderHistory = require('./orderhistory.jsx');  // Your new order model


app.post('/cart/move-to-order-history/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Fetch the cart items for the given email
    const cartItems = await CartItem.find({ email });
    if (cartItems.length === 0) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    // Calculate total amount
    let totalAmount = 0;
    cartItems.forEach(item => {
      totalAmount += (item.itemPrice * item.itemQuantity);
      item.extras.forEach(extra => {
        totalAmount += (extra.price * extra.quantity);
      });
    });

    // Create a new order history entry
    const newOrder = new OrderHistory({
      email,
      items: cartItems,  // Copy items from cart
      totalAmount
    });

    await newOrder.save();

    // Clear the cart after moving
    await CartItem.deleteMany({ email });

    res.status(200).json({ message: 'Items moved to order history and cart cleared', data: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error moving cart to order history', error });
  }
});



app.get('/order-history/:email', async (req, res) => {
  const email = req.params.email; // Get email from the request parameters

  try {
    // Find all orders associated with the provided email
    const orders = await OrderHistory.find({ email: email }); // Query for orders with the specified email

    // Check if any orders are found
    if (orders.length === 0) {
      return res.status(404).send({ status: 'error', data: 'No orders found for this user.' });
    }

    // Format the response to include only the required fields
    const formattedOrders = orders.map(order => ({
      orderId: order._id, // Include order ID if needed
      email: order.email,
      totalAmount: order.totalAmount,
      orderDate: order.orderDate,
      delivered: order.delivered,
      items: order.items.map(item => ({
        itemId: item.itemId,
        itemName: item.itemName,
        itemPrice: item.itemPrice,
        itemQuantity: item.itemQuantity,
        extras: item.extras || [] // Include extras if present
      }))
    }));

    res.status(200).send({ status: 'ok', data: formattedOrders }); // Send the formatted orders as response
  } catch (error) {
    res.status(500).send({ status: 'error', data: error.message }); // Handle any internal server error
  }
});

app.get('/order-history', async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await OrderHistory.find(); // Adjust this to your actual Mongoose model for orders

    // Check if any orders are found
    if (orders.length === 0) {
      return res.status(404).send({ status: 'error', data: 'No orders found.' });
    }

    // Format the response to include only the required fields
    const formattedOrders = orders.map(order => ({
      orderId: order._id, // Include order ID
      email: order.email,
      totalAmount: order.totalAmount,
      orderDate: order.orderDate,
      delivered: order.delivered,
      items: order.items.map(item => ({
        itemId: item.itemId,
        itemName: item.itemName,
        itemPrice: item.itemPrice,
        itemQuantity: item.itemQuantity,
        extras: item.extras || [] // Include extras if present
      }))
    }));

    res.status(200).send({ status: 'ok', data: formattedOrders }); // Send the formatted orders as response
  } catch (error) {
    res.status(500).send({ status: 'error', data: error.message }); // Handle any internal server error
  }
});


// shervin's part
require('./user.jsx'); // Ensure this file correctly exports your User model
const up = mongoose.model("User_profile");


app.post("/reg", async (req, res) => {
  const { name, username, email, mobile, profileImage } = req.body;

  try {
      const newUser = new up({ name, username, email, mobile, profileImage });
      await newUser.save();
      res.json({ status: "ok", userId: newUser._id });
  } catch (error) {
      console.error('Error registering user:', error.message);
      res.status(400).json({ status: "error", data: error.message });
  }
});

// Endpoint to check if a username exists
app.post("/check-username", async (req, res) => {
  const { username } = req.body;

  console.log("Checking username:", username);

  try {
      const exists = await u.exists({ username });
      console.log('Username exists:', exists);
      res.json({ exists });
  } catch (error) {
      console.error('Error checking username:', error.message);
      res.status(400).json({ status: "error", data: error.message });
  }
});

// Endpoint to upload a Base64 image
app.post("/upload-image", async (req, res) => {
  console.log("Received image upload request:", req.body);

  const { userId, image } = req.body;

  try {
      if (!userId || !image) {
          return res.status(400).json({ status: "error", data: "User ID and image are required." });
      }

      const userp = await up.findById(userId);
      if (!userp) {
          return res.status(404).json({ status: "error", data: "User not found." });
      }

      if (!/^data:image\/[a-zA-Z]+;base64,/.test(image)) {
          return res.status(400).json({ status: "error", data: "Invalid image format." });
      }

      userp.profileImage = image; // Save image to profileImage field
      await userp.save();
      console.log('Image uploaded for user:', userId);

      res.json({ status: "ok", data: "Image uploaded successfully." });
  } catch (error) {
      console.error('Error uploading image:', error.message);
      res.status(400).json({ status: "error", data: error.message });
  }
});

// donation 
app.post('/donate', async (req, res) => {
  const { name, amount, message } = req.body;
  try {
    const newDonation = new Donation({ name, amount, message });
    await newDonation.save();
    res.status(201).json({ message: 'Donation saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save donation' });
  }
});

// Payment endpoint
app.post('/payment', async (req, res) => {
  const { email, amount, address } = req.body;
  console.log("jfkds");
  // Validate input
  if (!email || !amount  || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Create a new payment document
    const newPayment = new Payment({
      email,
      amount,
      address,
    });

    // Save payment to the database
    await newPayment.save();

    // Respond with success message
    res.status(201).json({ message: 'Payment saved successfully' });
  } catch (error) {
    console.error('Error saving payment:', error);
    res.status(500).json({ error: 'Failed to save payment details' });
  }
});

// Route to upload a post
app.post('/blogs', async (req, res) => {
  const { message, userId, postImage, userImg } = req.body;

  try {
    const newBlog = new Blog({ message, userId, postImage, userImg });
    await newBlog.save();
    res.status(201).json({ success: true, message: 'Post uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to upload post' });
  }
});

// Backend route to fetch all blog
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find(); // Fetch all blogs
    res.status(200).json({ success: true, blogs }); // Return a success field
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ success: false, error: 'Server error' }); // Include a success field for consistency
  }
});

// Route to add a like
app.post('/:id/like', async (req, res) => {
  const blogId = req.params.id;
  const userId = req.body.userId; // Assuming userId is sent in the request body
  console.log('adddname:', userId);
  // Validate userId
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Check if the user has already liked the blog
    const existingLike = await PostLike.findOne({ itemId: blogId, userId });

    if (existingLike) {
      return res.status(400).json({ message: 'User has already liked this blog' });
    }

    // Create a new like record
    const newLike = new PostLike({ itemId: blogId, userId});
    await newLike.save();

    // Increment the blog's like count
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $inc: { like: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Respond with the updated like count
    res.status(200).json({ like: blog.like });
  } catch (error) {
    console.error('Error adding like:', error);
    res.status(500).json({ message: 'Server error. Please try again later.', error: error.message });
  }
});

// Route to remove a like
app.post('/:id/remove-like', async (req, res) => {
  const blogId = req.params.id;
  const userId = req.body.userId; // Assuming userId is sent in the request body'

  // Validate userId
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Find the like record and remove it
    const like = await PostLike.findOneAndDelete({ itemId: blogId, userId });

    if (!like) {
      return res.status(404).json({ message: 'Like not found' });
    }

    // Decrement the blog's like count
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $inc: { like: -1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Respond with the updated like count
    res.status(200).json({ like: blog.like });
  } catch (error) {
    console.error('Error removing like:', error);
    res.status(500).json({ message: 'Server error. Please try again later.', error: error.message });
  }
});


// Route to check like status
app.post('/:blogId/check-like', async (req, res) => {
  const blogId = req.params.blogId;
  const userId = req.body.userId;

  // Validate parameters
  if (!blogId || !userId) {
    return res.status(400).json({ message: 'Blog ID and User ID are required' });
  }

  try {
    const like = await PostLike.findOne({ itemId: blogId, userId }); // Ensure using the correct model

    // Respond with like status
    res.status(200).json({ lc: !!like }); // Return true if like exists, otherwise false
  } catch (error) {
    console.error('Error checking like status:', error);
    res.status(500).json({ message: 'Error checking like status', error: error.message });
  }
});


app.post('/mark-delivered/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    // Find the order by ID and update the delivered status
    const updatedOrder = await OrderHistory.findByIdAndUpdate(
      orderId,
      { delivered: true }, // Assuming your Order model has a `delivered` field
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.status(200).json({ message: 'Order marked as delivered.', data: updatedOrder });
  } catch (error) {
    console.error('Error marking order as delivered:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

app.delete('/delete-order/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    // Find and delete the order by ID
    const deletedOrder = await OrderHistory.findByIdAndDelete(orderId);

    // Check if the order was found and deleted
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Send success response
    res.status(200).json({ message: 'Order deleted successfully.', data: deletedOrder });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Error deleting order. Please try again later.' });
  }
});

app.delete('/reviews/:reviewId', async (req, res) => {
  const { reviewId } = req.params;

  try {
    // Attempt to delete the review by its ID
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    // Check if the review was found and deleted
    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    // Send a success response
    res.status(200).json({ message: 'Review deleted successfully.', data: deletedReview });
  } catch (error) {
    // Log error and send an error response
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review. Please try again later.' });
  }
});

app.listen(5001, () => {
  console.log("Server started on port 5001");
});

// app.post("/forgot-password", async(req,res)=>{
//   const {email} = req.body;
//   try{
//     const oldUser = await User.findOne({email});
//     if(!oldUser){
//       return res.send("User Doesn't Exists!!");
//     }
//     const secret = JWT_SECRET + oldUser.password;
//     const token = jwt.sign({email: oldUser.email, id: oldUser._id}, secret, {expiresIn:'5m'});
//     const link = `http://192.168.0.106:5001/reset-password/${oldUser._id}/${token}`;
//     console.log(link);
//   }catch(error){

//   }
// });

// app.get('/reset-password', async (req,res)=>{
//   const {id, token} = req.params;
//   console.log(req.params);
// })