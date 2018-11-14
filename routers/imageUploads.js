const express = require('express');
const router = express.Router();
// const BlogPost = require('../models/blog-post-model');
// const passport = require('passport');


const AWS = require('aws-sdk');
const CONFIG = require('../config');
const multer = require('multer');
const multerS3 = require('multer-s3');

const awsCredentials = new AWS.Config({
    secretAccessKey: CONFIG.SECRET_KEY,
    accessKeyId: CONFIG.ACCESS_KEY,
    region: 'us-east-1'
});

var s3 = new AWS.S3(awsCredentials);

// Add image to s3
router.post('/:folderPost', (req, res) => {


    let upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: 'livingwithannah',
            acl: 'public-read',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
                const { folderPost } = req.params;
                console.log(folderPost);

                cb(null, `${folderPost}/${file.originalname}`)
            }
        })
    });


    upload.single('image')(req, res, function (err, some) {
        if (err) {
            return res.status(422).send({ errors: [{ title: 'Image Upload Error', detail: err.message }] });
        }
        // console.log('Successful ', req.file);

        return res.json({ 'imageUrl': req.file });
    });

});

router.get('/:folder', (req, res) => {
    const { folder } = req.params;

    var params = {
        Bucket: 'livingwithannah',
        Prefix: `${folder}`
    };

    s3.listObjectsV2(params, function (err, data) {
        if (err) {
            return res.send({ "error": err });
        }
        res.send({ data });
    });
});

router.delete('/:folder/:fileToDelete', (req, res) => {

    const { fileToDelete } = req.params;
    const { folder } = req.params;
    // console.log(req.body.fileToDelete);
    console.log(req.body);
    console.log(`${folder}/${fileToDelete}`);

    s3.deleteObject({
        Bucket: 'livingwithannah',
        Key: `${folder}/${fileToDelete}`
    }, function (err, data) {
        if (err) {
            return res.json({ 'err': err });
        }
        console.log("DELETED!!! ");

        res.json({
            'success': 'Deleted!', path: `${folder}/${fileToDelete}`
        });
    })
});

module.exports = router;