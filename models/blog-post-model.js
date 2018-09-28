'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slugify = require('slugify');

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
    author: {
        type: String,
        default: "Annah Isenberg"
    },
    category: String,
    likes: Number,
    image: String,
    comments: {
        body: String,
        date: Date,
        username: String
    },
    slug: {
        type: String,
        required: true
    }
});

blogPostSchema.methods.slugify = function () {
    this.slug = slugify(this.title, {
        lower: true
    });
}

blogPostSchema.pre('validate', function (next) {
    this.slugify();
    next();
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;