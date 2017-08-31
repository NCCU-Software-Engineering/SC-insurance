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

router.get('/test', async function (req, res, next) {
    if (req.session.user_ID && req.session.user_name) {
        let contract = await mysql.getContractByID(req.session.user_ID)
        let li = ''
        for (var i = 0; i < contract.length; i++) {
            li += format('<li><input name="smart" type="radio" value="{}">{}({}年，{}以太幣)</li>', contract[i].address, contract[i].alias, contract[i].payment, contract[i].paymentDate)
        }
        res.render('test', { user_name: req.session.user_name, radio: li })
    }
    else {
        res.redirect('users/sign_in')
    }
})

router.get('/pay', async function (req, res, next) {
    if (req.session.user_ID && req.session.user_name) {
        let user = await mysql.getUserByID(req.session.user_ID)
        res.render('pay', { user_name: req.session.user_name, account: user.account })
    }
    else {
        res.redirect('users/sign_in')
    }
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
            await mysql.addContract(req.session.user_ID, address, req.body.alias, req.body.payment, req.body.paymentDate, req.body.deathBeneficiary, req.body.deathBeneficiaryRelationship, req.body.deathBeneficiaryIdentity)
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
    let content = ''
    content += '親愛的會員您好\n'
    content += '感謝您購買本公司利率變動型年金保險\n\n'
    content += '您的保單內容如下：\n'
    content += '保險名稱：' + policy.alias  + '\n'
    content += '保險金額：' + policy.payment  + '以太幣\n'
    content += '保險時間：' + policy.paymentDate  + '年\n'
    content += '身故受益人：' + policy.deathBeneficiary  + '\n'
    content += '身故受益人關係：' + policy.deathBeneficiaryRelationship  + '\n'
    content += '身故受益人身分證：' + policy.deathBeneficiaryIdentity  + '\n'
    content += '請前往  http://localhost:50000/confirm?address=' + req.query.address +'&id='+req.session.user_ID+ '  正式啟用合約\n'
    content += '啟用合約後您將享有10天無條件契約撤銷權利'
    send.email(user.email, '正大人壽網路投保電子保單付款成功通知', content)
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
    let content = ''
    content += '親愛的會員您好\n'
    content += '感謝您購買本公司利率變動型年金保險\n\n'
    content += '您的保單內容如下：\n'
    content += '保險名稱：' + policy.alias  + '\n'
    content += '保險金額：' + policy.payment  + '以太幣\n'
    content += '保險時間：' + policy.paymentDate  + '年\n'
    content += '身故受益人：' + policy.deathBeneficiary  + '\n'
    content += '身故受益人關係：' + policy.deathBeneficiaryRelationship  + '\n'
    content += '身故受益人身分證：' + policy.deathBeneficiaryIdentity  + '\n'
    content += '根據本契約，於簽收保單後十日內得撤銷本契約，本公司將無息返還保險費。如於'+myDate.getFullYear()+'年'+(myDate.getMonth()+1)+'月'+myDate.getDate()+'日時前，要執行本權利，請點擊以下\n'
    content += 'http://localhost:50000/revoke?address=' + req.query.address +'&id='+req.query.id

    send.email(user.email, '正大人壽網路投保電子保單契約撤銷期通知', content)
    res.render('index')
})
router.get('/revoke', async function (req, res, next) {
    let testContract = new contract.getContract(req.query.address)
    let user = await mysql.getUserByID(req.query.id)

    testContract.revoke({
        from: web3.eth.coinbase,
        gas: 4444444
    })

    res.render('index')
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