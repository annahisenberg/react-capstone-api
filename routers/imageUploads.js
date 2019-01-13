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



// Create JSON and save to s3
router.post('/create', (req, res) => {

    var person = {
        name: 'Update',
        age: "DONE!"
    };

    const params = {
        Bucket: `${CONFIG.BUCKET_NAME}`,
        Key: 'img/contacts.json', // file will be saved as testBucket/contacts.csv
        Body: JSON.stringify(person),
    };

    return s3.upload(params, function (s3Err, data) {
        console.log('DATAL ', data);
        if (s3Err) throw s3Err
        console.log(`File uploaded successfully at ${data.Location}`)
        res.json({ ok: true, data })
    });

});

// Add image to s3
router.post('/:folderPost', (req, res) => {

    let upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: `${CONFIG.BUCKET_NAME}`,
            acl: 'public-read',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
                const { folderPost } = req.params;
                console.log('UPLOADIMAGE', folderPost);
                cb(null, `img/${folderPost}/${file.originalname}`)
            }
        })
    });

    upload.single('image')(req, res, function (err, some) {
        if (err) {
            return res.status(422).send({ errors: [{ title: 'Image Upload Error', detail: err.message }] });
        }
        return res.json({ 'imageUrl': req.file });
    });

});

router.get('/:folder', (req, res) => {
    const { folder } = req.params;

    var params = {
        Bucket: `${CONFIG.BUCKET_NAME}`,
        Prefix: `img/${folder}/`
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
    // console.log(`${folder}/${fileToDelete}`);
    s3.deleteObject({
        Bucket: `${CONFIG.BUCKET_NAME}/img`,
        Key: `${folder}/${fileToDelete}`
    }, function (err, data) {
        if (err) {
            return res.json({ 'err': err });
        }
        res.json({
            'success': 'Deleted!',
            path: `${folder}/${fileToDelete}`,
            data
        });
    })
});

module.exports = router;