
const express = require('express');
const router = express.Router();
const BlogPost = require('../models/blog-post-model');
const UsersDB = require('../models/users');
const moment = require('moment');


router.post('/user', async (req, res) => {

    let userRegistered, newUser;

    let user = {
        socialID: req.body.socialID,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar,
        comment: req.body.comment,
    }
    // new UsersDB({})

    // *** Find by user by its social media ID
    const userFound = await UsersDB
        .find({ socialID: user.socialID })
        .then(user => user)
        .catch(() => { res.status(500).json({ error: "No found" }); });

    // *** If user does not exist register as new user

    let userCreated;
    if (userFound.length <= 0) {
        userCreated = await UsersDB
            .create(user)
            .then(freshUser => userCreated = freshUser)
            .catch(() => { res.status(500).json({ error: "Duplicate entry error" }) });
    }

    // *** Set the new comment into format
    const userID = userFound ? userFound[0].id : userCreated[0].id;

    userPayload = { ...user, ...{ id: userID } }

    // *** Stop continious messages by users
    let shouldIStopTheAttack;
    await BlogPost
        .find({ slug: req.body.slug })
        .then(post => {
            try {
                post[0].comment.filter(comment => {
                    if (userID == comment.id) {
                        let currentDate = moment().format('LLLL');
                        let TwentyminutesLates = moment(comment.date).add(20, 'minutes').format('LLLL');
                        if (TwentyminutesLates < currentDate) { shouldIStopTheAttack = true }
                    }
                })
            } catch (error) {
                console.log('NOTHING');

            }

        }).catch(() => { return res.status(500).json({ error: "Duplicate entry error" }) });

    // *** Stop attack if any
    // if (shouldIStopTheAttack) {
    //     return res.json({ ok: false, message: `For security reasons you canonly post every 15 minutes you can still try later` })
    //     return
    // }

    console.log("***************************************", req.body.slug, userPayload);

    postComment = {
        id: userPayload.id,
        comment: userPayload.comment,
    }
    // return res.json({ ok: true, userPayload })
    // *** Succesfully create the comment
    BlogPost
        .findOneAndUpdate({ slug: req.body.slug }, { "$push": { "comment": userPayload } })
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