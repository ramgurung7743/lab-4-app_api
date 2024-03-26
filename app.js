require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var debug = require('debug')('app');
const mongoose = require('mongoose');

const encodedPassword = encodeURIComponent('Yonjan@2');
mongoose.connect(`mongodb://userRam:${encodedPassword}@localhost:27017/admin`)
.then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});



var indexRouter = require('./routes/index');
// const connectDB = require('./database'); // Adjust the path as necessary

var app = express();
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Routes
app.use('/', indexRouter);
const blogApiRoutes = require('./routes/blogApiRoutes'); // Adjust the path as necessary
const blogViewRoutes = require('./routes/blogViewRoutes'); // Adjust the path as necessary

const blogRouter = require('./controllers/blog'); // Adjust the path as necessary

app.use('/', blogRouter);
app.use('/api', blogApiRoutes);
app.use('/', blogViewRoutes);

app.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find(); // Fetch blogs to be displayed on the homepage
    res.render('home', { blogs: blogs });
  } catch (error) {
    console.error(error);
    res.send("Error loading home page");
  }
});

app.get('/blogList', async (req, res) => {
  try {
      const blogs = await Blog.find(); // Replace with your actual method to retrieve blogs
      res.render('blogList', { title: 'Blog List', blogs: blogs });
  } catch (error) {
      res.status(500).send(error.message);
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { 
        error: {
            status: err.status || 500,
            message: err.message,
            error: err
        }
    });
});

module.exports = app;
