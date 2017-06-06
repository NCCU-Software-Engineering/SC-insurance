var path = require('path');
var express = require('express');
var router = express.Router();

var web3 = require('../lib/web3.js');
var connection = require('../lib/SQL.js');
var send = require('../lib/send.js');

var Contract = require('../lib/contract.js');
var TestContract = require('../lib/testContract.js');

// 資料庫連線發生錯誤處理

connection.connect(function (err) {
    if (err) {
        console.log('error when connecting to db:', err);
        // 2秒後重新連線
        setTimeout(handleDisconnect, 2000);
    }
});

/*
connection.end(function (err) {
    if (err) {
        console.log('error when connecting to db:', err);
    }
});
*/

//首頁
router.get('/', function (req, res, next) {
    res.render('index');
});

//會員管理
router.get('/sign_in', function (req, res, next) {
    res.render('sign_in');
});
router.get('/sign_up', function (req, res, next) {
    res.render('sign_up');
});
router.get('/sign_out', function (req, res, next) {
    res.clearCookie("ID");
    res.redirect('/');
});

//網頁導向
router.get('/buy', function (req, res, next) {
    res.render('buy');
});

router.get('/agreement', function (req, res, next) {
    res.render('agreement');
});

router.get('/template', function (req, res, next) {
    res.render('template');
});

router.get('/deploy', function (req, res, next) {
    var contract = new Contract();
    contract.deploy(req.cookies.ID);
    console.log("deploy the contract");
    res.redirect('/');
});

router.get('/test', function (req, res, next) {

    let li = "";

    connection.query('SELECT address FROM smart.contract where id=\'' + req.cookies.ID + '\';', function (error, rows, fields) {
        if (error) {
            console.log('寫入讀取失敗！');
            throw error;
        }
        for (var i = 0; i < rows.length; i++) {
            li += "<li><input name=\"smart\" type=\"radio\" value=\"" + rows[i].address + "\">智能合約" + (i + 1) + ":" + rows[i].address + "</li>"
        }
        res.render('test', {
            radio: li
        });
    });

});

//post-------------------------------------------------------
router.post('/test', function (req, res, next) {
    var todo = req.body.todo;
    if (todo == "addyear")
        res.send(req.body.todo);
    else
        res.send("nothing")
});

router.post('/registration', function (req, res, next) {

    console.log("註冊");
    console.log(req.body);

    //web3.personal.newAccount("1234");
    console.log("create a new account not work in testrpc");


    connection.query('INSERT INTO smart.account SET ?', req.body, function (error) {
        if (error) {
            console.log('寫入資料失敗！');
            throw error;
        }
    });

    res.redirect('/');
});

router.post('/login', function (req, res, next) {

    console.log("登錄");
    console.log(req.body);

    res.cookie('ID', req.body.ID);
    res.cookie('signed_ID', req.body.ID, {
        signed: true
    });
    res.redirect('/');
});

router.post('/checkout', function (req, res, next) {

    console.log("結帳");
    console.log(req.body);

    res.redirect('/agreement');
});

function watch(testContract, type) {

    var cont;
    var email = false;
    var newsletter = false;

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

router.post('/button', function (req, res, next) {

    console.log(req.body);

    var testContract = new TestContract(req.body.address);

    var myDate = new Date();
    myDate.setFullYear(testContract.getNowTime()[0]);
    myDate.setMonth(testContract.getNowTime()[1] - 1);
    myDate.setDate(testContract.getNowTime()[2]);

    switch (req.body.type) {

        case "next_day":
            //console.log("next_day");
            testContract.time(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate() + 1);
            break;
        case "next_month":
            //console.log("next_month");
            testContract.time(myDate.getFullYear(), myDate.getMonth() + 2, myDate.getDate());
            break;
        case "next_year":
            //console.log("next_year");
            testContract.time(myDate.getFullYear() + 1, myDate.getMonth() + 1, myDate.getDate());
            break;

        case "confirm":
            //console.log("confirm");
            testContract.confirm(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate() + 11);
            watch(testContract, "confirm");
            break;

        case "revoke":
            //console.log("revoke");
            testContract.revoke();
            watch(testContract, "revoke");
            break;

        case "update":
            console.log("update");
            break;

        default:
            console.error("error");
    }

    var companyAddress = testContract.getCompanyAddress();
    var insurerAddress = testContract.getInsurerAddress();
    var status = testContract.getStatus();
    var nowTime = testContract.getNowTime();
    var revocationPeriod = testContract.getRevocationPeriod();
    var payTime = testContract.getPayTime();

    res.json({
        companyAddress: companyAddress,
        insurerAddress: insurerAddress,
        status: status,
        nowTime: nowTime,
        revocationPeriod: revocationPeriod,
        payTime: payTime,
    })

});

module.exports = router;