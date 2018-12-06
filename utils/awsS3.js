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


const upload = () => {
    return multer({
        storage: multerS3({
            s3: s3,
            bucket: CONFIG.BUCKET_NAME,
            acl: 'public-read',
            contentType: multerS3.AUTO_CONTENT_TYPE,
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
                console.log("IMAGE", req.params);

                const { folder } = req.params;
                cb(null, `img/${folder}/${file.originalname}`)
            }
        })
    });

}

module.exports = upload