'use strict';
const bcrypt = require('bcryptjs');
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

//validatePassword method
AdminSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
}

//hash password method
AdminSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
}

const Admin = mongoose.model('Admin', AdminSchema);




module.exports = Admin;