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
            console.error(err);
            res.status(500).json({
                error: 'something went wrong'
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
            console.lerror(err);
            res.status(500).json({
                error: 'something went wrong'
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
            console.error(err);
            res.status(500).json({
                error: 'Something went wrong'
            });
        })
});

//update post
router.put('/posts/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        return res.status(400).json({
            error: 'Request path id and request body id values must match.'
        });
    }

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
            res.status(200).json({
                message: 'You successfully updated your post.'
            });
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

            }
        })
});

module.exports = router;