var express = require('express');
var router = express.Router();

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
router.get('/sign_in', function (req, res, next) {
    console.log(req.session);
    res.render('sign_in', { user_name: req.session.user_name });
});
router.get('/sign_up', function (req, res, next) {
    console.log(req.session);
    res.render('sign_up', { user_name: req.session.user_name });
});

router.all('/sign_out', function (req, res, next) {
    req.session.destroy();
    res.redirect('/');
});

//post
router.post('/sign_in', function (req, res, next) {
    console.log("sign_in-post");
    console.log(req.body);
    mysql.sing_in(req.body.name, req.body.password, (isSuccess, result) => {
        console.log(isSuccess, result);
        if (isSuccess) {
            req.session.user_name = req.body.name;
            console.log(req.session.user_name);
        }
    });
    res.redirect('/');
});

router.post('/sign_up', function (req, res, next) {

    console.log("sign_up-post");
    console.log(req.body);

    //web3.personal.newAccount("1234");
    console.log("create a new account not work in testrpc");

    res.redirect('/');
});

module.exports = router;
