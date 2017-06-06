var mailTransport = require("./nodemailer.js")
var credentials = require("./credentials.js")
var request = require('request');

function email(cont, target) {

    mailTransport.sendMail({
        from: 'gramr@gmail.com',
        to: target,
        subject: 'confirm',
        text: cont
    }, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('訊息發送: ' + info.response);
        }
    });
}

function newsletter(phone, mbody) {

    var option = "http://www.smsgo.com.tw/sms_gw/sendsms.aspx";
    option += "?username=" + credentials.sms.user;
    option += "&password=" + credentials.sms.password;
    option += "&encoding=:" + "BIG5";
    option += "&dstaddr=" + phone;
    option += "&smbody=" + encodeURI(mbody);

    request({
        uri: option,
        method: 'GET',
    }, function (error, res, body) {
        console.log(body);
    });
}

module.exports = {
    email: email,
    newsletter: newsletter
}