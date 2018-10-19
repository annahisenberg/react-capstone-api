const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/messages-model');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    // host: 'smtp.gmail.com',
    // port: 587,
    auth: {
        user: 'annahisenberg@gmail.com',
        pass: 'Ai122090'
    }
});

router.post('/messages', (req, res) => {
    const payload = {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    }

    const message = new ContactMessage(payload)
    message.validate()
        .then(err => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            nodemailer.createTestAccount((err, account) => {
                if (err) {
                    console.error('Failed to create a testing account. ' + err.message);
                    return process.exit(1);
                }

                console.log('Credentials obtained, sending message...');

                // Message object
                let msg = {
                    from: `${message.name} <${message.email}>`,
                    to: 'annahisenberg@gmail.com',
                    subject: 'New email from contact form on blog',
                    text: message.message
                };

                transporter.sendMail(msg, (err, info) => {
                    if (err) {
                        console.log('Error occurred. ' + err.message);
                        return process.exit(1);
                    }
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    res.status(201).json({ message: 'Message sent: ' + info.messageId })
                });
            });
        }
        )
        .catch(() => {
            res.status(500).json({
                error: "There was an error with sending the message."
            });
        });
});

module.exports = router;