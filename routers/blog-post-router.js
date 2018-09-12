const express = require('express');
const router = express.Router();

router.get('/posts', (req, res) => {
    //get all posts
});

router.get('/posts/:id', (req, res) => {
    //get post by specific id
});

router.post('/posts', (req, res) => {
    //create new post
});

router.put('/posts/:id', (req, res) => {
    //update post
});

router.delete('/posts/:id', (req, res) => {
    //delete post 
});

module.exports = router;