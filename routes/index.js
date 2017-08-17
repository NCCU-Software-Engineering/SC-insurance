var express = require('express');
var router = express.Router();

var web3 = require('../library/web3.js');
var contract = require('../library/contract.js');
var mysql = require('../library/mysql.js');

mysql.connection.connect((err) => {
    if (err) {
        console.log('error when connecting to db:', err);
        // 2秒後重新連線
        //setTimeout(handleDisconnect, 2000);
    }
    else {
        console.log('connecting to db');
    }
});

/*
mysql.connection..end(function (err) {
    if (err) {
        console.log('error when connecting to db:', err);
    }
});
*/

//render
router.get('/', function (req, res, next) {
    res.render('index', { user_name: req.session.user_name });
});

router.get('/buy', function (req, res, next) {
    if (req.session.user_ID && req.session.user_name) {
        res.render('buy', { user_name: req.session.user_name });
    }
    else {
        res.redirect('users/sign_in');
    }
});

router.get('/agreement', function (req, res, next) {
    if (req.session.user_ID && req.session.user_name) {
        res.render('agreement', { user_name: req.session.user_name });
    }
    else {
        res.redirect('users/sign_in');
    }
});

router.post('/agreement', function (req, res, next) {
    console.log("agreement-post");
    console.log(req.body);
    res.cookie('payment', req.body.payment, { maxAge: 60 * 1000 });
    res.cookie('paymentDate', req.body.paymentDate, { maxAge: 60 * 1000 });
    res.cookie('beneficiary', req.session.user_name, { maxAge: 60 * 1000 });
    res.cookie('deathBeneficiary', req.body.deathBeneficiary, { maxAge: 60 * 1000 });
    res.redirect('template');
});

router.get('/template', function (req, res, next) {
    res.render('template', {
        user_name: req.session.user_name,
        paymentDate: req.cookies.paymentDate,
        payment: req.cookies.payment,
        beneficiarie: req.cookies.beneficiarie
    });
});

router.get('/test', function (req, res, next) {
    mysql.getContract(req.session.user_ID, (result) => {
        let li = '';
        for (var i = 0; i < result.length; i++) {
            li += "<li><input name=\"smart\" type=\"radio\" value=\"" + result[i].address + "\">智能合約" + (i + 1) + ":" + result[i].address + "</li>"
        }
        res.render('test', { user_name: req.session.user_name, radio: li });
    });
});

router.get('/camera', function (req, res, next) {
    res.render('camera', { user_name: req.session.user_name })
});

router.get('/pay', function (req, res, next) {
    res.render('pay', { user_name: req.session.user_name })
});

router.post('/deploy', async function (req, res, next) {
    console.log('deploy')
    let user = await mysql.getUserByID(req.session.user_ID)
    let payment_TWD = req.cookies.payment * 10000
    let payment_wei = payment_TWD * 100000000000000
    console.log(user.account, payment_TWD, payment_wei)
    if (user.account && payment_TWD && payment_wei) {
        contract.deploy(user.account, payment_TWD, payment_wei, req.cookies.paymentDate, req.cookies.beneficiary, req.cookies.deathBeneficiary, (address) => {
            mysql.addContract(req.session.user_ID, address)
            res.json({ type: true, address: address })
        });
    }
    else {
        res.json({ type: false })
    }
});

router.get('/payeth', function (req, res, next) {
    
    let testContract = new contract.getContract(req.query.address);

    testContract.buy({
        from: req.query.account,
        value: web3.toWei(req.query.amount,"ether"),
        gas: 4444444
    });

    res.render('index', { user_name: req.session.user_name })

})
router.post('/getaccount', function (req, res, next) {
    mysql.getAccountByID(req.session.user_ID, (result) => {
        res.send(result);
    })
})

router.post('/getcontracts', function (req, res, next) {
    mysql.getContract(req.session.user_ID, (result) => {
        res.send(result);
    })
})

router.get('/takepic', function (req, res, next) {
    res.send('picture');
});

module.exports = router;