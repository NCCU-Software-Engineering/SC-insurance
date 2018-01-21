const express = require('express')
const crypto = require('crypto')
const format = require('string-format')
const fs = require("fs")
const path = require('path')

const web3 = require('../library/web3')
const contract = require('../library/contract')
const mysql = require('../library/mysql')
const notice = require('../library/notice')

const router = express.Router()

mysql.connect()

const sign = async function (req, res, next) {
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

//錢包頁面
router.get('/wallet', async function (req, res, next) {
    let user = await mysql.getUserByID(req.session.user_ID)
    res.render('wallet')
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

module.exports = router