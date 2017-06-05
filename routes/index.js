var express = require('express');
var router = express.Router();
var fs = require('fs');
var solc = require('solc');
var web3 = require('../web3.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('./public/index.html');
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
  Annuity.new(d.getFullYear(),d.getMonth(),d.getDate(), {
    from: web3.eth.coinbase,
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
  
  var d = new Date();
  contract.confirm(d.getFullYear(),d.getMonth(),d.getDate(),{
    from: web3.eth.coinbase,
    gas: '4700000'
  },(err, result) => {
    if (result !== undefined && result !== null) {
      res.send(result);
    }
  });
});
router.post('/gettrans', function (req, res, next) {
  var receipt = web3.eth.getTransactionReceipt(req.body.hash);
  res.send(receipt);
});

module.exports = router;
