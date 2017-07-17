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
    res.render('buy', { user_name: req.session.user_name });
});

router.get('/agreement', function (req, res, next) {
    res.render('agreement', { user_name: req.session.user_name });
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

    req.session.user_ID = 'nidhogg5';
    req.session.user_name = '賴晨禾';

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
    contract.deploy(req.cookies.payment, req.cookies.paymentDate, req.cookies.beneficiary, req.cookies.deathBeneficiary, (address) => {
        mysql.addContract(req.session.user_ID, address);
    });
    res.redirect('buy');
});

router.get('/takepic', function (req, res, next) {
    res.send('picture');
});

router.post('/button', function (req, res, next) {

    console.log(req.body);

    let testContract = new contract.getContract(req.body.address);

    let myDate = new Date();
    let contractTime = testContract.getNowTime();

    myDate.setFullYear(contractTime[0]);
    myDate.setMonth(contractTime[1] - 1);
    myDate.setDate(contractTime[2]);

    switch (req.body.type) {

        case "next_day":
            //console.log("next_day");
            testContract.time(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate() + 1, {
                from: web3.eth.coinbase,
                gas: 4444444
            });
            break;
        case "next_month":
            //console.log("next_month");
            testContract.time(myDate.getFullYear(), myDate.getMonth() + 2, myDate.getDate(), {
                from: web3.eth.coinbase,
                gas: 4444444
            });
            break;
        case "next_year":
            //console.log("next_year");
            testContract.time(myDate.getFullYear() + 1, myDate.getMonth() + 1, myDate.getDate(), {
                from: web3.eth.coinbase,
                gas: 4444444
            });
            break;

        case "pay":
            //console.log("next_year");
            testContract.payment({
                from: web3.eth.coinbase,
                gas: 4444444
            });
            break;

        case "confirm":
            //console.log("confirm");
            testContract.confirm(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate() + 11, {
                from: web3.eth.coinbase,
                gas: 4444444
            });
            watch(testContract, "confirm", req.body.email, req.body.letter);
            break;

        case "revoke":
            //console.log("revoke");
            testContract.revoke({
                from: web3.eth.coinbase,
                gas: 4444444
            });
            watch(testContract, "revoke", req.body.email, req.body.letter);
            break;

        case "update":
            console.log("update");
            break;

        default:
            console.error("not fond");
    }

    let companyAddress = testContract.getCompanyAddress();
    let insurerAddress = testContract.getInsurerAddress();
    let state = testContract.getState();
    let payment = testContract.getPayment();
    let guaranteePeriod = testContract.getGuaranteePeriod();
    let timeInterval = testContract.getTimeInterval();
    let beneficiarie = testContract.getBeneficiarie();
    let deathBeneficiary = testContract.getDeathBeneficiary();

    let deployTime = testContract.getDeployTime();
    let nowTime = testContract.getNowTime();
    let revocationPeriod = testContract.getRevocationPeriod();
    let paymentDate = testContract.getPaymentDate();

    res.json({
        companyAddress: companyAddress,
        insurerAddress: insurerAddress,
        state: state,
        payment: payment,
        guaranteePeriod: guaranteePeriod,
        timeInterval: timeInterval,
        beneficiarie: beneficiarie,
        deathBeneficiary: deathBeneficiary,
        deployTime: deployTime,
        nowTime: nowTime,
        revocationPeriod: revocationPeriod,
        paymentDate: paymentDate
    })

});

function watch(testContract, type, email, newsletter) {

    let cont;

    switch (type) {
        case "confirm":
            testContract.confirmEvent.watch(function (error, result) {
                if (!error) {
                    testContract.confirmEvent.stopWatching();

                    console.log(result.args.inf);

                    if (result.args.inf == "confirm success") {

                        cont = "『根據本契約，於簽收保單後十日內得撤銷本契約，本公司將無息返還保險費。如於" + testContract.getRevocationPeriod() + "前，要執行本權利』"

                        if (email) {
                            send.email("nidhogg55555@gmail.com", "契約確認成功", cont);
                        }
                        if (newsletter) {
                            send.newsletter("0912254446", cont);
                        }
                    } else if (result.args.inf == "not yet been confirmed") {
                        console.log("111");
                    } else {
                        console.error("未知事件");
                    }
                }
            });

            break;

        case "revoke":
            testContract.revokeEvent.watch(function (error, result) {
                if (!error) {
                    testContract.revokeEvent.stopWatching();

                    console.log(result.args.inf);

                    if (result.args.inf == "revoke the contract") {
                        cont = "『您與本公司簽訂之編號0000號保險契約已經撤銷成功，保費已退回您指定帳戶。日後若發生保險事故，本公司將不負保險責任』";

                        if (email) {
                            send.email("nidhogg55555@gmail.com", "契約撤銷成功", cont);
                        }
                        if (newsletter) {
                            send.newsletter("0912254446", cont);
                        }
                    } else if (result.args.inf == "Can not be revoked") {
                        console.log("222");
                    } else {
                        console.error("未知事件");
                    }
                }
            });
            break;
    }
}

module.exports = router;