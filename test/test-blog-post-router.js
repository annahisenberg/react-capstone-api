'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const should = chai.should();
const faker = require('faker');
const jwt = require('jsonwebtoken');

const BlogPost = require('../models/blog-post-model');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');

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

function generateUserData() {
    return {
        username: faker.lorem.word(),
        password: faker.lorem.word()
    }
}

function generateBlogPostData() {
    return {
        title: faker.lorem.word(),
        body: faker.lorem.paragraph(),
        tags: faker.lorem.words(),
        date: faker.date.recent(),
        image: faker.image.imageUrl(),
        slug: faker.lorem.word()
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

    // describe('GET /posts', function () {
    //     it('should return all existing blog posts', function () {
    //         return chai.request(app)
    //             .get('/api/posts')
    //             .then(res => {
    //                 res.should.have.status(200);
    //                 res.should.be.json;
    //                 res.body.should.be.a('array');
    //                 res.body.should.have.length(10);
    //                 res.body.forEach(item => {
    //                     item.should.be.a('object');
    //                     item.should.include.keys('__v', '_id', 'title', 'body', 'tags', 'date', 'slug', 'image');
    //                 });
    //             });
    //     });
    // });

    describe('GET /posts/:slug', function () {
        it('should return correct post when given a slug', function () {
            let post;
            return BlogPost.findOne()
                .then(_post => {
                    post = _post;
                    return chai.request(app).get(`/api/posts/post/${post.slug}`);
                })
                .then(res => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.an('object');
                    res.body.should.include.keys('__v', '_id', 'title', 'body', 'tags', 'date', 'slug', 'image');
                    res.body.slug.should.equal(post.slug);
                });
        });
    });

    describe('POST /posts', function () {
        it('should create and return a new post when provided valid data', function () {
            let user = generateUserData();
            const token = jwt.sign({ user }, JWT_SECRET);
            const newPost = generateBlogPostData();

            return chai.request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${token}`)
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

    // describe('PUT /posts/:slug', function () {
    //     it('should update item when given valid data and an id', function () {
    //         let user = generateUserData();
    //         const token = jwt.sign({ user }, JWT_SECRET);

    //         const updatedTitle = {
    //             'title': 'Why you need to replace your kitchen sponge every week'
    //         };

    //         return BlogPost
    //             .findOne()
    //             .then(doc => {
    //                 return chai.request(app)
    //                     .put(`/api/posts/post/${doc.slug}`)
    //                     .set('Authorization', `Bearer ${token}`)
    //                     .send(updatedTitle);
    //             })
    //             .then(res => {
    //                 res.should.have.status(200);
    //                 res.should.be.json;
    //                 res.body.should.be.a('object');
    //                 res.body.title.should.equal(updatedTitle.title);
    //             });
    //     });
    // });

    // describe('DELETE /posts/:slug', function () {
    //     it('should delete a post by id', function () {
    //         let user = generateUserData();
    //         const token = jwt.sign({ user }, JWT_SECRET);
    //         return BlogPost
    //             .findOne()
    //             .then(post => {
    //                 return chai.request(app)
    //                     .delete(`/api/posts/post/${post.slug}`)
    //                     .set('Authorization', `Bearer ${token}`)
    //             })
    //             .then(res => {
    //                 res.should.have.status(204);
    //             });
    //     });
    // });
});