var express = require('express')
var crypto = require('crypto')
var format = require('string-format')

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

//get
router.get('/', function (req, res, next) {
    res.render('index', { user_name: req.session.user_name })
})

router.get('/trial', function (req, res, next) {
    res.render('trial', { user_name: req.session.user_name })
})

router.get('/buy', sign, function (req, res, next) {
    res.render('buy', { user_name: req.session.user_name })
})

router.get('/agreement', sign, function (req, res, next) {
    res.render('agreement', { user_name: req.session.user_name })
})

router.get('/test', sign, async function (req, res, next) {
    let contract = await mysql.getContractByID(req.session.user_ID)
    let li = ''
    for (var i = 0; i < contract.length; i++) {
        li += format('<li><input name="smart" type="radio" value="{}">{}({}年，{}以太幣，{})</li>', contract[i].address, contract[i].alias, contract[i].paymentDate, contract[i].payment, contract[i].isGuarantee ? '有保證' : '無保證')
    }
    res.render('test', { user_name: req.session.user_name, radio: li })
})

router.get('/pay', sign, async function (req, res, next) {
    let user = await mysql.getUserByID(req.session.user_ID)
    res.render('pay', { user_name: req.session.user_name, account: user.account })
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
});

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
    notice.confirmEmail(user.email, policy)
    res.send('done')
})

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
    notice.revocationPeriodEmail(user.email, policy, myDate)
    res.redirect('/')
})
router.get('/revoke', async function (req, res, next) {
    let testContract = new contract.getContract(req.query.address)
    let user = await mysql.getUserByID(req.query.id)

    testContract.revoke({
        from: web3.eth.coinbase,
        gas: 4444444
    })

    res.redirect('/')
})

router.post('/getContracts', async function (req, res, next) {
    let contract = await mysql.getContractByID(req.session.user_ID)
    res.send(contract)
})

router.post('/createcode', function (req, res, next) {
    let randomString = crypto.randomBytes(32).toString('hex').substr(0, 8);
    mysql.setVerification(req.session.user_ID, randomString)
    let cont = "您的驗證碼為: " + randomString
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