var express = require('express')
var crypto = require('crypto')
var format = require('string-format')

var web3 = require('../library/web3.js')
var contract = require('../library/contract.js')
var mysql = require('../library/mysql.js')
var send = require('../library/notice.js')

var router = express.Router()

mysql.connect()

//get
router.get('/', function (req, res, next) {
    res.render('index', { user_name: req.session.user_name })
})

router.get('/trial', function (req, res, next) {
    res.render('trial', { user_name: req.session.user_name })
})

router.get('/buy', function (req, res, next) {
    if (req.session.user_ID && req.session.user_name) {
        res.render('buy', { user_name: req.session.user_name })
    }
    else {
        res.redirect('users/sign_in')
    }
})

router.get('/agreement', function (req, res, next) {
    if (req.session.user_ID && req.session.user_name) {
        res.render('agreement', { user_name: req.session.user_name })
    }
    else {
        res.redirect('users/sign_in')
    }
})

router.get('/template', function (req, res, next) {
    res.render('template', {
        user_name: req.session.user_name,
        paymentDate: req.cookies.paymentDate,
        payment: req.cookies.payment,
        beneficiarie: req.cookies.beneficiarie
    })
})

router.get('/test', function (req, res, next) {
    mysql.getContractByID(req.session.user_ID, (result) => {
        let li = ''
        for (var i = 0; i < result.length; i++) {
            li += format('<li><input name="smart" type="radio" value="{}">智能合約{}:{}</li>', result[i].address, (i + 1), result[i].address)
        }
        res.render('test', { user_name: req.session.user_name, radio: li })
    })
})

router.get('/camera', function (req, res, next) {
    res.render('camera', { user_name: req.session.user_name })
})

router.get('/pay', function (req, res, next) {
    res.render('pay', { user_name: req.session.user_name })
})

router.get('/verify', function (req, res, next) {
    res.render('verify', { user_name: req.session.user_name })
})

//post
router.post('/deploy', async function (req, res, next) {
    console.log('deploy')
    console.log(req.body)
    if (req.body.payment != undefined && req.body.paymentDate != undefined) {
        let user = await mysql.getUserByID(req.session.user_ID)
        contract.deploy(user.account, req.body.deathBeneficiaryAddress, req.body.payment, req.body.paymentDate, req.body.beneficiary, req.body.deathBeneficiary, async (address) => {
            await mysql.addContract(req.session.user_ID, address, req.body.alias, req.body.payment)
            let number = (await mysql.getContractByAddress(address)).auto
            res.json({ type: true, address: address, number: number, alias: req.body.alias })
        })
    }
    else {
        console.log('invalid')
        res.json({ type: false, inf: '不能留空' })
    }
});

router.get('/payeth', async function (req, res, next) {
    let testContract = new contract.getContract(req.query.address);
    testContract.buy({
        from: req.query.account,
        value: web3.toWei(req.query.amount, "ether"),
        gas: 4444444
    })
    mysql.buyContract(req.query.address)
    let user = await mysql.getUserByID(req.session.user_ID)
    send.email(user.email, '請確認合約', '請前往\n http://localhost:50000/confirm?address=' + req.query.address + '\n確認合約')
    res.send('done')
})

router.get('/confirm', function (req, res, next) {

    let testContract = new contract.getContract(req.query.address);
    let myDate = new Date()
    myDate.setDate(myDate.getDate() + 11)
    testContract.confirm(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate(), {
        from: web3.eth.coinbase,
        gas: 4444444
    })

    res.render('index')
})

router.post('/getaccount', function (req, res, next) {
    mysql.getAccountByID(req.session.user_ID, (result) => {
        res.send(result)
    })
})

router.post('/getcontracts', function (req, res, next) {
    mysql.getContractByID(req.session.user_ID, (result) => {
        res.send(result)
    })
})

router.post('/createcode', function (req, res, next) {
    var randomString = crypto.randomBytes(32).toString('hex').substr(0, 8);
    mysql.setVerification(req.session.user_ID, randomString)
    var cont = "您的驗證碼為: " + randomString
    send.newsletter("0912254446", cont)

    res.send('done')
})

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

router.get('/takepic', function (req, res, next) {
    res.send('picture')
});

module.exports = router;