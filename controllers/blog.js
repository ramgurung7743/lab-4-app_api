const express = require('express');
const router = express.Router();
const Blog = require('../models/blog'); // Adjust the path to your Blog model

// Updated /list route to fetch blogs from the database
router.get('/list', async (req, res) => {
  try {
    // Use the Blog model to find all blog entries in the database
    const blogs = await Blog.find();
    // Render the blogList view, passing in the title and the blogs data
    res.render('blogList', { title: 'Blog List', blogs: blogs });
  } catch (error) {
    // Log the error to the console for debugging purposes
    console.error('Error fetching blogs:', error);
    // Render an error view, passing in the error details
    // Make sure you have an error.ejs or equivalent view file to handle this
    res.status(500).render('error', { error: { message: "An error occurred while fetching the blogs." } });
  }
});

// Keep the /add route as is to serve the form for adding a blog
router.get('/add', (req, res) => {
  res.render('blogAdd', { title: 'Add Blog' });
});

// Route to handle POST request for adding a blog
router.post('/add', async (req, res) => {
  // Destructure title and content from the request body
  const { title, content } = req.body;

  // Basic validation to check if title and content are provided
  if (!title || !content) {
    // If validation fails, return a 400 response with an error message
    return res.status(400).render('error', { error: { message: 'Title and content are required.' } });
  }

  try {
    // Create a new blog post using the Blog model with the provided title and content
    const newBlog = new Blog({ title, content });
    // Save the new blog post to the database
    await newBlog.save();
    // After successful addition, redirect the user to the blog list page
    res.redirect('/list');
  } catch (error) {
    // Log the error to the console and return a 500 response with an error message
    console.error('Error adding blog:', error);
    res.status(500).render('error', { error });
  }
});


module.exports = router;