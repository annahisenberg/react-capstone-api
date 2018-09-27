'use strict';

require('dotenv').config();

module.exports = {
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost/blog_capstone_db',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'mongodb://localhost/test_blog_capstone_db',
    PORT: process.env.PORT || 4000,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY || '7d'
};