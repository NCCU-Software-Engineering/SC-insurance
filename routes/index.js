const express = require('express')
const crypto = require('crypto')
const format = require('string-format')
const fs = require("fs")
const path = require('path')

const web3 = require('../library/web3')
const contract = require('../library/contract')
const mysql = require('../library/mysql')
const notice = require('../library/notice')
const tool = require('../library/tool')

const router = express.Router()

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

//個人頁面
router.get('/personal', sign, async function (req, res, next) {
    let user = await mysql.getUserByID(req.session.user_ID)
    res.render('personal', {
        user_name: req.session.user_name,
        ID: user.ID,
        name: user.name,
        identity: user.identity,
        email: user.email,
        phone: user.phone,
        address: user.address,
        account: user.account,
    })
})

//購買智能保單頁面
router.get('/agreement', sign, async function (req, res, next) {
    let user = await mysql.getUserByID(req.session.user_ID)
    let age = tool.getAge(user.birthday)
    res.render('agreement', { user_name: req.session.user_name, user_age: age.string, user_payment: (80 - age.iage) })
})

//部署合約
router.post('/deploy', sign, async function (req, res, next) {
    console.log('deploy')
    console.log(req.body)
    if (req.body.payment == undefined || req.body.paymentDate == undefined) {
        console.log('invalid')
        res.json({ type: false, inf: '不能留空' })
    }
    else {
        let user = await mysql.getUserByID(req.session.user_ID)
        contract.deploy(user.account, req.body.deathBeneficiaryAddress, req.body.payment, req.body.annuity, req.body.paymentDate, req.body.isGuarantee, req.body.beneficiary, req.body.deathBeneficiary, async (address) => {
            await mysql.addContract(req.session.user_ID, address, req.body.alias, req.body.payment, req.body.paymentDate, req.body.isGuarantee, req.body.deathBeneficiary, req.body.deathBeneficiaryRelationship, req.body.deathBeneficiaryIdentity)
            let number = (await mysql.getContractByAddress(address)).auto
            res.json({ type: true, address: address, number: number, alias: req.body.alias })
        })
    }
})

//選擇付款方式頁面
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

    let contract = await mysql.getContractByAddress(req.query.address)
    let user = await mysql.getUserByID(contract.ID)

    res.render('wallet', {
        auto: tool.paddingLeft(contract.auto, 6),
        alias: contract.alias,
        name: user.name,
        address: contract.address,
        isGuarantee: (contract.isGuarantee == 1) ? '保證型保單' : '不保證型保單',
        isBuy: (contract.isBuy == 1) ? '已付款' : '尚未付款',
        payment: contract.payment,
        paymentDate: contract.paymentDate,
        deathBeneficiary: contract.deathBeneficiary,
        deathBeneficiaryRelationship: contract.deathBeneficiaryRelationship,
        deathBeneficiaryIdentity: contract.deathBeneficiaryIdentity,
    })
})

//智能合約 傳統合約 對照頁面
router.get('/solidity', sign, function (req, res, next) {
    let fileName = path.join('contract', 'Annuity.sol')
    fs.readFile(fileName, 'utf8', function (error, data) {
        res.render('solidity', { user_name: req.session.user_name, solidity: data })
    })
})

//發送購買email
router.post('/buyEmail', async function (req, res, next) {
    let user = await mysql.getUserByID(req.session.user_ID)
    let contract = await mysql.getContractByAddress(req.body.address)
    notice.buyEmail(user.email, contract)
    res.send('done')
})

module.exports = router