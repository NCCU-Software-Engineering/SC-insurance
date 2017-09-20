var nodemailer = require('nodemailer');
var credentials = require("./credentials.js")
var request = require('request');

var mailTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: credentials.gmail.user,
        pass: credentials.gmail.password,
    }
});

function email(target, subject, text) {
    mailTransport.sendMail({
        from: '正大人壽網路投保中心',
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

function confirmEmail(email, policy){
    let content = ''
    content += '親愛的會員您好\n'
    content += '感謝您購買本公司利率變動型年金保險\n\n'
    content += '您的保單內容如下：\n'
    content += '保險名稱：' + policy.alias + '\n'
    content += '保險金額：' + policy.payment + '以太幣\n'
    content += '保險時間：' + policy.paymentDate + '年\n'
    content += '身故受益人：' + policy.deathBeneficiary + '\n'
    content += '身故受益人關係：' + policy.deathBeneficiaryRelationship + '\n'
    content += '身故受益人身分證：' + policy.deathBeneficiaryIdentity + '\n'
    content += '保單對應智能合約地址：' + req.query.address + '\n'
    content += '如需查看JSON介面，請前往 http://localhost:50000/data/json' + '\n'
    content += '請前往  http://localhost:50000/confirm?address=' + req.query.address + '&id=' + req.session.user_ID + '  正式啟用合約\n'
    content += '啟用合約後您將享有10天無條件契約撤銷權利'

    email(email, '正大人壽網路投保電子保單付款成功通知', content)
}

function revocationPeriodEmail(email, policy, myDate) {
    let content = ''
    content += '親愛的會員您好\n'
    content += '感謝您購買本公司利率變動型年金保險\n\n'
    content += '您的保單內容如下：\n'
    content += '保險名稱：' + policy.alias + '\n'
    content += '保險金額：' + policy.payment + '以太幣\n'
    content += '保險時間：' + policy.paymentDate + '年\n'
    content += '身故受益人：' + policy.deathBeneficiary + '\n'
    content += '身故受益人關係：' + policy.deathBeneficiaryRelationship + '\n'
    content += '身故受益人身分證：' + policy.deathBeneficiaryIdentity + '\n'
    content += '根據本契約，於簽收保單後十日內得撤銷本契約，本公司將無息返還保險費。如於' + myDate.getFullYear() + '年' + (myDate.getMonth() + 1) + '月' + myDate.getDate() + '日時前，要執行本權利，請點擊以下\n'
    content += 'http://localhost:50000/revoke?address=' + req.query.address + '&id=' + req.query.id

    send.email(email, '正大人壽網路投保電子保單契約撤銷期通知', content)
}

module.exports = {
    confirmEmail: confirmEmail,
    revocationPeriodEmail: revocationPeriodEmail
}