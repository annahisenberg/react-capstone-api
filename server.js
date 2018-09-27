const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { DATABASE_URL, PORT } = require('./config');
const blogPostRouter = require('./routers/blog-post-router');
const BlogPost = require('./models/blog-post-model');
const bodyParser = require('body-parser');
const passport = require('passport');
const { localStrategy, jwtStrategy } = require('./auth/strategies');

const cors = require('cors');
const { CLIENT_ORIGIN } = require('./config');

//middleware
app.use(bodyParser.json());
app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

passport.use(localStrategy);
passport.use(jwtStrategy);

// app.use(express.urlencoded({ extended: true }));



// Routes
app.use('/api', blogPostRouter);



app.get('/api/*', (req, res) => {
    res.json({ ok: true });
});


// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer() {
    return new Promise((resolve, reject) => {
        mongoose.connect(DATABASE_URL, { useNewUrlParser: true }, err => {
            if (err) {
                return reject(err);
            }
            server = app
                .listen(PORT, () => {
                    console.log(`Your app is listening on port ${PORT}`);
                    resolve();
                })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };

