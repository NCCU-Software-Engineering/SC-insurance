var path = require('path');
var express = require('express');
var web3 = require('../lib/web3.js');
var router = express.Router();
var Contract = require('../lib/contract.js');
var connection = require('../lib/SQL.js');

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

module.exports = router;