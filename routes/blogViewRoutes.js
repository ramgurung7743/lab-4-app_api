const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');

// Ensure this is the only GET /blogList handler in your application
router.get('/blogList', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ modifiedDate: -1 }); // Assuming Blog is your Mongoose model
    res.render('blogList', { blogs: blogs }); // Make sure this is correct
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: error });
  }
});

// POST to add a new blog post
router.post('/blogAdd', async (req, res) => {
  try {
    const { title, content } = req.body; // Destructuring to get title and content
    if(!title || !content) {
      // Handle missing fields
      throw new Error('Title and content are required');
    }
    const newBlog = new Blog({ title, content });
    await newBlog.save();
    res.redirect('/blogList');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding blog post');
  }
});
module.exports = router;
