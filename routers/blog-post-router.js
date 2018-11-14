const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blog-post-model');
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });


//get all posts
router.get('/:posts/:increaseLimit?', (req, res) => {
    const { posts } = req.params;
    let increaseLimit = req.params.increaseLimit;
    let find = {}
    console.log(posts);

    // @TODO: Adjust the searchbar
    if (posts !== ' ') {
        find = { category: posts }
    }
    console.log('FIND', find, posts);


    BlogPost
        .find(find)
        .sort({ 'date': -1 })
        .limit(Number(increaseLimit))
        .then(posts => {
            res.json(posts);
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
});

// GET SINGLE POST
router.get('/posts/post/:slug', (req, res) => {
    const { slug } = req.params;
    console.log(slug);

    BlogPost
        .findOne({ seoUrl: slug })
        .then(post => {
            if (!post) {
                return Promise.reject(new Error('Blog post not found'));
            }
            return post;
        })
        .then(post => res.json(post))
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
});

//create new post
router.post('/posts', jwtAuth, (req, res) => {
    const payload = {
        title: req.body.title,
        body: req.body.body,
        category: req.body.category.toLowerCase(),
        bucket: req.body.seoUrl.toLowerCase(),
        seoUrl: req.body.seoUrl.toLowerCase(),
        metaDescription: req.body.metaDescription,
        // tags: req.body.tags.split(',').map(t => t.trim()),
        image: req.body.image
    }

    BlogPost
        .create(payload)
        .then(newPost => res.status(201).json(newPost))
        .catch(() => {
            res.status(500).json({
                error: "Duplicate entry error"
            });
        });
});

//update post
router.put('/posts/post/:slug', jwtAuth, (req, res) => {
    const updated = {};
    const updateableFields = [
        'title',
        'body',
        'tags',
        'seoUrl',
        'date',
        'image',
        'metaDescription'
    ];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    if (typeof updated.tags == 'string') {
        updated.tags = updated.tags.split(',').map(t => t.trim());
    }


    BlogPost
        .findOneAndUpdate({ slug: req.params.slug }, { $set: updated }, { new: true })
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
router.delete('/posts/post/:slug', jwtAuth, (req, res) => {
    const { slug } = req.params;

    BlogPost
        .findOneAndDelete({ slug })
        .then(count => {
            if (count) {
                res.status(200).end();
            } else {
                //do something
            }
        })
});

module.exports = router;