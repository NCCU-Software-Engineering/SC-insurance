var express = require('express');
var router = express.Router();
var fs = require('fs');
var solc = require('solc');
var web3 = require('../web3.js');
var mysql = require('mysql');
var ip = require('../ip.js');
var con = mysql.createConnection({
  host: ip.mysql.host,
  user: ip.mysql.user,
  password: ip.mysql.password,
  database: "smart"
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('./public/index.html');
});
//找合約
router.post('/contracts', function (req, res, next) {
  console.log(req.body.id)

  con.query("SELECT address FROM contract WHERE ID = ?", [req.body.id], function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.send(result)
  });

})
//找交易紀錄
router.post('/getresult', function (req, res, next) {
  var abi = JSON.parse(fs.readFileSync('annuity.abi'));
  var address = req.body.contracts;
  var contract = web3.eth.contract(abi).at(address);
  var events = contract.allEvents({ fromBlock: 0, toBlock: 'latest' });
  events.get(function (error, logs) {
    res.send(logs);
    /*logs.forEach((element)=>{
      console.log(element.args.inf);
    })*/
  });
  //res.send('success');
});

router.post('/compile', function (req, res, next) {
  var source = fs.readFileSync('./public/Annuity.Sol', 'utf-8');
  var compiledContract = solc.compile(source, 1);
  //console.log(compiledContract.contracts[':Annuity']);
  var abi = compiledContract.contracts[':Annuity'].interface;
  var bytecode = compiledContract.contracts[':Annuity'].bytecode;
  fs.writeFileSync('annuity.abi', abi);
  fs.writeFileSync('annuity.bin', bytecode);
  res.send('compile');
});

router.post('/deploy', function (req, res, next) {
  var abi = JSON.parse(fs.readFileSync('annuity.abi'));
  var bytecode = '0x' + fs.readFileSync('annuity.bin').toString();
  var Annuity = web3.eth.contract(abi);

  var d = new Date();
  Annuity.new(d.getFullYear(), d.getMonth(), d.getDate(), {
    from: req.body.account,
    gas: '4700000',
    data: bytecode
  }, (err, Contract) => {
    if (err !== undefined && err !== null)
      console.log(err)
    if (Contract.address !== undefined && Contract.address !== null) {
      fs.writeFileSync('config.json', JSON.stringify({
        Account: {
          address: Contract.address
        }
      }));
      res.send('deploy');
    }
  })
});

router.post('/trans', function (req, res, next) {
  var abi = JSON.parse(fs.readFileSync('annuity.abi'));
  var config = JSON.parse(fs.readFileSync('config.json'));
  var contract = web3.eth.contract(abi).at(config.Account.address);
  if (req.body.time == 1) {
    var d = new Date();
    contract.confirm(d.getFullYear(), d.getMonth(), d.getDate(), {
      from: req.body.account,
      gas: '4700000'
    }, (err, result) => {
      if (result !== undefined && result !== null) {
        res.send(result);
      }
    });
  }
  else if (req.body.time == 2) {
    var d = new Date();
    contract.revoke({
      from: req.body.account,
      gas: '4700000'
    }, (err, result) => {
      if (result !== undefined && result !== null) {
        res.send(result);
      }
    });
  }
});

router.post('/getaccount', function (req, res, next) {
  var accounts = web3.eth.accounts;
  res.send(accounts);
});

router.post('/transfer',async function (req, res, next) {
  //console.log(req.body.from)
  //console.log(req.body.to)
  console.log(web3.eth.getBalance(req.body.from).toString())
  console.log(web3.eth.getBalance(req.body.to).toString())

  web3.personal.unlockAccount(req.body.from, "", 300)
  var t = await web3.eth.sendTransaction({
    "from":req.body.from,
    "to":req.body.to,
    "value":web3.toWei("1","ether")
  });
  var r = web3.eth.getTransactionReceipt(t);
  console.log(r)
  res.send(t);
});

module.exports = router;
