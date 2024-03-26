const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true, // Removes whitespace from both ends of a string
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically sets to current date and time
    },
    // You can add more fields such as 'author', 'tags', etc., as needed
});

module.exports = mongoose.model('Blog', blogSchema);