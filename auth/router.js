'use strict';

const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin-model');

const config = require('../config');
const router = express.Router();

//this creates the auth token with a digital signature
const createAuthToken = function (user) {
    return jwt.sign({ user }, config.JWT_SECRET, {
        subject: user.username,
        expiresIn: config.JWT_EXPIRY,
        algorithm: 'HS256'
    });
}

const localAuth = passport.authenticate('local', { session: false });
const jwtAuth = passport.authenticate('jwt', { session: false });

router.use(bodyParser.json());

//create new admin user
router.post('/signup', (req, res) => {
    const { username, password } = req.body;

    return Admin
        .findOne({ username })
        .then(_user => {
            console.log("user", _user);

            if (_user) {
                //there is already an existing user w/ the same username in DB
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Username already taken',
                    location: 'username'
                });
            }
            //If there is no existing user, hash the password
            return Admin.hashPassword(password);
        })
        .then(hash => {
            return Admin.create({
                username,
                password: hash
            });
        })
        .then(newUser => {
            return res.status(201).json(newUser);
        })
        .catch(err => {
            if (err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            res.status(500).json({ code: 500, message: 'Internal server error' });
        });
});

//login admin 
router.post('/login', localAuth, (req, res) => {
    const authToken = createAuthToken(req.user); //where is "user" coming from here??
    res.json({ authToken });
});


// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({ authToken });
});

module.exports = router;
