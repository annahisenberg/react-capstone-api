
const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blog-post-model');
const UsersDB = require('../models/users');
const moment = require('moment');


router.post('/user', async (req, res) => {

    let user = {
        socialID: req.body.socialID,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar,
        comment: req.body.comment,
    }

    let userID = "";

    // *** Find by user by its social media ID

    await UsersDB
        .find({ socialID: user.socialID })
        .then(user => { userID = user ? user[0].id : null })
        .catch(() => { console.log('Not found') });

    // *** If user does not exist register as new user

    if (!userID) {
        console.log("CREATE USER");
        await UsersDB
            .create(user)
            .then(freshUser => userID = freshUser ? freshUser[0].id : null)
            .catch(() => { res.status(500).json({ error: "Duplicate entry error" }) });
    }

    // *** Stop continious messages by users
    let shouldIStopTheAttack;
    await BlogPost
        .find({ slug: req.body.slug })
        .then(post => {
            if (post) {
                post[0].comment.filter(comment => {
                    if (userID == comment.id) {
                        let currentDate = moment().format('LLLL');
                        // TODO SET 0 - 5 minutes
                        let TwentyminutesLates = moment(comment.date).add(0, 'minutes').format('LLLL');
                        if (TwentyminutesLates > currentDate) { return shouldIStopTheAttack = true }
                    }
                })
            }
        }).catch(() => { return res.status(500).json({ error: "Error when trying to filter dates" }) });

    // *** Stop attack if any
    if (shouldIStopTheAttack) {
        return res.status(500).json({ ok: false, message: `For security reasons you canonly post every 5 minutes you can still try later` })
    }

    postComment = {
        id: userID,
        comment: user.comment,
    }

    // *** Succesfully create the comment
    return BlogPost
        .findOneAndUpdate({ slug: req.body.slug }, { "$push": { "comment": postComment } })
        .then(updatedPost => {
            return res.status(200).json(updatedPost);
        })
        .catch(err => {
            res.status(500).json({
                message: 'There is an error with updating your post.'
            });
        });

})


module.exports = router;