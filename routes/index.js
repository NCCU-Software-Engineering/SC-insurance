var express = require('express')
var crypto = require('crypto')
var format = require('string-format')
var fs = require("fs")
var path = require('path')

var web3 = require('../library/web3.js')
var contract = require('../library/contract.js')
var mysql = require('../library/mysql.js')
var notice = require('../library/notice.js')

var router = express.Router()

mysql.connect()

var sign = async function (req, res, next) {
    if (req.session.user_ID && req.session.user_name) {
        next()
    }
    else {
        res.redirect('users/sign_in')
    }
}

//首頁
router.get('/', function (req, res, next) {
    res.render('index', { user_name: req.session.user_name })
})

//保費試算
router.get('/trial', function (req, res, next) {
    res.render('trial', { user_name: req.session.user_name })
})

//個人頁面
router.get('/personal', sign, function (req, res, next) {
    res.render('personal', { user_name: req.session.user_name })
})

//購買智能合約
router.get('/agreement', sign, async function (req, res, next) {
    let user = await mysql.getUserByID(req.session.user_ID)
    let age = getAge(user.birthday)
    res.render('agreement', { user_name: req.session.user_name, user_age: age.string, user_payment: (80 - age.iage) })
})

//選擇付款方式
router.get('/buy', sign, function (req, res, next) {
    res.render('buy', { user_name: req.session.user_name })
})

//付款頁面
router.get('/pay', sign, async function (req, res, next) {
    let user = await mysql.getUserByID(req.session.user_ID)
    res.render('pay', { user_name: req.session.user_name, account: user.account })
})

//智能合約 傳統合約 對照
router.get('/template', sign, function (req, res, next) {
    res.render('template', { user_name: req.session.user_name })
})

//智能合約 傳統合約 對照
router.get('/solidity', sign, function (req, res, next) {
    let fileName = path.join('contract', 'Annuity.sol')
    fs.readFile(fileName, 'utf8', function (error, data) {
        res.render('solidity', { user_name: req.session.user_name, solidity: data })
    })
})





//產生驗證碼
router.post('/createcode', function (req, res, next) {
    let randomString = crypto.randomBytes(32).toString('hex').substr(0, 8);
    mysql.setVerification(req.session.user_ID, randomString)
    let cont = "您的驗證碼為: " + randomString
    send.newsletter("0912254446", cont)

    res.send('done')
})

//驗證碼
router.post('/verify', function (req, res, next) {
    mysql.getVerification(req.session.user_ID, (result) => {
        if (req.body.code == result[0].verification) {
            mysql.setVerification(req.session.user_ID, 'true')
            res.send('success')
        }
        else {
            res.send('error')
        }
    })
})



function getAge(birthday) {
    let today = new Date();
    let result = {}
    let age = today.getFullYear() - birthday.getFullYear()
    let month = today.getMonth() - birthday.getMonth()
    let day = today.getDate() - birthday.getDate()

    if (day < 0) {
        day += 30
        month--
    }
    if (month < 0) {
        age--
    }

    if (month > 6 || (month == 6 && day > 0)) {
        result.iage = age + 1
    }
    else {
        result.iage = age
    }
    result.string = result.iage + '(' + age + '歲 ' + month + '個月 ' + day + '天)'
    return (result)
}

module.exports = router;