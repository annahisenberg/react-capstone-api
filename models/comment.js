'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const markDownPost = mongoose.Schema({
    post: {
        type: String,
        required: true
    },
    comments: [
        {
            socialID: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            },
            comment: {
                type: String,
                required: true
            },
            avatar: {
                type: String,
                required: true
            }
        }
    ]
});

const ContactMessage = mongoose.model('markDownPost', markDownPost);

module.exports = ContactMessage;