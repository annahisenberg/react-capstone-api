'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const AdminSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const Admin = mongoose.model('Admin', AdminSchema);

//validatePassword method

module.exports = Admin;