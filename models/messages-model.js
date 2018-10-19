'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const contactMessageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address']
    },
    message: {
        type: String,
        required: true
    }
});

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);


function validateEmail(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}

module.exports = ContactMessage;