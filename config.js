'use strict';

module.exports = {
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost/blog_capstone_db',
    PORT: process.env.PORT || 4000
};