var path = require('path');
var express = require('express');
var web3 = require('../web3.js');
var router = express.Router();
var mysql = require('mysql');
var Contract = require('../Contract.js');

router.get('/', function (req, res, next) {
    res.sendFile(path.resolve('public', 'index.html'));
});

router.get('/signin', function (req, res, next) {
    res.sendFile(path.resolve('public', 'sign_in.html'));
});

router.get('/signup', function (req, res, next) {
    res.sendFile(path.resolve('public', 'sign_up.html'));
});

router.get('/buy', function (req, res, next) {
    res.sendFile(path.resolve('public', 'buy.html'));
});

router.get('/test', function (req, res, next) {
  res.sendFile(path.resolve('public', 'test.html'));
});

router.get('/agreement', function (req, res, next) {
  res.sendFile(path.resolve('public', 'agreement.html'));
});

router.get('/template', function (req, res, next) {
  res.sendFile(path.resolve('public', 'template.html'));
});


router.get('/deploy', function(req, res, next) {
  var contract = new Contract();
  contract.deploy();
  console.log("deploy the contract");
  //res.sendFile(path.resolve('public','index.html'));
});

router.post('/test', function(req, res, next) {
  var todo = req.body.todo;
  if(todo == "addyear")
    res.send(req.body.todo);
  else
    res.send("nothing")
});

router.post('/registration', function (req, res, next) {

  console.log("registration");

  console.log(req.body);

  web3.personal.newAccount("1234");
  console.log("create a new account");

  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'leviathan5',
    database: 'smart'
  });

  //開始連接
  connection.connect();

  connection.query('INSERT INTO smart.account SET ?', req.body, function (error) {
    if (error) {
      console.log('寫入資料失敗！');
      throw error;
    }
  });

  //結束連線
  connection.end();

  res.sendFile(path.resolve('public', 'index.html'));
});

module.exports = router;
