var express = require('express');
var router = express.Router();

var mysql = require('../library/mysql.js');

//render
router.get('/sign_in', function (req, res, next) {
    res.render('sign_in', { user_name: req.session.user_name });
});
router.get('/sign_up', function (req, res, next) {
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
    mysql.sing_in(req.body.ID, req.body.password, (isSuccess, result, name) => {
        if (isSuccess) {
            req.session.user_ID = req.body.ID;
            req.session.user_name = name;
        }
        res.json({ isSuccess: isSuccess, result: result });
    });
});

router.post('/sign_up', function (req, res, next) {
    console.log("sign_up-post");

    //web3.personal.newAccount("1234");
    //console.log("create a new account not work in testrpc");

    let user = req.body;
    console.log(user);
    mysql.sing_up(user.ID, user.password, user.name, user.identity, user.email, user.phone, user.birthday, user.address, (isSuccess, result) => {
        res.json({ isSuccess: isSuccess, result: result });
    });
});

module.exports = router;
