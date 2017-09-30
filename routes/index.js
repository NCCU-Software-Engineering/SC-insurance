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

personal


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
    res.render('camera')
});

router.get('/deploy', function (req, res, next) {
    console.log("deploy");

    let payment_TWD = req.cookies.payment * 10000;
    let payment_wei = payment_TWD * 100000000000000;

    contract.deploy('0x0xA4716ae2279E6e18cF830Da2A72E60FB9d9B51C6', payment_TWD, payment_wei, req.cookies.paymentDate, req.cookies.beneficiary, req.cookies.deathBeneficiary, (address) => {
        mysql.addContract(req.session.user_ID, address);
        res.render('buy', { address: address });
    });
});

router.get('/quickDeploy', function (req, res, next) {
    console.log("quickDeploy");

    let payment_TWD = req.cookies.payment * 10000;
    let payment_wei = payment_TWD * 100000000000000;

    contract.deploy('0x0xA4716ae2279E6e18cF830Da2A72E60FB9d9B51C6', payment_TWD, payment_wei, req.cookies.paymentDate, req.cookies.beneficiary, req.cookies.deathBeneficiary, (address) => {
        mysql.addContract(req.session.user_ID, address);
        res.redirect('buy', { address: address });
    });
});

router.get('/payeth', function (req, res, next) {
    let main = '0x5720c11041D8cD5a3E69F71e38475138D87FE71c';
    let company = '0x1ad59A6D33002b819fe04Bb9c9d0333F990750a4';
    let nidhogg5 = '0xa4716ae2279e6e18cf830da2a72e60fb9d9b51c6';
    let personal = '0x4ed1098bBD3D742F311682782f823d66bCa0Be87';
    let testContract = new contract.getContract(req.query.address);

    testContract.buy({
        from: nidhogg5,
        value: 5000000000000000000,
        gas: 4444444
    });
    /*web3.eth.sendTransaction({ from: main, to: req.query.address, value: 100000000000000000000 })

    console.log('main = ' + web3.eth.getBalance(main));
    console.log('company = ' + web3.eth.getBalance(company));
    console.log('nidhogg5 = ' + web3.eth.getBalance(nidhogg5));
    console.log('contract1 = ' + web3.eth.getBalance(req.query.address));*/
    res.render('index')

})

router.get('/takepic', function (req, res, next) {
    res.send('picture');
});

module.exports = router;