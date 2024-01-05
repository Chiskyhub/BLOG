const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blogs');



// Express app
const app = express();

const dbURL = 'mongodb+srv://lateef:hamzat123@tuts.c6jmnpj.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(dbURL)
.then(() => {
  app.listen(9000,  () => {
    console.log('server is listening on port 9000');
  });
})
.catch((err) => {
  console.error('error connecting to mongoDB:', err);
});


//view engine
app.set('view engine', 'ejs');
// Middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title:  'About' });
});

app.get('/blogs', (req, res) => {
  Blog.find().sort({ createdAt: -1 })
  .then((result) => {
    res.render('index', { title: 'All Blogs', blogs: result });
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Internal Server Error');
  });
});

app.post('/blogs', (req, res) => {
  const blog = new Blog(req.body);

  blog.save()
  .then(() => {
   res. redirect('/blogs');
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Internal Server Error');
  });
});

// Render create blog page
app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new Blog' });
});

app.get('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
  .then(result => {
    res.render('details', { blog: result, title:' Blog Details'});
  })
  .catch((err) => {
    console.log(err);
  })
});

// deleting blog
app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id)
  .then(result => {
    res.json({ redirect: '/blogs' });
  })
  .catch(err => {
    console.log(err);
  });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: 'page not found' });
});
