'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//schema
const BlogUsers = mongoose.Schema({
    socialID: { type: String, unique: true },
    firstName: String,
    lastName: String,
    email: String,
    avatar: String,
});

const UsersDB = mongoose.model('BlogUsers', BlogUsers);

module.exports = UsersDB;