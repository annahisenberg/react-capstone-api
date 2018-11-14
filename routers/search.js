const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blog-post-model');
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });

function queryTitleTagCategory(section, searchTerm) {
    // return new Promise((resolve, reject) => {
    return BlogPost.find({ [section]: searchTerm }, 'title category image seoUrl')
        .sort({ 'date': -1 })
        .then(el => el)
        .catch(err => err)
}

//get all posts
router.get('/:term', (req, res) => {
    const { term } = req.params;
    let searchTerm = new RegExp(term, 'i')

    // queryTitleTagCategory('title', searchTerm)

    Promise.all([
        // queryTitleTagCategory('title', searchTerm),
        queryTitleTagCategory('category', searchTerm),
        queryTitleTagCategory('tags', searchTerm)
    ]).then(posts => {

        res.json({
            category: posts[0],
            tags: posts[1],
        });
    })
        .catch(err => {
            res.status(500).json({
                error: err.message,

            });
        });
});


module.exports = router;