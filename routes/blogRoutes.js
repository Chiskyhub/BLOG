const express = require('express');
const Blog = require('../models/blogs');
const router = express.Router();


router.get('/blogs', (req, res) => {
  Blog.find().sort({ createdAt: -1 })
  .then((result) => {
    res.render('index', { title: 'All Blogs', blogs: result });
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Internal Server Error');
  });
});

router.post('/blogs', (req, res) => {
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

router.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new Blog' });
});


router.get('/blogs/:id', (req, res) => {
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
router.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id)
  .then(result => {
    res.json({ redirect: '/blogs' });
  })
  .catch(err => {
    console.log(err);
  });
});

module.export = router;