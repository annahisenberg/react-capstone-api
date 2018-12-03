'use strict';

require('dotenv').config();

module.exports = {
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    MONGOURL: process.env.MONGO_URL,
    DATABASE_URL: ' ',
    TEST_DATABASE_URL: ' ',
    PORT: 4000,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
    ACCESS_KEY: process.env.ACCESS_KEY,
    SECRET_KEY: process.env.SECRET_KEY
};