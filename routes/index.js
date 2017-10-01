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
    res.render('agreement', { user_name: req.session.user_name, user_age: age.string, user_payment: (80 - age.iage) / 2 })
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

//自動環境
router.get('/auto', sign, function (req, res, next) {
    /*
    let contract = await mysql.getContract()
    for (var i = 0; i < contract.length; i++) {
        li += format('<div class="item col-md-4" value={}><h3>{}</h3><p>保費{}以太幣</p><p>{}</p></div>', contract[i].address, contract[i].alias, contract[i].payment, contract[i].isGuarantee ? '保證型智能保單' : '不保證型智能保單')
    }
    */
    res.render('auto', { user_name: req.session.user_name })
})

//測試頁面
router.get('/test', async function (req, res, next) {
    res.render('test', { user_name: req.session.user_name, address: req.query.address })
})

router.get('/verify', function (req, res, next) {
    res.render('verify', { user_name: req.session.user_name })
})

//部署合約
router.post('/deploy', async function (req, res, next) {
    console.log('deploy')
    console.log(req.body)
    if (req.body.payment != undefined && req.body.paymentDate != undefined) {
        let user = await mysql.getUserByID(req.session.user_ID)
        let isGuarantee = (req.body.isGuarantee == 1) ? true : false
        console.log(isGuarantee)
        contract.deploy(user.account, req.body.deathBeneficiaryAddress, req.body.payment, req.body.annuity, req.body.paymentDate, isGuarantee, req.body.beneficiary, req.body.deathBeneficiary, async (address) => {
            await mysql.addContract(req.session.user_ID, address, req.body.alias, req.body.payment, req.body.paymentDate, req.body.isGuarantee, req.body.deathBeneficiary, req.body.deathBeneficiaryRelationship, req.body.deathBeneficiaryIdentity)
            let number = (await mysql.getContractByAddress(address)).auto
            res.json({ type: true, address: address, number: number, alias: req.body.alias })
        })
    }
    else {
        console.log('invalid')
        res.json({ type: false, inf: '不能留空' })
    }
})

//付款
router.get('/payeth', async function (req, res, next) {
    let testContract = new contract.getContract(req.query.address)
    let user = await mysql.getUserByID(req.session.user_ID)
    let policy = await mysql.getContractByAddress(req.query.address)
    testContract.buy({
        from: user.account,
        value: web3.toWei(req.query.amount, "ether"),
        gas: 4444444
    })
    mysql.buyContract(req.query.address)
    notice.confirmEmail(user.email, policy, req.query.address, req.session.user_ID)
    res.send('done')
})

//確認合約
router.get('/confirm', async function (req, res, next) {
    let testContract = new contract.getContract(req.query.address)
    let user = await mysql.getUserByID(req.query.id)
    let policy = await mysql.getContractByAddress(req.query.address)
    let myDate = new Date()
    myDate.setDate(myDate.getDate() + 11)
    testContract.confirm(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate(), {
        from: web3.eth.coinbase,
        gas: 4444444
    })
    notice.revocationPeriodEmail(user.email, policy, myDate, req.query.address, req.query.id)
    res.redirect('/')
})

//撤銷合約
router.get('/revoke', async function (req, res, next) {
    let testContract = new contract.getContract(req.query.address)
    let user = await mysql.getUserByID(req.query.id)

    testContract.revoke({
        from: web3.eth.coinbase,
        gas: 4444444
    })

    res.redirect('/')
})

//取得合約料表
router.post('/getContracts', async function (req, res, next) {
    let contract = await mysql.getContractByID(req.session.user_ID)
    res.send(contract)
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