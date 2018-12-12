'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slugify = require('slugify');
const Schema = mongoose.Schema;

//schema
const blogPostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    tags: [String],
    date: {
        type: Date,
        default: Date.now
    },
    author: {
        type: String,
        default: "Annah Isenberg"
    },
    likes: Number,
    image: String,
    published: { type: Boolean, default: false },
    bucket: String,
    seoUrl: String,
    metaDescription: String,
    comment: [
        {
            id: { type: Schema.Types.ObjectId, ref: 'UsersDB' },
            comment: String,
            date: { type: Date, default: Date.now },
        }
    ],
    comments: [{
        body: String,
        date: { type: Date, default: Date.now },
        id: String,
        username: String,
        publish: { type: Boolean, default: false },
    }],
    slug: {
        type: String,
        required: true,
        unique: true
    }
});

blogPostSchema.methods.slugify = function () {
    this.slug = slugify(this.title, {
        lower: true
    });
}

blogPostSchema.pre('validate', function (next) {
    this.lowercaseTags();
    this.slugify();
    next();
});

blogPostSchema.methods.lowercaseTags = function () {
    this.tags = this.tags.map(tag => tag.toLowerCase());
}

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;