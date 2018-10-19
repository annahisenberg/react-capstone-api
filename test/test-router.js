'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const should = require('chai').should();
const faker = require('faker');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const Admin = require('../models/admin-model');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');

chai.use(chaiHttp);

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Auth router API', function () {
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });

    describe('POST request for /signup', function () {
        it('should create a new user in the database', function () {
            let newUser = {
                username: 'annah20',
                password: 'annah20'
            };

            return chai.request(app)
                .post('/api/signup')
                .send(newUser)
                .then(res => {
                    res.should.have.status(201);
                    res.should.be.json;
                });
        });
    });
});