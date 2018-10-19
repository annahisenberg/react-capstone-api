const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blog-post-model');

router.get('/tags', (req, res) => {
    BlogPost
        .distinct("tags")
        .then(tags => {
            res.json(tags)
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
});

router.get('/tags/:tag', (req, res) => {
    if (!req.params.tag) {
        return res.json('Tag is required');
    }

    const { tag } = req.params;

    BlogPost
        .find({ "tags": tag.toLowerCase() })
        .then(tags => res.json(tags))
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
});

module.exports = router;