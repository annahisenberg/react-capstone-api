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

    for (let i = 1; i <= 10; i++) {
        seedData.push(generateBlogPostData());
    }
    //this will return a promise
    return BlogPost.insertMany(seedData);
}

function generateBlogPostData() {
    return {
        title: faker.lorem.word(),
        body: faker.lorem.paragraph(),
        tags: faker.lorem.words(),
        date: faker.date.recent(),
        author: faker.name.firstName(),
        category: faker.lorem.word(),
        image: faker.image.imageUrl()
    }
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('BlogPost API', function () {
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

    describe('GET /posts', function () {
        it('should return all existing blog posts', function () {
            return chai.request(app)
                .get('/api/posts')
                .then(res => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.should.have.length(10);
                    res.body.forEach(item => {
                        item.should.be.a('object');
                        item.should.include.keys('__v', '_id', 'title', 'body', 'tags', 'date', 'author', 'category', 'image');
                    });
                });
        });
    });

    describe('GET /posts/:id', function () {
        it('should return correct post when given an id', function () {
            let post;
            return BlogPost.findOne()
                .then(_post => {
                    post = _post;
                    return chai.request(app).get(`/api/posts/${post._id}`);
                })
                .then(res => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.an('object');
                    res.body.should.include.keys('__v', '_id', 'title', 'body', 'tags', 'date', 'author', 'category', 'image');
                    res.body._id.should.equal(post.id);
                });
        });
    });

    describe('POST /posts', function () {
        it('should create and return a new post when provided valid data', function () {
            const newPost = {
                title: 'How to clean kitchen',
                body: 'blahblahblahblah'
            }

            return chai.request(app)
                .post('/api/posts')
                .send(newPost)
                .then(res => {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.include.keys('__v', '_id', 'title', 'body');
                    res.body.title.should.equal(newPost.title);
                    res.body.body.should.equal(newPost.body);
                });

        });
    });

    describe('PUT /posts/:id', function () {
        it.skip('requires authentication')

        it('should update item when given valid data and an id', function () {
            const updatedTitle = {
                'title': 'Why you need to replace your kitchen sponge every week'
            };

            return BlogPost.findOne()
                .then(doc => {
                    return chai.request(app).put(`/api/posts/${doc._id}`).send(updatedTitle);
                })
                .then(res => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.title.should.equal(updatedTitle.title);
                });
        });
    });

    describe('DELETE /posts/:id', function () {
        it('should delete a post by id', function () {
            return BlogPost.findOne()
                .then(post => {
                    return chai.request(app).delete(`/api/posts/${post._id}`)
                })
                .then(res => {
                    res.should.have.status(204);
                });
        });
    });
});