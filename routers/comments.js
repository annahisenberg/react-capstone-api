
const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blog-post-model');
const markDownPost = require('../models/comment');
const UsersDB = require('../models/users');
const moment = require('moment');

// ENDPOINT: http://localhost:4000/comments/all-comments
// params: location 

router.post('/all-comments', async (req, res) => {
    console.log(req.body.location);
    markDownPost
        .find({ post: req.body.location })
        .then(post => {
            if (post) {
                res.json({
                    post
                })
            }
        }).catch(() => { console.log('Error when trying to filter dates') });
})


router.post('/user', async (req, res) => {

    let user = {
        name: req.body.name,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        avatar: req.body.avatar,
        socialID: req.body.id,
        exp: req.body.exp,
        location: req.body.location,
        comment: req.body.comment
    }

    let userID = "";

    // *** Find by user by its social media ID


    await UsersDB
        .find({ socialID: user.socialID })
        .then(user => { userID = user })
        .catch(() => { console.log('Not found') });

    // *** If user does not exist register as new user


    if (!userID) {
        console.log("CREATE USER");
        await UsersDB
            .create({ ...user })
            .then(freshUser => userID = freshUser ? freshUser[0].id : null)
            .catch(() => { console.log('ERROR WHEN CREATING') });
    }

    // *** Stop continious messages by users
    let shouldIStopTheAttack = false;

    const value = await markDownPost
        .find({ post: user.location })
        .then(post => {
            if (post) {


                post[0].comments.filter(comment => {


                    if (user.socialID == comment.socialID) {

                        let currentDate = moment().format('LLLL');
                        // TODO SET 0 - 5 minutes
                        let TwentyminutesLates = moment(comment.date).add(0, 'minutes').format('LLLL');

                        console.log("•••••••••••••••••••••••••••••••••••", TwentyminutesLates < currentDate);

                        if (TwentyminutesLates < currentDate) { return shouldIStopTheAttack = true }
                    }
                })
            }
        }).catch(() => { console.log('Error when trying to filter dates') });

    console.log(value, shouldIStopTheAttack);

    // *** Stop attack if any
    if (shouldIStopTheAttack) {
        return res.status(500).json({ ok: false, message: `For security reasons you canonly post every 5 minutes you can still try later` })
    }

    let postComment = {
        socialID: user.socialID,
        name: user.name,
        comment: user.comment,
        avatar: user.avatar,
    }
    // console.log("postComment ************************ ", postComment);


    let createNewPost = false;

    // *** Succesfully create the comment
    await markDownPost
        .findOneAndUpdate({ post: user.location }, { "$push": { "comments": postComment } })
        .then(updatedPost => {
            // console.log("DONEE POSTING ", updatedPost);

            if (!updatedPost) {
                createNewPost = true
            }

            if (updatedPost) {
                return res.status(200).json({ ok: true, updatedPost });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'There is an error with updating your post.'
            });
        });

    if (createNewPost !== true) {
        return
    }

    let payload = {
        post: user.location,
        comments: [{ ...postComment }]
    }

    markDownPost
        .create(payload)
        .then(newPost => res.status(201).json(newPost))
        .catch(() => { res.status(500).json({ error: "Duplicate entry error" }); });
})


router.get('/all', async (req, res) => {
    return BlogPost
        .find({}, 'comment slug')
        .then(posts => {

            res.status(200).json({ ok: true, posts });
        })
        .catch(err => {
            res.status(500).json({
                message: 'There is an error with updating your post.'
            });
        });
})



module.exports = router;