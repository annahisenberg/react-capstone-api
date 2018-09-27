'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//schema
const blogPostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    tags: Array,
    date: {
        type: Date,
        default: Date.now
    },
    author: String,
    category: String,
    likes: Number,
    image: String,
    comments: {
        body: String,
        date: Date,
        username: String
    },
    slug: String
});

// blogPostSchema.methods.slugify = function() {
//     this.slug = slug(this.title)
// }

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;