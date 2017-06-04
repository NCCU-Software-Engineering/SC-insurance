var nodemailer = require('nodemailer');
var credentials = require("./credentials.js")

var mailTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: credentials.gmail.user,
        pass: credentials.gmail.password,
    }
});

module.exports = mailTransport;