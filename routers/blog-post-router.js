const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blog-post-model');

//get all posts
router.get('/posts', (req, res) => {
    BlogPost
        .find()
        .then(posts => {
            res.json(posts);
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
});

//get post by specific id
router.get('/posts/:id', (req, res) => {
    const { id } = req.params;

    BlogPost
        .findById(id)
        .then(post => res.json(post))
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });

});

//create new post
router.post('/posts', (req, res) => {
    const payload = {
        title: req.body.title,
        body: req.body.body,
        tags: req.body.tags,
        date: req.body.date,
        author: req.body.author,
        category: req.body.category,
        image: req.body.image
    }


    BlogPost
        .create(payload)
        .then(newPost => res.status(201).json(newPost))
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        })
});

//update post
router.put('/posts/:id', (req, res) => {
    const updated = {};
    const updateableFields = [
        'title',
        'body',
        'tags',
        'date',
        'author',
        'category',
        'image'
    ];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    BlogPost
        .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
        .then(updatedPost => {
            res.status(200).json(updatedPost);
        })
        .catch(err => {
            res.status(500).json({
                message: 'There is an error with updating your post.'
            });
        });
});

//delete post 
router.delete('/posts/:id', (req, res) => {
    const { id } = req.params;

    BlogPost
        .findOneAndDelete(id)
        .then(count => {
            if (count) {
                res.status(204).end();
            } else {
                //do something
            }
        })
});

module.exports = router;