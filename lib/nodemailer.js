var nodemailer = require('nodemailer');

var mailTransport = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
        user: 'gramr@gmail.com',
        pass: '123456',
    }
});