var mailTransport = require("./nodemailer.js")
var credentials = require("./credentials.js")
var request = require('request');

function email(target, subject, text) {

    console.log("發送電子郵件");

    mailTransport.sendMail({
        from: 'gramr@gmail.com',
        to: target,
        subject: subject,
        text: text
    }, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('訊息發送: ' + info.response);
        }
    });
}

function newsletter(phone, mbody) {

    console.log("發送簡訊");

    var option = "http://www.smsgo.com.tw/sms_gw/sendsms.aspx";
    option += "?username=" + credentials.sms.user;
    option += "&password=" + credentials.sms.password;
    option += "&encoding=:" + "BIG5";
    option += "&dstaddr=" + phone;
    option += "&smbody=" + encodeURI(mbody);

    //console.log(option);

    request({
        uri: option,
        method: 'GET',
    }, (error, res, body) => {
        if (error) {
            console.log(error);
        } else {
            console.log(body);
        }
    });
}

module.exports = {
    email: email,
    newsletter: newsletter
}