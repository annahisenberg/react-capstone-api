'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const should = chai.should();
const faker = require('faker');

const BlogPost = require('../models/blog-post-model');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function seedBlogPostData() {
    console.info('seeding blog post data');
    const seedData = [];

    for (let i = 1; i <= 3; i++) {
        seedData.push(generateBlogPostData());
    }
    //this will return a promise
    return BlogPost.insertMany(seedData);
}

function generateBlogPostData() {
    return {
        title: faker.lorem.word(),
        body: faker.lorem.paragraph(),
        tags: [faker.lorem.word(), "random tag"],
        date: faker.date.recent(),
        image: faker.image.imageUrl()
    }
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('tags', function () {
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function () {
        return seedBlogPostData();
    });

    afterEach(function () {
        return tearDownDb();
    });

    after(function () {
        return closeServer();
    });

    describe.only('GET /tags', function () {
        it('should return all existing tags', function () {
            return chai.request(app)
                .get('/api/tags')
                .then(res => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.should.have.length(4);
                    res.body.forEach(item => {
                        item.should.be.a('string');
                    });
                });
        });

        it('should return all blog posts with the same tag', function () {

        });
    });
});